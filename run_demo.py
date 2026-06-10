"""
run_demo.py — End-to-end demonstration of the trisattā hallucination classifier.

Usage
-----
  python run_demo.py [--dataset halueval|truthfulqa|both] [--max-samples N] [--output-dir PATH]

Steps
-----
  1. Load a corpus of (claim, context, binary_label) triples.
  2. Build a FactStore from the correct-answer facts.
  3. Initialise ScorerBundle and SattaClassifier.
  4. Classify each claim.
  5. Print per-item results and summary statistics.
  6. Produce and save the 3×2 confusion matrix heatmap.
"""

from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

import pandas as pd

# ── logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("run_demo")


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Trisattā Hallucination Classifier Demo")
    p.add_argument(
        "--dataset", default="halueval",
        choices=["halueval", "truthfulqa", "both"],
        help="Evaluation corpus (default: halueval)",
    )
    p.add_argument(
        "--max-samples", type=int, default=100,
        help="Maximum corpus items to evaluate (default: 100)",
    )
    p.add_argument(
        "--output-dir", type=Path,
        default=Path(__file__).parent / "output",
        help="Directory for saving heatmap PNG and results CSV",
    )
    p.add_argument(
        "--no-plot", action="store_true",
        help="Skip matplotlib heatmap generation",
    )
    return p.parse_args()


def main() -> None:
    args = parse_args()
    output_dir: Path = args.output_dir
    output_dir.mkdir(parents=True, exist_ok=True)

    # ── 1. Load corpus ────────────────────────────────────────────────────────
    logger.info("Loading corpus: %s (max=%d) …", args.dataset, args.max_samples)
    from trisatta.corpus import load_corpus, CorpusItem
    corpus: list[CorpusItem] = load_corpus(
        dataset=args.dataset,
        max_samples=args.max_samples,
    )
    logger.info("Corpus loaded: %d items", len(corpus))

    if not corpus:
        logger.error("Empty corpus — aborting.")
        sys.exit(1)

    # ── 2. Build FactStore from correct answers ───────────────────────────────
    logger.info("Building FactStore from verified facts …")
    from trisatta.fact_store import FactStore
    correct_facts = [
        item.claim for item in corpus if item.binary_label == "not_hallucinated"
    ]
    fact_store = FactStore()
    fact_store.add_facts(correct_facts)
    logger.info("FactStore: %d facts indexed", len(fact_store))

    # ── 3. Initialise scorers and classifier ──────────────────────────────────
    logger.info("Initialising ScorerBundle and SattaClassifier …")
    from trisatta.scorers import ScorerBundle
    from trisatta.classifier import SattaClassifier, ClassificationResult

    scorer_bundle = ScorerBundle(fact_store=fact_store)
    classifier    = SattaClassifier(scorer_bundle=scorer_bundle)

    # ── 4. Classify ───────────────────────────────────────────────────────────
    logger.info("Classifying %d items …", len(corpus))
    results: list[ClassificationResult] = []
    from tqdm import tqdm
    for item in tqdm(corpus, desc="Classifying", unit="item"):
        result = classifier.classify(claim=item.claim, context=item.context)
        results.append(result)

    gold_labels = [item.binary_label for item in corpus]
    claims      = [item.claim for item in corpus]
    contexts    = [item.context for item in corpus]

    # ── 5. Summary statistics ──────────────────────────────────────────────────
    print("\n" + "="*70)
    print("  TRISATTĀ HALLUCINATION CLASSIFIER — RESULTS SUMMARY")
    print("="*70)

    from collections import Counter
    level_counts = Counter(r.satta_level.value for r in results)
    adhyasa_count = sum(1 for r in results if r.adhyasa_signature)

    print(f"\nCorpus size : {len(corpus)} items")
    print(f"Dataset     : {args.dataset}\n")
    print("Trisattā level distribution:")
    for level_val, count in [
        ("pāramārthika", level_counts.get("pāramārthika", 0)),
        ("vyāvahārika",  level_counts.get("vyāvahārika", 0)),
        ("prātibhāsika", level_counts.get("prātibhāsika", 0)),
    ]:
        pct = 100 * count / len(results) if results else 0
        bar = "█" * int(pct / 2)
        print(f"  {level_val:<18} {count:>4}  ({pct:5.1f}%)  {bar}")

    print(f"\nAdhyāsa (superimposition) detected: {adhyasa_count} "
          f"({100*adhyasa_count/len(results):.1f}% of corpus)")

    # ── 6. Confusion matrix ──────────────────────────────────────────────────
    print("\n--- 3×2 Trisattā ↔ Binary Confusion Matrix ---")
    from trisatta.evaluation import (
        build_confusion_matrix,
        trisatta_classification_report,
        adhyasa_statistics,
        build_results_dataframe,
    )

    out_dir = output_dir if not args.no_plot else None
    cm_df = build_confusion_matrix(results, gold_labels, output_dir=out_dir)
    print(cm_df.to_string())

    # ── 7. Classification report ──────────────────────────────────────────────
    print("\n--- Binary-equivalent Classification Report ---")
    report = trisatta_classification_report(results, gold_labels)
    print(report)

    # ── 8. Adhyāsa statistics ─────────────────────────────────────────────────
    print("--- Adhyāsa (superimposition) Statistics ---")
    adh_stats = adhyasa_statistics(results)
    for k, v in adh_stats.items():
        print(f"  {k:<35}: {v}")

    # ── 9. Sample qualitative outputs ─────────────────────────────────────────
    print("\n--- Sample Classifications (first 5 items) ---")
    for i, (item, result) in enumerate(zip(corpus[:5], results[:5])):
        print(f"\n[{i+1}] Claim   : {item.claim[:80]}")
        print(f"     Context : {item.context[:60]}")
        print(f"     Gold    : {item.binary_label}")
        print(f"     Trisattā: {result.satta_level.value}  (conf={result.confidence:.3f})")
        print(f"     Adhyāsa : {result.adhyasa_signature}")
        print(f"     Scores  : cos_sim={result.scores.cosine_similarity:.3f}  "
              f"nli={result.scores.internal_consistency:.3f}  "
              f"trace={result.scores.source_traceability:.3f}")
        print(f"     Reason  : {result.explanation[:120]}")

    # ── 10. Save full results CSV ─────────────────────────────────────────────
    results_df = build_results_dataframe(results, gold_labels, claims, contexts)
    csv_path   = output_dir / "classification_results.csv"
    results_df.to_csv(csv_path, index=False)
    logger.info("Full results saved to %s", csv_path)

    print(f"\n✓ Results CSV  : {csv_path}")
    if not args.no_plot:
        print(f"✓ Heatmap PNG  : {output_dir / 'confusion_matrix.png'}")
    print("\nDone.\n")


if __name__ == "__main__":
    main()
