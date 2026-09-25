"""
pipeline.py — The complete Nyāya-RAG Pipeline.

Connects the PramanaRetriever, AnumanaGenerator, and the SattaClassifier
to form a fully verifiable generation pipeline.
"""

import logging
from dataclasses import dataclass
from typing import Optional

from trisatta.classifier import SattaClassifier, ClassificationResult
from trisatta_rag.retriever import PramanaRetriever
from trisatta_rag.generator import AnumanaGenerator

logger = logging.getLogger(__name__)

@dataclass
    
class NyayaRagResult:
    """The final output of the Nyāya-RAG pipeline."""
    query: str
    retrieved_context: str
    generated_answer: str
    trisatta_evaluation: ClassificationResult
    
    def display(self):
        print("="*60)
        print(f"Query: {self.query}")
        print("-" * 60)
        print(f"Context (Pratyakṣa + Upamāna):\n{self.retrieved_context}")
        print("-" * 60)
        print(f"Generated Answer (Anumāna):\n{self.generated_answer}")
        print("-" * 60)
        print(f"Ontological Evaluation:")
        print(f"  Level:      {self.trisatta_evaluation.satta_level.value.upper()}")
        print(f"  Confidence: {self.trisatta_evaluation.confidence:.2f}")
        print(f"  Adhyāsa:    {'DETECTED' if self.trisatta_evaluation.adhyasa_signature else 'None'}")
        print(f"  Rationale:  {self.trisatta_evaluation.explanation}")
        print("="*60)


class NyayaRagPipeline:
    """
    The full RAG pipeline mapping to Indian Epistemology.
    """
    def __init__(self, retriever: PramanaRetriever, generator: AnumanaGenerator, classifier: SattaClassifier):
        self.retriever = retriever
        self.generator = generator
        self.classifier = classifier

    def run(self, query: str) -> NyayaRagResult:
        """
        Executes the Nyāya-RAG process.
        """
        logger.info("Starting Nyāya-RAG execution for query: %s", query)
        
        # 1. Retrieval (Pratyakṣa + Upamāna)
        context = self.retriever.retrieve_context(query)
        
        # 2. Generation (Anumāna)
        answer = self.generator.generate(query, context)
        
        # 3. Evaluation (Trisattā)
        # We classify the generated claim against the context provided.
        # This determines if the LLM hallucinated beyond the context (vivartavāda)
        # or if it stayed grounded (Pāramārthika/Vyāvahārika).
        evaluation = self.classifier.classify(claim=answer, context=context)
        
        return NyayaRagResult(
            query=query,
            retrieved_context=context,
            generated_answer=answer,
            trisatta_evaluation=evaluation
        )
