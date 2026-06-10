"""
evaluation.py — Confusion matrix and metrics comparing trisattā vs. binary classification.

Produces:
  1. A 3×2 DataFrame mapping each trisattā level to binary predictions
  2. A seaborn heatmap saved as PNG
  3. Classification report (precision / recall / F1 per trisattā level)
  4. Adhyāsa incidence statistics

Mapping from trisattā to binary for comparison:
  Pāramārthika  → not_hallucinated
  Vyāvahārika   → not_hallucinated
  Prātibhāsika  → hallucinated

The key finding the confusion matrix exposes:
  Standard binary classifiers cannot distinguish Pāramārthika from Vyāvahārika
  (both map to "not hallucinated"), nor detect adhyāsa cases where Prātibhāsika
  content is superimposed as Vyāvahārika.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Optional

import matplotlib
matplotlib.use("Agg")   # non-interactive backend — safe for headless runs
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix

from trisatta.classifier import ClassificationResult, SattaLevel

logger = logging.getLogger(__name__)


# ── Confusion matrix ──────────────────────────────────────────────────────────

def build_confusion_matrix(
    results:       list[ClassificationResult],
    gold_labels:   list[str],               # "hallucinated" | "not_hallucinated"
    output_dir:    Optional[Path] = None,
) -> pd.DataFrame:
    """
    Build a 3×2 confusion matrix: trisattā level (rows) × binary gold label (cols).

    Parameters
    ----------
    results     : Classifier outputs for each corpus item.
    gold_labels : Ground-truth binary labels aligned with results.
    output_dir  : If provided, saves heatmap PNG and CSV here.

    Returns
    -------
    pd.DataFrame with shape (3, 2) — rows = sattā levels, cols = gold labels.
    """
    assert len(results) == len(gold_labels), (
        f"Mismatch: {len(results)} results vs {len(gold_labels)} labels."
    )

    trisatta_labels = [r.satta_level.value for r in results]
    unique_satta    = [s.value for s in [
        SattaLevel.PARAMARTHIKA,
        SattaLevel.VYAVAHARIKA,
        SattaLevel.PRATIBHASIKA,
    ]]
    binary_cols = ["not_hallucinated", "hallucinated"]

    # Build the 3×2 count matrix
    data = {col: {row: 0 for row in unique_satta} for col in binary_cols}
    for ts_label, gold in zip(trisatta_labels, gold_labels):
        if gold in binary_cols and ts_label in unique_satta:
            data[gold][ts_label] += 1

    df = pd.DataFrame(data, index=unique_satta)[binary_cols]

    logger.info("\n=== 3×2 Trisattā ↔ Binary Confusion Matrix ===\n%s", df.to_string())

    if output_dir is not None:
        _plot_heatmap(df, output_dir)
        csv_path = output_dir / "confusion_matrix.csv"
        df.to_csv(csv_path)
        logger.info("Confusion matrix saved to %s", csv_path)

    return df


def _plot_heatmap(df: pd.DataFrame, output_dir: Path) -> None:
    """Render and save the 3×2 heatmap with a Vedāntic colour palette."""
    output_dir.mkdir(parents=True, exist_ok=True)

    # Sanskrit labels for y-axis
    row_labels = [
        "Pāramārthika\n(L3 — Absolute)",
        "Vyāvahārika\n(L2 — Pragmatic)",
        "Prātibhāsika\n(L1 — Hallucinatory)",
    ]
    col_labels = ["Not Hallucinated\n(binary)", "Hallucinated\n(binary)"]

    fig, ax = plt.subplots(figsize=(9, 6))

    sns.heatmap(
        df,
        annot=True,
        fmt="d",
        cmap=sns.diverging_palette(240, 10, as_cmap=True),
        linewidths=0.8,
        linecolor="#2a2a3e",
        ax=ax,
        cbar_kws={"label": "Count"},
    )

    ax.set_xticklabels(col_labels, fontsize=11, fontweight="bold")
    ax.set_yticklabels(row_labels, fontsize=10, rotation=0, va="center")
    ax.set_xlabel("Binary Ground-Truth Label", fontsize=12, labelpad=10)
    ax.set_ylabel("Trisattā Predicted Level", fontsize=12, labelpad=10)
    ax.set_title(
        "Trisattā Taxonomy vs. Standard Binary Hallucination Detection\n"
        "(Advaita Vedānta trisattā doctrine — Adhyāsa analysis)",
        fontsize=13, fontweight="bold", pad=15,
    )

    plt.tight_layout()
    png_path = output_dir / "confusion_matrix.png"
    fig.savefig(png_path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    logger.info("Heatmap saved to %s", png_path)


# ── Classification report ─────────────────────────────────────────────────────

def trisatta_classification_report(
    results:     list[ClassificationResult],
    gold_labels: list[str],
) -> str:
    """
    Sklearn classification report treating trisattā levels as predicted classes
    and binary gold labels binarised to {pāramārthika+vyāvahārika, prātibhāsika}.
    """
    # Map gold to trisattā-scale: not_hallucinated → {param | vyav}, hallucinated → prati
    pred_binary = [r.binary_label for r in results]
    report = classification_report(
        y_true = gold_labels,
        y_pred = pred_binary,
        labels = ["hallucinated", "not_hallucinated"],
        target_names = ["Hallucinated (binary)", "Not-Hallucinated (binary)"],
    )
    logger.info("\n=== Binary-level Classification Report ===\n%s", report)
    return report


# ── Adhyāsa statistics ─────────────────────────────────────────────────────────

def adhyasa_statistics(results: list[ClassificationResult]) -> dict:
    """
    Compute adhyāsa incidence statistics across the corpus.

    Returns a dict with:
      total_adhyasa       : count of adhyāsa-flagged items
      adhyasa_rate        : fraction of corpus
      adhyasa_in_prati    : among Prātibhāsika items, adhyāsa fraction
      mean_composite_adhyasa   : mean composite score for adhyāsa items
      mean_composite_normal    : mean composite score for non-adhyāsa items
    """
    adhyasa_items   = [r for r in results if r.adhyasa_signature]
    prati_items     = [r for r in results if r.satta_level == SattaLevel.PRATIBHASIKA]

    total   = len(results)
    n_adh   = len(adhyasa_items)
    n_prati = len(prati_items)

    mean_comp_adh = (
        float(np.mean([r.scores.composite for r in adhyasa_items]))
        if adhyasa_items else 0.0
    )
    mean_comp_normal = (
        float(np.mean([r.scores.composite for r in results if not r.adhyasa_signature]))
        if any(not r.adhyasa_signature for r in results) else 0.0
    )

    stats = {
        "total_adhyasa":           n_adh,
        "adhyasa_rate":            round(n_adh / total, 4) if total else 0.0,
        "adhyasa_in_pratibhasika": round(n_adh / n_prati, 4) if n_prati else 0.0,
        "mean_composite_adhyasa":  round(mean_comp_adh, 4),
        "mean_composite_normal":   round(mean_comp_normal, 4),
    }
    logger.info("Adhyāsa statistics: %s", stats)
    return stats


# ── Summary table ─────────────────────────────────────────────────────────────

def build_results_dataframe(
    results:     list[ClassificationResult],
    gold_labels: list[str],
    claims:      list[str],
    contexts:    list[str],
) -> pd.DataFrame:
    """Build a tidy DataFrame of all classification results for export."""
    rows = []
    for i, (result, gold, claim, ctx) in enumerate(
        zip(results, gold_labels, claims, contexts)
    ):
        row = result.to_dict()
        row.update({
            "idx":          i,
            "claim":        claim[:100],
            "context":      ctx[:80],
            "gold_label":   gold,
            "correct":      result.binary_label == gold,
        })
        rows.append(row)
    return pd.DataFrame(rows)
