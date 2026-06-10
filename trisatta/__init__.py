"""
trisatta — Advaita Vedānta trisattā doctrine grounded hallucination taxonomy for LLMs.

Ontological Levels:
  L3 Pāramārthika  — Absolute factual truth (verifiable)
  L2 Vyāvahārika   — Pragmatic coherence (plausible but unverified)
  L1 Prātibhāsika  — Apparent coherence (hallucination proper)

Key mechanisms:
  Adhyāsa          — Superimposition of L1 content as L2
  Vivartavāda      — Apparent manifestation without ontological transformation
"""

from trisatta.classifier import SattaClassifier, SattaLevel
from trisatta.scorers import ScorerBundle
from trisatta.fact_store import FactStore

__all__ = ["SattaClassifier", "SattaLevel", "ScorerBundle", "FactStore"]
__version__ = "0.1.0"
