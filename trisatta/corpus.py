"""
corpus.py — Data loaders for TruthfulQA and HaluEval.

Each loader returns a list of CorpusItem objects with:
  - claim          : the LLM output / answer to evaluate
  - context        : the question / prompt used as context
  - binary_label   : ground-truth "hallucinated" | "not_hallucinated"
  - source_dataset : dataset name tag

HaluEval QA format (pminervini/HaluEval, qa_samples config)
-------------------------------------------------------------
  Fields: knowledge, question, answer, hallucination ("yes" | "no")
  We use `answer` as the claim, `question` as context, and
  `hallucination == "yes"` → hallucinated, else not_hallucinated.

TruthfulQA generation format
-----------------------------
  Fields: question, best_answer, correct_answers[], incorrect_answers[]
  We treat best_answer / correct_answers as not_hallucinated and
  incorrect_answers as hallucinated, with the question as context.
"""

from __future__ import annotations

import logging
import random
from dataclasses import dataclass
from typing import Literal, Optional

from trisatta.config import MAX_CORPUS_SAMPLES, RANDOM_SEED

logger = logging.getLogger(__name__)

BinaryLabel = Literal["hallucinated", "not_hallucinated"]


@dataclass
class CorpusItem:
    """A single evaluation item."""
    claim:          str
    context:        str
    binary_label:   BinaryLabel
    source_dataset: str


# ── HaluEval loader ──────────────────────────────────────────────────────────

def load_halueval(
    split: str = "data",
    max_samples: int = MAX_CORPUS_SAMPLES,
    seed: int = RANDOM_SEED,
) -> list[CorpusItem]:
    """
    Load HaluEval QA subset from HuggingFace datasets.

    Dataset: pminervini/HaluEval, config: qa_samples
    Real fields: knowledge, question, answer, hallucination (yes|no)

    Falls back to synthetic data if HaluEval is unavailable.
    """
    try:
        from datasets import load_dataset
        logger.info("Loading HaluEval QA …")
        # Note: trust_remote_code removed — not supported in datasets >= 3.x
        ds = load_dataset("pminervini/HaluEval", "qa_samples")
        raw = ds[split] if split in ds else ds[list(ds.keys())[0]]
        items = _parse_halueval(raw, max_samples, seed)
        if not items:
            logger.warning("HaluEval parsed 0 items — falling back to synthetic.")
            return _synthetic_fallback("halueval", max_samples)
        return items
    except Exception as exc:
        logger.warning("HaluEval unavailable (%s). Using fallback corpus.", exc)
        return _synthetic_fallback("halueval", max_samples)


def _parse_halueval(raw, max_samples: int, seed: int) -> list[CorpusItem]:
    """
    Parse HaluEval QA records.

    Each record:
      {'knowledge': '<supporting passage>', 'question': '...', 'answer': '...', 'hallucination': 'yes'|'no'}

    Context strategy: use `knowledge` (declarative passage) as the NLI context,
    with the question appended. This is critical — NLI models need a declarative
    premise, not a question, to produce meaningful entailment scores. The question
    is appended so that source-traceability still captures question-answer overlap.
    """
    items: list[CorpusItem] = []
    for row in raw:
        q         = (row.get("question")  or "").strip()
        knowledge = (row.get("knowledge") or "").strip()
        ans       = (row.get("answer")    or "").strip()
        is_hal    = (row.get("hallucination") or "no").strip().lower() == "yes"
        if ans:
            # Prefer knowledge passage as context; fall back to question
            ctx = f"{knowledge} {q}".strip() if knowledge else q
            items.append(CorpusItem(
                claim          = ans,
                context        = ctx,
                binary_label   = "hallucinated" if is_hal else "not_hallucinated",
                source_dataset = "halueval",
            ))

    rng = random.Random(seed)
    rng.shuffle(items)
    return items[:max_samples]


# ── TruthfulQA loader ─────────────────────────────────────────────────────────

def load_truthfulqa(
    config: str = "generation",
    split: str = "validation",
    max_samples: int = MAX_CORPUS_SAMPLES,
    seed: int = RANDOM_SEED,
) -> list[CorpusItem]:
    """
    Load TruthfulQA from HuggingFace datasets.

    Returns a balanced list of CorpusItem objects.
    Falls back to synthetic data if TruthfulQA is unavailable.
    """
    try:
        from datasets import load_dataset
        logger.info("Loading TruthfulQA (%s/%s) …", config, split)
        # trust_remote_code removed — not supported in datasets >= 3.x
        ds = load_dataset("truthful_qa", config)
        raw = ds[split] if split in ds else ds[list(ds.keys())[0]]
        items = _parse_truthfulqa(raw, max_samples, seed)
        if not items:
            logger.warning("TruthfulQA parsed 0 items — falling back to synthetic.")
            return _synthetic_fallback("truthfulqa", max_samples)
        return items
    except Exception as exc:
        logger.warning("TruthfulQA unavailable (%s). Using fallback corpus.", exc)
        return _synthetic_fallback("truthfulqa", max_samples)


def _parse_truthfulqa(raw, max_samples: int, seed: int) -> list[CorpusItem]:
    items: list[CorpusItem] = []
    for row in raw:
        q = row.get("question", "").strip()
        # Correct answers
        best = row.get("best_answer", "")
        if best:
            items.append(CorpusItem(claim=best, context=q,
                                    binary_label="not_hallucinated",
                                    source_dataset="truthfulqa"))
        for ans in row.get("correct_answers", []):
            if ans and ans.strip():
                items.append(CorpusItem(claim=ans.strip(), context=q,
                                        binary_label="not_hallucinated",
                                        source_dataset="truthfulqa"))
        # Incorrect answers (hallucinated)
        for ans in row.get("incorrect_answers", []):
            if ans and ans.strip():
                items.append(CorpusItem(claim=ans.strip(), context=q,
                                        binary_label="hallucinated",
                                        source_dataset="truthfulqa"))

    rng = random.Random(seed)
    rng.shuffle(items)
    return items[:max_samples]


# ── Synthetic fallback corpus ─────────────────────────────────────────────────

_SYNTHETIC_ITEMS: list[dict] = [
    # Pāramārthika-like (should classify as not-hallucinated)
    {"claim": "The capital of France is Paris.",
     "context": "What is the capital of France?",
     "label": "not_hallucinated"},
    {"claim": "Water boils at 100 degrees Celsius at standard atmospheric pressure.",
     "context": "At what temperature does water boil?",
     "label": "not_hallucinated"},
    {"claim": "The speed of light in a vacuum is approximately 299,792 kilometres per second.",
     "context": "What is the speed of light?",
     "label": "not_hallucinated"},
    {"claim": "Albert Einstein was born in Ulm, Germany in 1879.",
     "context": "Where was Albert Einstein born?",
     "label": "not_hallucinated"},
    {"claim": "Photosynthesis converts light energy into chemical energy stored in glucose.",
     "context": "What is photosynthesis?",
     "label": "not_hallucinated"},
    {"claim": "The Eiffel Tower is located in Berlin.",
     "context": "Where is the Eiffel Tower located?",
     "label": "hallucinated"},
    {"claim": "Napoleon Bonaparte was the first President of the United States.",
     "context": "Who was Napoleon Bonaparte?",
     "label": "hallucinated"},
    {"claim": "The Great Wall of China was built to keep out Martians.",
     "context": "Why was the Great Wall of China built?",
     "label": "hallucinated"},
    {"claim": "DNA stands for Digital Network Architecture.",
     "context": "What does DNA stand for?",
     "label": "hallucinated"},
    {"claim": "The Battle of Hastings was fought in 1066 between Viking and Roman armies.",
     "context": "When was the Battle of Hastings?",
     "label": "hallucinated"},
    # Vyāvahārika-like (plausible but may be unverifiable)
    {"claim": "Most experts agree that exercise improves cognitive function.",
     "context": "Does exercise affect the brain?",
     "label": "not_hallucinated"},
    {"claim": "The Amazon rainforest plays a critical role in regulating global climate.",
     "context": "What is the importance of the Amazon rainforest?",
     "label": "not_hallucinated"},
    {"claim": "In ancient Rome, gladiatorial contests were held to entertain the public.",
     "context": "What were gladiatorial contests?",
     "label": "not_hallucinated"},
    {"claim": "Shakespeare wrote exactly 154 sonnets and 37 plays.",
     "context": "How much did Shakespeare write?",
     "label": "not_hallucinated"},
    {"claim": "Isaac Newton published the Principia in 1787.",
     "context": "When did Newton publish the Principia?",
     "label": "hallucinated"},
]


def _synthetic_fallback(tag: str, max_samples: int) -> list[CorpusItem]:
    """Return hand-crafted corpus items when online datasets are unavailable."""
    logger.info("Using %d synthetic corpus items (tag=%s)", len(_SYNTHETIC_ITEMS), tag)
    items = [
        CorpusItem(
            claim          = d["claim"],
            context        = d["context"],
            binary_label   = d["label"],         # type: ignore[arg-type]
            source_dataset = f"synthetic_{tag}",
        )
        for d in _SYNTHETIC_ITEMS
    ]
    return items[:max_samples]


def load_corpus(
    dataset: str = "halueval",
    max_samples: int = MAX_CORPUS_SAMPLES,
    seed: int = RANDOM_SEED,
) -> list[CorpusItem]:
    """
    Unified entry point for corpus loading.

    Parameters
    ----------
    dataset : "halueval" | "truthfulqa" | "both"
    max_samples : int  Cap on total items returned
    seed : int  RNG seed for shuffling

    Returns
    -------
    list[CorpusItem]
    """
    if dataset == "halueval":
        return load_halueval(max_samples=max_samples, seed=seed)
    elif dataset == "truthfulqa":
        return load_truthfulqa(max_samples=max_samples, seed=seed)
    elif dataset == "both":
        half = max_samples // 2
        return (
            load_halueval(max_samples=half, seed=seed) +
            load_truthfulqa(max_samples=half, seed=seed)
        )
    else:
        raise ValueError(f"Unknown dataset '{dataset}'. Choose halueval | truthfulqa | both.")
