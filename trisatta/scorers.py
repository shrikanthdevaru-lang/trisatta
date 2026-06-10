"""
scorers.py — Three orthogonal scoring functions for trisattā classification.

┌────────────────────────┬───────────────────────────────────────────────────┐
│ Score                  │ Vedāntic mapping                                  │
├────────────────────────┼───────────────────────────────────────────────────┤
│ embedding_similarity   │ Proximity to pāramārthika (absolute) ground truth │
│ internal_consistency   │ Vyāvahārika coherence with context (NLI)          │
│ source_traceability    │ Degree of prātibhāsika dissolution on inspection  │
└────────────────────────┴───────────────────────────────────────────────────┘

All three scores are in [0, 1] with higher = more grounded / more coherent.
"""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from typing import Optional

import numpy as np
from sentence_transformers import CrossEncoder

from trisatta.config import NLI_MODEL, WEIGHT_CONSISTENCY, WEIGHT_SIM, WEIGHT_TRACE
from trisatta.fact_store import FactStore, FactQueryResult

logger = logging.getLogger(__name__)


# ── Data containers ──────────────────────────────────────────────────────────

@dataclass
class ScoreBundle:
    """All three trisattā scores for a single (claim, context) pair."""
    cosine_similarity:    float      # pāramārthika signal
    internal_consistency: float      # vyāvahārika signal
    source_traceability:  float      # prātibhāsika dissolution
    composite:            float      # weighted sum
    nearest_fact:         str = ""   # top fact from the fact store


# ── Individual scorers ────────────────────────────────────────────────────────

class EmbeddingSimilarityScorer:
    """
    Score 1: Embedding cosine similarity to the verified fact store.

    Reflects the pāramārthika dimension — how close is the claim to an
    absolutely grounded, verifiable fact?  A high score means the claim
    is semantically near a known truth; a low score signals it may be
    ontologically prātibhāsika.
    """

    def __init__(self, fact_store: FactStore) -> None:
        self._fs = fact_store

    def score(self, claim: str) -> tuple[float, str]:
        """Returns (cosine_similarity in [0,1], nearest_fact_str)."""
        result: FactQueryResult = self._fs.query(claim)
        return result.cosine_similarity, result.nearest_fact


class InternalConsistencyScorer:
    """
    Score 2: NLI-based internal consistency of claim w.r.t. context.

    Primary: cross-encoder NLI model returning entailment probability.
    Fallback: cosine similarity between context and claim embeddings
              (used when the cross-encoder cannot be downloaded).

    High score → context *supports* the claim (vyāvahārika coherence).
    Low score  → context contradicts / is neutral (prātibhāsika risk).
    """

    # NLI label order for cross-encoder/nli-MiniLM2-L6-H768
    _LABEL2IDX = {"contradiction": 0, "entailment": 1, "neutral": 2}

    def __init__(self, model_name: str = NLI_MODEL) -> None:
        self._cross_encoder = None
        self._fallback_encoder = None
        try:
            logger.info("Loading NLI cross-encoder: %s", model_name)
            from sentence_transformers import CrossEncoder as CE
            self._cross_encoder = CE(model_name)
            logger.info("NLI cross-encoder loaded successfully.")
        except Exception as exc:
            logger.warning(
                "Could not load cross-encoder (%s). "
                "Falling back to cosine-similarity NLI approximation.", exc
            )
            from sentence_transformers import SentenceTransformer
            self._fallback_encoder = SentenceTransformer(EMBEDDING_MODEL)

    def score(self, claim: str, context: str) -> float:
        """
        Returns entailment probability ∈ [0, 1].
        Falls back to 0.5 if context is empty (neutral / unknown).
        """
        if not context or not context.strip():
            return 0.5

        if self._cross_encoder is not None:
            return self._score_nli(claim, context)
        else:
            return self._score_cosine(claim, context)

    def _score_nli(self, claim: str, context: str) -> float:
        logits = self._cross_encoder.predict(
            [(context.strip(), claim.strip())], apply_softmax=True
        )
        probs = logits[0]  # [contradiction, entailment, neutral]
        return float(np.clip(probs[self._LABEL2IDX["entailment"]], 0.0, 1.0))

    def _score_cosine(self, claim: str, context: str) -> float:
        """Cosine-similarity approximation when cross-encoder is unavailable."""
        vecs = self._fallback_encoder.encode(
            [claim.strip(), context.strip()],
            normalize_embeddings=True,
            show_progress_bar=False,
        )
        cos_sim = float(np.dot(vecs[0], vecs[1]))
        return float(np.clip(cos_sim, 0.0, 1.0))


class SourceTraceabilityScorer:
    """
    Score 3: Source-traceability — overlap between claim tokens and context.

    Rationale: Prātibhāsika content "dissolves on inspection", meaning its
    tokens cannot be traced back to the given context.  We measure:

      trace = (|claim_tokens ∩ context_tokens| / |claim_tokens|)
              weighted by token tf-idf importance.

    For simplicity we use a normalised Jaccard coefficient over n-gram sets,
    augmented with a character-level containment bonus for proper nouns.

    A high score means the claim is sourced from the context (vyāvahārika).
    A low score means the claim imports information absent from context (risk
    of adhyāsa — superimposition of unsupported content).
    """

    def __init__(self, ngram_n: int = 1) -> None:
        self._n = ngram_n

    def score(self, claim: str, context: str) -> float:
        if not context or not context.strip():
            return 0.0

        claim_ngrams   = self._ngrams(claim)
        context_ngrams = self._ngrams(context)

        if not claim_ngrams:
            return 0.0

        intersection = claim_ngrams & context_ngrams
        # Directed overlap: |A∩B| / |A|  (how much of the claim is in context)
        directed = len(intersection) / len(claim_ngrams)

        # Jaccard for symmetric measure
        union    = claim_ngrams | context_ngrams
        jaccard  = len(intersection) / len(union) if union else 0.0

        # Proper-noun bonus: capitalised words in claim that appear in context
        proper_nouns_claim   = {w for w in re.findall(r'\b[A-Z][a-z]+\b', claim)}
        proper_nouns_context = {w for w in re.findall(r'\b[A-Z][a-z]+\b', context)}
        pn_overlap = (
            len(proper_nouns_claim & proper_nouns_context) / len(proper_nouns_claim)
            if proper_nouns_claim else 0.0
        )

        # Weighted blend
        trace = 0.6 * directed + 0.25 * jaccard + 0.15 * pn_overlap
        return float(np.clip(trace, 0.0, 1.0))

    def _ngrams(self, text: str) -> set[str]:
        tokens = re.sub(r"[^a-zA-Z0-9\s]", "", text.lower()).split()
        if self._n == 1:
            return set(tokens)
        return {
            " ".join(tokens[i : i + self._n])
            for i in range(len(tokens) - self._n + 1)
        }


# ── Bundle ────────────────────────────────────────────────────────────────────

class ScorerBundle:
    """
    Aggregates all three scorers into a single callable.

    Parameters
    ----------
    fact_store : FactStore
        Pre-loaded verified-fact FAISS index.
    nli_model_name : str
        Cross-encoder NLI model identifier.
    """

    def __init__(
        self,
        fact_store: FactStore,
        nli_model_name: str = NLI_MODEL,
    ) -> None:
        self._sim    = EmbeddingSimilarityScorer(fact_store)
        self._nli    = InternalConsistencyScorer(nli_model_name)
        self._trace  = SourceTraceabilityScorer(ngram_n=1)

    def compute(self, claim: str, context: str) -> ScoreBundle:
        """
        Compute all three scores and their weighted composite.

        Parameters
        ----------
        claim   : str  The LLM output sentence under evaluation.
        context : str  The prompt / reference passage for the LLM.

        Returns
        -------
        ScoreBundle with all scores populated.
        """
        sim_score, nearest_fact = self._sim.score(claim)
        nli_score               = self._nli.score(claim, context)
        trace_score             = self._trace.score(claim, context)

        composite = (
            WEIGHT_SIM        * sim_score
            + WEIGHT_CONSISTENCY * nli_score
            + WEIGHT_TRACE       * trace_score
        )

        return ScoreBundle(
            cosine_similarity    = sim_score,
            internal_consistency = nli_score,
            source_traceability  = trace_score,
            composite            = float(np.clip(composite, 0.0, 1.0)),
            nearest_fact         = nearest_fact,
        )
