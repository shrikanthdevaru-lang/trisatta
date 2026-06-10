"""
classifier.py — Main trisattā hallucination classifier.

Classification Logic
--------------------
Given three scores (s_sim, s_nli, s_trace) and their weighted composite S:

  ┌─────────────────────────────────────────────────────────────────────────┐
  │  IF s_sim >= PARAM_THRESH AND s_nli >= CONSISTENCY_STRONG              │
  │      → Pāramārthika  (absolutely grounded)                             │
  │  ELIF composite >= VYAV_THRESH                                         │
  │      → Vyāvahārika   (pragmatically coherent, but unverified)          │
  │  ELSE                                                                  │
  │      → Prātibhāsika  (hallucination proper)                            │
  └─────────────────────────────────────────────────────────────────────────┘

Adhyāsa Signature
-----------------
Adhyāsa (superimposition) fires when:
  - Trisattā label is Prātibhāsika, AND
  - Composite S is within the "vyāvahārika band" [ADHYASA_LOW, ADHYASA_HIGH)
  → The content *appears* pragmatically coherent but lacks factual grounding.
    This is the precise mechanism of LLM hallucination as vivartavāda:
    apparent manifestation without ontological substance.

Confidence
----------
For Pāramārthika: confidence = s_sim (direct factual backing)
For Vyāvahārika:  confidence = 0.5 * s_nli + 0.5 * composite
For Prātibhāsika: confidence = 1 - composite  (certainty of hallucination)
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional

from trisatta.config import (
    ADHYASA_HIGH,
    ADHYASA_LOW,
    CONSISTENCY_STRONG,
    PARAM_THRESH,
    VYAV_THRESH,
)
from trisatta.scorers import ScoreBundle, ScorerBundle

logger = logging.getLogger(__name__)


# ── Enumerations ──────────────────────────────────────────────────────────────

class SattaLevel(str, Enum):
    """
    Ontological levels from Advaita Vedānta trisattā doctrine.
    String-valued for easy serialisation / DataFrame grouping.
    """
    PARAMARTHIKA  = "pāramārthika"   # L3 — absolute truth
    VYAVAHARIKA   = "vyāvahārika"    # L2 — pragmatic coherence
    PRATIBHASIKA  = "prātibhāsika"   # L1 — apparent / hallucinatory

    @property
    def level(self) -> int:
        return {
            "pāramārthika": 3,
            "vyāvahārika":  2,
            "prātibhāsika": 1,
        }[self.value]

    @property
    def is_hallucination(self) -> bool:
        """Binary hallucination label for comparison with standard classifiers."""
        return self == SattaLevel.PRATIBHASIKA


# ── Output dataclass ──────────────────────────────────────────────────────────

@dataclass
class ClassificationResult:
    """
    Full output of the SattaClassifier.

    Fields
    ------
    satta_level      : trisattā ontological level
    confidence       : scalar confidence in [0, 1]
    adhyasa_signature: True iff adhyāsa (superimposition) is detected
    scores           : raw ScoreBundle (all three component scores)
    nearest_fact     : closest verified fact from the knowledge base
    explanation      : human-readable rationale
    """
    satta_level:       SattaLevel
    confidence:        float
    adhyasa_signature: bool
    scores:            ScoreBundle
    nearest_fact:      str     = ""
    explanation:       str     = ""

    def to_dict(self) -> dict:
        return {
            "satta_level":        self.satta_level.value,
            "confidence":         round(self.confidence, 4),
            "adhyasa_signature":  self.adhyasa_signature,
            "cosine_similarity":  round(self.scores.cosine_similarity, 4),
            "internal_consistency": round(self.scores.internal_consistency, 4),
            "source_traceability":  round(self.scores.source_traceability, 4),
            "composite":          round(self.scores.composite, 4),
            "nearest_fact":       self.nearest_fact[:120],   # truncate for display
            "explanation":        self.explanation,
        }

    @property
    def binary_label(self) -> str:
        """Standard binary label for confusion matrix comparison."""
        return "hallucinated" if self.satta_level.is_hallucination else "not_hallucinated"


# ── Classifier ────────────────────────────────────────────────────────────────

class SattaClassifier:
    """
    Trisattā hallucination classifier.

    Parameters
    ----------
    scorer_bundle : ScorerBundle
        Pre-initialised bundle of all three scorers.
    """

    def __init__(self, scorer_bundle: ScorerBundle) -> None:
        self._scorers = scorer_bundle

    def classify(self, claim: str, context: str = "") -> ClassificationResult:
        """
        Classify a (claim, context) pair into its trisattā ontological level.

        Parameters
        ----------
        claim   : The LLM output sentence to evaluate.
        context : The prompt or reference passage (may be empty).

        Returns
        -------
        ClassificationResult
        """
        scores = self._scorers.compute(claim, context)
        return self._decide(scores)

    def classify_batch(
        self, pairs: list[tuple[str, str]]
    ) -> list[ClassificationResult]:
        """Classify a list of (claim, context) tuples."""
        return [self.classify(claim, ctx) for claim, ctx in pairs]

    # ── decision logic ────────────────────────────────────────────────────

    def _decide(self, scores: ScoreBundle) -> ClassificationResult:
        s_sim   = scores.cosine_similarity
        s_nli   = scores.internal_consistency
        s_trace = scores.source_traceability
        S       = scores.composite

        # ── Level 3: Pāramārthika ─────────────────────────────────────────
        if s_sim >= PARAM_THRESH and s_nli >= CONSISTENCY_STRONG:
            level      = SattaLevel.PARAMARTHIKA
            confidence = s_sim
            adhyasa    = False
            explanation = (
                f"Claim shows strong factual grounding (cos_sim={s_sim:.3f} ≥ "
                f"{PARAM_THRESH}) and is entailed by context (NLI={s_nli:.3f} ≥ "
                f"{CONSISTENCY_STRONG}). Ontologically pāramārthika."
            )

        # ── Level 2: Vyāvahārika ──────────────────────────────────────────
        elif S >= VYAV_THRESH:
            level      = SattaLevel.VYAVAHARIKA
            confidence = 0.5 * s_nli + 0.5 * S
            adhyasa    = False
            explanation = (
                f"Claim is pragmatically coherent (composite={S:.3f} ≥ "
                f"{VYAV_THRESH}) but factual grounding is below pāramārthika "
                f"threshold (cos_sim={s_sim:.3f} < {PARAM_THRESH}). "
                "Ontologically vyāvahārika — plausible but unverified."
            )

        # ── Level 1: Prātibhāsika ─────────────────────────────────────────
        else:
            level      = SattaLevel.PRATIBHASIKA
            confidence = 1.0 - S
            adhyasa    = ADHYASA_LOW <= S < ADHYASA_HIGH
            if adhyasa:
                explanation = (
                    f"Adhyāsa detected: claim appears coherent "
                    f"(composite={S:.3f} ∈ [{ADHYASA_LOW}, {ADHYASA_HIGH})) "
                    "but factual grounding and source-traceability are insufficient. "
                    "Prātibhāsika content is superimposed as vyāvahārika — "
                    "this is the vivartavāda hallucination mechanism."
                )
            else:
                explanation = (
                    f"Claim lacks factual grounding (cos_sim={s_sim:.3f}), "
                    f"contextual support (NLI={s_nli:.3f}), and "
                    f"source-traceability (trace={s_trace:.3f}). "
                    "Ontologically prātibhāsika — hallucination proper."
                )

        return ClassificationResult(
            satta_level       = level,
            confidence        = float(min(max(confidence, 0.0), 1.0)),
            adhyasa_signature = adhyasa,
            scores            = scores,
            nearest_fact      = scores.nearest_fact,
            explanation       = explanation,
        )
