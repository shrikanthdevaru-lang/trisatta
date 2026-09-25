"""
api.py — Trisattā FastAPI backend.

Endpoints
---------
POST /analyse   — Full Pāṇinian śloka analysis with Trisattā verification
GET  /health    — Health check
GET  /sutra     — Retrieve a sūtra by number or keyword
GET  /sutras    — List all loaded sūtras

Run locally:
    GEMINI_API_KEY=your_key uvicorn api:app --reload --port 8000

Deploy to Render.com:
    Build command : pip install -r requirements.txt
    Start command : uvicorn api:app --host 0.0.0.0 --port $PORT
    Env vars      : GEMINI_API_KEY = your_key
"""

from __future__ import annotations

import logging
import os
import sys
import time
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

# ── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("trisatta.api")

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Trisattā — Verified Sanskrit AI",
    description="Pāṇinian śloka analysis grounded in Aṣṭādhyāyī sūtras, verified by the Trisattā hallucination classifier.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Global components (loaded once on startup) ─────────────────────────────
fact_store  = None
retriever   = None
generator   = None
classifier  = None
_loaded_sutras: list[str] = []


@app.on_event("startup")
async def startup_event():
    global fact_store, retriever, generator, classifier, _loaded_sutras

    logger.info("=" * 60)
    logger.info("  TRISATTĀ API — Starting up")
    logger.info("=" * 60)

    # 1. Import trisatta components
    try:
        from trisatta.fact_store import FactStore
        from trisatta.scorers import ScorerBundle
        from trisatta.classifier import SattaClassifier
        from trisatta_rag.retriever import PramanaRetriever
        from trisatta_rag.generator import AnumanaGenerator
        from sutras import get_sutras
    except ImportError as e:
        logger.error("Import error: %s", e)
        logger.error("Run from the project root: uvicorn api:app --reload")
        sys.exit(1)

    # 2. Load sūtras into FactStore
    logger.info("Loading Aṣṭādhyāyī sūtras into FactStore...")
    _loaded_sutras = get_sutras()
    fact_store = FactStore()
    fact_store.add_facts(_loaded_sutras)
    logger.info("FactStore: %d sūtras indexed", len(_loaded_sutras))

    # 3. Retriever
    retriever = PramanaRetriever(fact_store)
    logger.info("PramāṇaRetriever ready (Pratyakṣa + Upamāna)")

    # 4. Generator
    api_key = os.environ.get("GROQ_API_KEY", "")
    if not api_key:
        logger.warning("GROQ_API_KEY not set — analysis will return fallback text.")
    generator = AnumanaGenerator(api_key=api_key)
    logger.info("AnumānaGenerator ready (Groq)")

    # 5. Classifier
    scorer_bundle = ScorerBundle(fact_store=fact_store)
    classifier = SattaClassifier(scorer_bundle=scorer_bundle)
    logger.info("SattāClassifier ready")

    logger.info("=" * 60)
    logger.info("  Trisattā API ready at http://localhost:8000")
    logger.info("=" * 60)


# ── Request / Response models ─────────────────────────────────────────────────

class AnalyseRequest(BaseModel):
    sloka: str = Field(
        ...,
        min_length=2,
        max_length=2000,
        example="धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः",
        description="Sanskrit śloka or sentence in Devanāgarī or IAST",
    )

class ScoresOut(BaseModel):
    cosine_similarity:    float
    internal_consistency: float
    source_traceability:  float
    composite:            float

class SattaOut(BaseModel):
    level:       str
    level_label: str
    confidence:  float
    adhyasa:     bool
    explanation: str
    scores:      ScoresOut
    nearest_sutra: str

class AnalyseResponse(BaseModel):
    sloka:         str
    analysis:      str
    satta:         SattaOut
    context_used:  str
    sections:      dict
    elapsed_ms:    float

class SutraOut(BaseModel):
    number:  str
    text:    str
    full:    str


# ── Helpers ───────────────────────────────────────────────────────────────────

LEVEL_LABELS = {
    "pāramārthika": "Pāramārthika (L3) — Verified against sūtra",
    "vyāvahārika":  "Vyāvahārika (L2) — Pragmatically coherent",
    "prātibhāsika": "Prātibhāsika (L1) — Likely hallucinated",
}


def _parse_sections(analysis_text: str) -> dict:
    sections = {}
    current_key = "preamble"
    current_lines = []

    for line in analysis_text.split("\n"):
        line_s = line.strip()
        if line_s.startswith("##") or line_s.startswith("**##"):
            if current_lines:
                sections[current_key] = "\n".join(current_lines).strip()
            header = line_s.lstrip("*#").strip()
            key = (
                header.lower()
                .replace("(", "").replace(")", "")
                .replace(" ", "_")
                .replace("-", "_")
                .replace("ā", "a").replace("ī", "i").replace("ū", "u")
                .replace("ś", "sh").replace("ṣ", "sh").replace("ṭ", "t")
                .replace("ḍ", "d").replace("ṇ", "n").replace("ṃ", "m")
                .replace("ḥ", "h").replace("ṛ", "r").replace("ḷ", "l")
            )
            current_key = key
            current_lines = []
        else:
            current_lines.append(line)

    if current_lines:
        sections[current_key] = "\n".join(current_lines).strip()

    return {k: v for k, v in sections.items() if v and k != "preamble"}

# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/health", tags=["System"])
async def health():
    """Health check — returns status and number of sūtras loaded."""
    return {
        "status":        "ok",
        "sutras_loaded": len(_loaded_sutras),
        "gemini":        generator._client is not None if generator else False,
    }


@app.post("/analyse", response_model=AnalyseResponse, tags=["Analysis"])
async def analyse(req: AnalyseRequest):
    """
    Full Pāṇinian śloka analysis with Trisattā verification.

    Pipeline:
    1. Retrieve relevant sūtras from FAISS (Pratyakṣa + Upamāna)
    2. Generate grounded analysis via Gemini (constrained to retrieved sūtras)
    3. Classify the analysis with Trisattā (L3/L2/L1 + Adhyāsa flag)
    4. Return structured result with per-section parsing
    """
    if fact_store is None or classifier is None:
        raise HTTPException(status_code=503, detail="API still initialising. Try again in a moment.")

    t_start = time.perf_counter()
    sloka = req.sloka.strip()

    # Step 1 — Retrieve
    context = retriever.retrieve_context(sloka)
    logger.info("Context retrieved: %d chars", len(context))

    # Step 2 — Generate
    analysis = generator.generate(sloka, context)
    logger.info("Analysis generated: %d chars", len(analysis))

    # Step 3 — Classify
    result = classifier.classify(claim=analysis, context=context)

    # Step 4 — Parse sections
    sections = _parse_sections(analysis)
    with open("/tmp/last_analysis.txt", "w") as out_f:
        out_f.write(analysis)

    elapsed = (time.perf_counter() - t_start) * 1000

    level = result.satta_level.value

    return AnalyseResponse(
        sloka=sloka,
        analysis=analysis,
        satta=SattaOut(
            level=level,
            level_label=LEVEL_LABELS.get(level, level),
            confidence=round(result.confidence, 3),
            adhyasa=result.adhyasa_signature,
            explanation=result.explanation,
            scores=ScoresOut(
                cosine_similarity=round(result.scores.cosine_similarity, 3),
                internal_consistency=round(result.scores.internal_consistency, 3),
                source_traceability=round(result.scores.source_traceability, 3),
                composite=round(result.scores.composite, 3),
            ),
            nearest_sutra=result.nearest_fact[:200],
        ),
        context_used=context,
        sections=sections,
        elapsed_ms=round(elapsed, 1),
    )


@app.get("/sutras", tags=["Corpus"])
async def list_sutras(limit: int = 80):
    """List all loaded sūtras (ground truth corpus)."""
    return {
        "count": len(_loaded_sutras),
        "sutras": _loaded_sutras[:limit],
    }


@app.get("/sutra", tags=["Corpus"])
async def search_sutra(q: str):
    """
    Search for a sūtra by number or keyword.
    Example: /sutra?q=6.1.77  or  /sutra?q=sandhi
    """
    q_lower = q.lower()
    matches = [
        s for s in _loaded_sutras
        if q_lower in s.lower()
    ]
    if not matches:
        raise HTTPException(status_code=404, detail=f"No sūtra found matching '{q}'")
    return {"query": q, "matches": matches[:10]}


# ── Frontend serving ─────────────────────────────────────────────────────────

import pathlib
_PROJECT_DIR = pathlib.Path(__file__).resolve().parent


@app.get("/", tags=["Frontend"], include_in_schema=False)
async def serve_frontend():
    """Serve the main frontend page."""
    return FileResponse(_PROJECT_DIR / "index.html")
