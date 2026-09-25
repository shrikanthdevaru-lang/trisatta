"""
run_nyaya_rag.py — Demo script for the Indian Way of Thinking RAG.
"""

import logging
from trisatta.fact_store import FactStore
from trisatta.scorers import ScorerBundle
from trisatta.classifier import SattaClassifier

from trisatta_rag.retriever import PramanaRetriever
from trisatta_rag.generator import AnumanaGenerator
from trisatta_rag.pipeline import NyayaRagPipeline

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

def main():
    print("Initializing Nyāya-RAG System...\n")
    
    # 1. Śabda: The Knowledge Base
    # Here we populate it with some basic facts for the prototype.
    facts = [
        "Advaita Vedānta is a school of Hindu philosophy.",
        "Adi Shankara is the most prominent exponent of Advaita Vedānta.",
        "Nyāya is one of the six orthodox schools of Hindu philosophy, focusing on logic.",
        "The four Pramāṇas in Nyāya are Pratyakṣa (perception), Anumāna (inference), Upamāna (comparison), and Śabda (testimony).",
        "Trisattā refers to the three levels of reality: Pāramārthika (absolute), Vyāvahārika (pragmatic), and Prātibhāsika (apparent/illusion)."
    ]
    
    fact_store = FactStore()
    fact_store.add_facts(facts)
    
    # 2. Trisattā Evaluator Setup
    scorer_bundle = ScorerBundle(fact_store)
    classifier = SattaClassifier(scorer_bundle)
    
    # 3. Nyāya-RAG Modules
    retriever = PramanaRetriever(fact_store)
    # Using flan-t5-small to keep local inference fast and light
    generator = AnumanaGenerator(model_id="google/flan-t5-small")
    
    # 4. Pipeline Setup
    pipeline = NyayaRagPipeline(retriever, generator, classifier)
    
    # 5. Queries
    queries = [
        "What are the four Pramanas in the Nyaya school of logic?",
        "Who is the main philosopher of Advaita Vedanta?",
        "Explain the three levels of reality in Trisatta."
    ]
    
    for query in queries:
        result = pipeline.run(query)
        result.display()

if __name__ == "__main__":
    main()
