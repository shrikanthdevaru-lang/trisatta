# Theoretical Contribution

## Trisattā as a Strictly More Expressive Hallucination Taxonomy for Large Language Models

> **Word count: ~530**

---

Contemporary hallucination detection in large language models (LLMs) operates
predominantly within a binary ontology: an output sentence is classified as
either *hallucinated* or *not hallucinated* (Maynez et al., 2020; Ji et al.,
2023). While computationally convenient, this dichotomy conflates
epistemologically distinct failure modes and obscures the generative mechanism
that produces erroneous outputs. We argue that Advaita Vedānta's *trisattā*
doctrine—a three-tier ontological hierarchy comprising *pāramārthika*,
*vyāvahārika*, and *prātibhāsika* levels of reality—furnishes a strictly more
expressive and theoretically motivated taxonomy that resolves these limitations.

**Expressiveness beyond binary detection.** Binary classification partitions
the output space into two equivalence classes. The trisattā taxonomy imposes a
strict refinement: every binary class is split into at least two sub-classes
with independent discriminating criteria. *Pāramārthika* content (L3) is
verifiable against an external, ground-truth knowledge base—its truth-value is
absolute in the sense that it admits empirical falsification. *Vyāvahārika*
content (L2) is pragmatically coherent—internally consistent, linguistically
well-formed, and contextually plausible—but lacks direct factual grounding. It
is the level at which most LLM outputs operate: semantically fluent, yet
epistemically underdetermined. *Prātibhāsika* content (L1) exhibits apparent
coherence that dissolves under verification—precisely the hallucination
phenomenon. Binary classifiers cannot distinguish L3 from L2 (both labelled
"not hallucinated"), collapsing a critical epistemic distinction: a
*pāramārthika* claim is reliably trustworthy, whereas a *vyāvahārika* claim
demands independent verification.

**Adhyāsa as the mechanism of hallucination.** The Vedāntic concept of
*adhyāsa* (superimposition) identifies the precise cognitive error by which an
illusory object is mistaken for a real one—the classic example being the
perceived snake that is "really" a rope. In LLM terms, adhyāsa occurs when
prātibhāsika content is superimposed onto the vyāvahārika level: the model
generates content that *appears* pragmatically coherent (passing fluency and
coherence filters) but lacks ontological grounding in verified fact. This
superimposition mechanism is invisible to binary classifiers, which can only
observe the output surface. Our framework introduces an *adhyāsa signature*—a
composite signal that fires when a claim's factual grounding score is
prātibhāsika despite its linguistic plausibility appearing vyāvahārika—
capturing exactly this failure mode with measurable precision.

**Vivartavāda and the apparent-real distinction.** The doctrine of
*vivartavāda* holds that apparent manifestation occurs without ontological
transformation: the snake-illusion is not a real transformation of the rope.
Analogously, an LLM's grammatically fluent hallucination is not a genuine
transformation of factual knowledge—it is a vivarta, an apparent production
from a latent statistical distribution that mimics but does not replicate
epistemic grounding. This insight motivates our three-score decomposition
(cosine similarity to a fact store, NLI-based contextual entailment, and
source-traceability), each probing a distinct ontological dimension that binary
detectors treat as a single undifferentiated feature.

**Empirical consequences.** The 3×2 confusion matrix produced by our framework
directly quantifies what binary systems cannot express: the proportion of
*vyāvahārika* outputs mistakenly conflated with *pāramārthika* certainty, and
the fraction of adhyāsa cases where prātibhāsika content evades binary
hallucination detection. This decomposition is actionable: downstream systems
can apply different trust policies to L3, L2, and L1 content, and adhyāsa
incidence provides a new diagnostic metric for comparing LLM architectures
beyond aggregate hallucination rates. The trisattā framework thus offers both
greater discriminative precision and a principled theoretical vocabulary for the
next generation of LLM reliability research.

---

### References

- Maynez, J., Narayan, S., Bohnet, B., & McDonald, R. (2020). On faithfulness and factuality in abstractive summarization. *ACL 2020*.
- Ji, Z., Lee, N., Frieske, R., Yu, T., Su, D., Xu, Y., ... & Fung, P. (2023). Survey of hallucination in natural language generation. *ACM Computing Surveys*, 55(12), 1–38.
- Śaṅkarācārya. *Brahmasūtrabhāṣya*. (Trans. Swami Gambhirananda, 1965).
- Lin, S., Hilton, J., & Evans, O. (2022). TruthfulQA: Measuring how models mimic human falsehoods. *ACL 2022*.
- Müller, T. et al. (2023). HaluEval: A large-scale hallucination evaluation benchmark for large language models. *EMNLP 2023*.
