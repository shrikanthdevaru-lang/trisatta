"""
fact_store.py — Verified-fact knowledge base backed by a FAISS index.

Design
------
FactStore wraps a SentenceTransformer encoder and a flat FAISS L2 index
(converted to cosine similarity via normalised vectors).

Facts are sourced from:
  • TruthfulQA "best_answer" fields (ground-truth correct answers)
  • HaluEval "right_answer" fields (verified answers)
  • Optional user-supplied list of strings

The `query` method returns the maximum cosine similarity between a claim
and the nearest stored fact, serving as the pāramārthika signal.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Optional

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

from trisatta.config import (
    EMBEDDING_MODEL,
    FAISS_TOPK,
    FAISS_NPROBE,
)

logger = logging.getLogger(__name__)


@dataclass
class FactQueryResult:
    """Result of a single fact-store query."""
    cosine_similarity: float          # in [0, 1]
    nearest_fact: str                  # the matched ground-truth fact
    fact_index: int                    # position in the fact list


class FactStore:
    """
    In-memory FAISS-backed verified-fact knowledge base.

    Parameters
    ----------
    model_name : str
        HuggingFace model id for the sentence encoder.
    facts : list[str] | None
        Pre-loaded fact strings. If None, call `add_facts()` before `query()`.
    """

    def __init__(
        self,
        model_name: str = EMBEDDING_MODEL,
        facts: Optional[list[str]] = None,
    ) -> None:
        logger.info("Loading sentence encoder: %s", model_name)
        self._encoder = SentenceTransformer(model_name)
        self._dim: int = self._encoder.get_sentence_embedding_dimension()
        self._facts: list[str] = []
        self._index: faiss.IndexFlatIP = faiss.IndexFlatIP(self._dim)  # inner-product (cosine on L2-normed vecs)

        if facts:
            self.add_facts(facts)

    # ── public API ─────────────────────────────────────────────────────────

    def add_facts(self, facts: list[str]) -> None:
        """Encode and index a batch of verified facts."""
        if not facts:
            return
        embeddings = self._encode(facts)
        self._index.add(embeddings)
        self._facts.extend(facts)
        logger.info("FactStore: indexed %d facts (total=%d)", len(facts), len(self._facts))

    def query(self, claim: str) -> FactQueryResult:
        """
        Return the cosine similarity between `claim` and the nearest fact.

        Returns cosine_similarity=0.0 if the store is empty.
        """
        if self._index.ntotal == 0:
            logger.warning("FactStore is empty; returning zero similarity.")
            return FactQueryResult(cosine_similarity=0.0, nearest_fact="", fact_index=-1)

        vec = self._encode([claim])                      # (1, dim)
        sims, indices = self._index.search(vec, k=FAISS_TOPK)

        top_sim: float   = float(np.clip(sims[0][0], 0.0, 1.0))
        top_idx: int     = int(indices[0][0])
        top_fact: str    = self._facts[top_idx] if top_idx >= 0 else ""

        return FactQueryResult(
            cosine_similarity=top_sim,
            nearest_fact=top_fact,
            fact_index=top_idx,
        )

    def __len__(self) -> int:
        return len(self._facts)

    # ── internal ───────────────────────────────────────────────────────────

    def _encode(self, texts: list[str]) -> np.ndarray:
        """Encode texts and L2-normalise for cosine-similarity via inner product."""
        vecs = self._encoder.encode(
            texts,
            convert_to_numpy=True,
            normalize_embeddings=True,   # crucial for IP→cosine equivalence
            show_progress_bar=False,
        )
        return vecs.astype(np.float32)

    @classmethod
    def from_truthfulqa(cls, dataset, model_name: str = EMBEDDING_MODEL) -> "FactStore":
        """
        Build a FactStore from a TruthfulQA HuggingFace dataset split.

        Extracts 'best_answer' (generation config) as the verified fact set.
        """
        facts: list[str] = []
        for row in dataset:
            ans = row.get("best_answer", "") or row.get("correct_answers", "")
            if isinstance(ans, list):
                facts.extend([a for a in ans if a.strip()])
            elif isinstance(ans, str) and ans.strip():
                facts.append(ans.strip())
        logger.info("TruthfulQA: extracted %d facts", len(facts))
        store = cls(model_name=model_name)
        store.add_facts(facts)
        return store

    @classmethod
    def from_halueval(cls, dataset, model_name: str = EMBEDDING_MODEL) -> "FactStore":
        """
        Build a FactStore from a HaluEval QA HuggingFace dataset split.

        Extracts 'right_answer' fields as the verified fact set.
        """
        facts: list[str] = []
        for row in dataset:
            ans = row.get("right_answer", "") or row.get("answer", "")
            if isinstance(ans, str) and ans.strip():
                facts.append(ans.strip())
        logger.info("HaluEval: extracted %d facts", len(facts))
        store = cls(model_name=model_name)
        store.add_facts(facts)
        return store
