"""
config.py — Thresholds and constants for the trisattā classifier.

Tuning guide
------------
The three scores (cosine similarity, NLI consistency, traceability) are
individually thresholded and then combined with a weighted sum.

Ontological decision rules (applied in priority order):
  1. If cos_sim   >= PARAM_THRESH  → candidate for Pāramārthika
  2. If consistency >= VYAV_THRESH  → candidate for Vyāvahārika
  3. Otherwise                     → Prātibhāsika

Adhyāsa fires when:
  - The raw trisattā label is Prātibhāsika, AND
  - The weighted composite score falls inside the Vyāvahārika band
    (ADHYASA_LOW <= composite < ADHYASA_HIGH)
  This captures the "superimposition" mechanism: the content *looks* vyāvahārika
  but its factual grounding is prātibhāsika.
"""

# ── Embedding similarity thresholds ─────────────────────────────────────────
# cosine distance to the nearest verified fact in the fact store
PARAM_THRESH: float = 0.82   # ≥ this → strong pāramārthika signal
VYAV_THRESH:  float = 0.55   # ≥ this (but < PARAM_THRESH) → vyāvahārika signal
# < VYAV_THRESH → prātibhāsika signal

# ── Internal consistency thresholds (NLI entailment score) ───────────────────
CONSISTENCY_STRONG: float = 0.80   # claim is entailed by context
CONSISTENCY_WEAK:   float = 0.50   # claim is not contradicted by context

# ── Source-traceability thresholds ───────────────────────────────────────────
TRACE_STRONG: float = 0.70   # high overlap with context tokens
TRACE_WEAK:   float = 0.40   # partial overlap

# ── Composite score weights ──────────────────────────────────────────────────
WEIGHT_SIM:        float = 0.45
WEIGHT_CONSISTENCY: float = 0.30
WEIGHT_TRACE:      float = 0.25

# ── Adhyāsa band (composite score) ───────────────────────────────────────────
ADHYASA_LOW:  float = 0.40
ADHYASA_HIGH: float = 0.65

# ── Model identifiers ─────────────────────────────────────────────────────────
# SWADESHI UPGRADE: Replaced English-only 'MiniLM' with a Multilingual 
# model natively trained on Sanskrit, Hindi, and 50+ languages.
EMBEDDING_MODEL:    str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
NLI_MODEL:          str = "cross-encoder/nli-MiniLM2-L6-H768"

# ── Corpus settings ───────────────────────────────────────────────────────────
HALUEVAL_SPLIT:     str = "data"   # HaluEval QA split key
TRUTHFULQA_CONFIG:  str = "generation"
MAX_CORPUS_SAMPLES: int = 500      # cap for quick evaluation

# ── FAISS index settings ──────────────────────────────────────────────────────
FAISS_NPROBE:  int = 8
FAISS_TOPK:    int = 1            # return single nearest fact

# ── Reproducibility ───────────────────────────────────────────────────────────
RANDOM_SEED:   int = 42
