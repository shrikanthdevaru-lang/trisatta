"""
retriever.py — Implements the Pramāṇa-based retrieval module.

Contains:
- PratyakshaRetriever: Exact lexical/keyword matching.
- UpamanaRetriever: Semantic similarity search (via FactStore).
- PramanaRetriever: Combines both approaches.
"""

import logging
from typing import List, Dict

from trisatta.fact_store import FactStore

logger = logging.getLogger(__name__)


class PratyakshaRetriever:
    """
    Direct Perception Retrieval (Lexical / Exact Match).
    In a full production system, this would use BM25 or ElasticSearch.
    For this prototype, it uses a simple keyword overlap metric over the FactStore.
    """
    def __init__(self, fact_store: FactStore):
        self.fact_store = fact_store
        # We access the private _facts list just for the prototype's lexical search
        self.documents = self.fact_store._facts

    def retrieve(self, query: str, top_k: int = 2) -> List[str]:
        if not self.documents:
            return []
        
        query_terms = set(query.lower().split())
        
        scores = []
        for doc in self.documents:
            doc_terms = set(doc.lower().split())
            overlap = len(query_terms.intersection(doc_terms))
            scores.append((overlap, doc))
            
        # Sort by overlap descending
        scores.sort(key=lambda x: x[0], reverse=True)
        
        # Filter out 0 overlap
        results = [doc for score, doc in scores[:top_k] if score > 0]
        logger.info("Pratyakṣa retrieved %d documents", len(results))
        return results


class UpamanaRetriever:
    """
    Analogy/Comparison Retrieval (Semantic Search).
    Uses the existing FAISS-backed FactStore from Trisattā.
    """
    def __init__(self, fact_store: FactStore):
        self.fact_store = fact_store

    def retrieve(self, query: str) -> str:
        """Returns the single nearest semantic match using Upamāna (comparison)."""
        result = self.fact_store.query(query)
        if result.cosine_similarity > 0.0:
            logger.info("Upamāna retrieved fact with similarity %.3f", result.cosine_similarity)
            return result.nearest_fact
        return ""


class PramanaRetriever:
    """
    The unified retriever combining valid means of knowledge.
    """
    def __init__(self, fact_store: FactStore):
        self.fact_store = fact_store
        self.pratyaksha = PratyakshaRetriever(fact_store)
        self.upamana = UpamanaRetriever(fact_store)

    def retrieve_context(self, query: str) -> str:
        """
        Retrieves context using both Pratyakṣa (exact) and Upamāna (semantic).
        Returns a formatted context string.
        """
        exact_matches = self.pratyaksha.retrieve(query)
        semantic_match = self.upamana.retrieve(query)
        
        context_parts = []
        if exact_matches:
            context_parts.append("Directly Observed Facts (Pratyakṣa):")
            for m in exact_matches:
                context_parts.append(f"- {m}")
                
        if semantic_match and semantic_match not in exact_matches:
            context_parts.append("Analogous Semantic Facts (Upamāna):")
            context_parts.append(f"- {semantic_match}")
            
        return "\n".join(context_parts)
