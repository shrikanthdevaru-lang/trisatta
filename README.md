# Trisattā: An Advaita Vedānta-Grounded Hallucination Taxonomy for LLMs

<div align="center">

[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/)
[![HuggingFace](https://img.shields.io/badge/🤗-HuggingFace-yellow)](https://huggingface.co/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

*A three-tier ontological hallucination classifier grounded in Advaita Vedānta's trisattā doctrine*

</div>

---

## Overview

Standard hallucination detection in Large Language Models (LLMs) uses a **binary label**: hallucinated / not-hallucinated. This collapses epistemologically distinct failure modes into a single undifferentiated class.

**Trisattā** introduces a strictly more expressive three-tier taxonomy inspired by the ontological levels (sattā) in Advaita Vedānta philosophy:

| Level | Sanskrit | Meaning | Classifier Behaviour |
|-------|----------|---------|---------------------|
| **L3** | Pāramārthika | Absolute truth | Verifiable against a fact store; zero false positives |
| **L2** | Vyāvahārika | Pragmatic coherence | Grammatically valid, semantically plausible, unverified |
| **L1** | Prātibhāsika | Apparent coherence | Dissolves on factual inspection; hallucination proper |

The key mechanism — **adhyāsa** (superimposition) — is detected when prātibhāsika content is misidentified as vyāvahārika by surface-level coherence checks. This is the precise failure mode of all binary hallucination detectors.

---

## Results (HaluEval, n=100)

```
              not_hallucinated  hallucinated
pāramārthika        15              0        ← 100% precision, zero false positives
vyāvahārika         34              7        ← "gray zone" binary classifiers miss 7 here
prātibhāsika         6             38        ← hallucination proper
```

| Metric | Value |
|--------|-------|
| Binary-level Accuracy | **87%** |
| Hallucinated F1 | **0.85** |
| Adhyāsa cases detected | **11% of corpus** |

> **Key finding**: 7 hallucinated items land in the Vyāvahārika zone — they would be labelled *not-hallucinated* by any binary system. The trisattā framework exposes them. Additionally, 15 Pāramārthika items achieve zero false positives — a high-confidence trust tier binary systems cannot represent.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SattaClassifier                       │
├─────────────────┬──────────────────┬────────────────────┤
│ Score 1         │ Score 2          │ Score 3            │
│ Embedding       │ Internal         │ Source             │
│ Similarity      │ Consistency      │ Traceability       │
│ (FAISS cosine)  │ (NLI cross-enc.) │ (n-gram overlap)   │
│ → Pāramārthika  │ → Vyāvahārika    │ → Prātibhāsika     │
│   proximity     │   coherence      │   dissolution      │
└─────────────────┴──────────────────┴────────────────────┘
                           │
                ┌──────────▼──────────┐
                │  Adhyāsa Detector   │
                │  (superimposition)  │
                │  fires when L1      │
                │  appears as L2      │
                └─────────────────────┘
```

**Models used:**
- `sentence-transformers/all-MiniLM-L6-v2` — embedding similarity
- `cross-encoder/nli-MiniLM2-L6-H768` — NLI entailment scoring
- `faiss-cpu` — fast nearest-neighbour retrieval

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/trisatta-hallucination.git
cd trisatta-hallucination

# 2. Install
python3 -m pip install -r requirements.txt

# 3. Run on HaluEval
python3 run_demo.py --max-samples 100 --dataset halueval --output-dir output

# 4. Run on TruthfulQA
python3 run_demo.py --max-samples 100 --dataset truthfulqa --output-dir output_tqa
```

---

## Classify a Custom Claim

```python
from trisatta import SattaClassifier, ScorerBundle, FactStore

# Build your knowledge base
fact_store = FactStore()
fact_store.add_facts([
    "Paris is the capital of France.",
    "The speed of light is approximately 299,792 km/s.",
])

# Initialise classifier
classifier = SattaClassifier(ScorerBundle(fact_store))

# Classify
result = classifier.classify(
    claim   = "Paris is the capital of Germany.",
    context = "France is a Western European country. Its capital is Paris."
)

print(result.satta_level)        # prātibhāsika
print(result.confidence)         # 0.73
print(result.adhyasa_signature)  # True — vivartavāda hallucination mechanism
print(result.explanation)        # human-readable rationale
```

---

## Module Reference

| Module | Class / Function | Purpose |
|--------|-----------------|---------|
| `trisatta/classifier.py` | `SattaClassifier` | Main classifier |
| `trisatta/classifier.py` | `SattaLevel` | Enum: PARAMARTHIKA / VYAVAHARIKA / PRATIBHASIKA |
| `trisatta/fact_store.py` | `FactStore` | FAISS-backed verified-fact knowledge base |
| `trisatta/scorers.py` | `ScorerBundle` | Aggregates all three scorers |
| `trisatta/corpus.py` | `load_corpus()` | HaluEval / TruthfulQA / synthetic loaders |
| `trisatta/evaluation.py` | `build_confusion_matrix()` | 3×2 matrix + heatmap |
| `trisatta/config.py` | constants | All tunable thresholds |

---

## Threshold Tuning

All thresholds are in `trisatta/config.py`:

| Parameter | Default | Effect |
|-----------|---------|--------|
| `PARAM_THRESH` | 0.82 | Cosine sim required for Pāramārthika |
| `VYAV_THRESH` | 0.55 | Composite score for Vyāvahārika |
| `CONSISTENCY_STRONG` | 0.80 | NLI entailment strength for Pāramārthika |
| `ADHYASA_LOW / HIGH` | 0.40 – 0.65 | Composite band for adhyāsa detection |
| `WEIGHT_SIM` | 0.45 | Cosine similarity weight in composite |
| `WEIGHT_CONSISTENCY` | 0.30 | NLI weight in composite |
| `WEIGHT_TRACE` | 0.25 | Source-traceability weight in composite |

---

## Theoretical Background

The framework draws on three Advaita Vedānta concepts:

- **Trisattā** — three levels of being: absolute (*pāramārthika*), conventional (*vyāvahārika*), apparent (*prātibhāsika*)
- **Adhyāsa** — superimposition of an illusory object onto a real substrate (the mechanism of hallucination)
- **Vivartavāda** — apparent manifestation without ontological transformation (LLM fluency without factual grounding)

See `theoretical_contribution.md` for the full 530-word academic argument.

---

## Citation

```bibtex
@article{trisatta2025,
  title   = {Trisatt\={a}: An Advaita Ved\={a}nta-Grounded Hallucination Taxonomy for Large Language Models},
  author  = {Your Name},
  year    = {2025},
  note    = {Preprint. Code: https://github.com/YOUR\_USERNAME/trisatta-hallucination}
}
```

---

## License

MIT License. See [LICENSE](LICENSE).
