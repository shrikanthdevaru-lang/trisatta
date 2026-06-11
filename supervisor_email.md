# Personalised Email — Prof. Manish Shrivastava, IIT Hyderabad

**To:** manish.shrivastava@iith.ac.in
**Subject:** PhD Inquiry — Computational Framework Grounding LLM Hallucination Detection in Advaita Vedānta Trisattā Doctrine

---

Dear Professor Shrivastava,

I am writing to inquire about PhD opportunities under your supervision at IIT Hyderabad. Your work on Sanskrit computational linguistics and morphological analysis — particularly the convergence of Indian Knowledge Systems with modern NLP architectures — directly informs the research prototype I have developed and wish to extend into a doctoral programme.

I have built a working hallucination detection framework for Large Language Models grounded in Advaita Vedānta's *trisattā* (three levels of being) doctrine. The core argument is that the standard binary classification of LLM outputs — hallucinated / not-hallucinated — is epistemologically insufficient. It collapses three ontologically distinct failure modes into one label:

1. **Pāramārthika** content: absolutely grounded, verifiable against a fact store
2. **Vyāvahārika** content: pragmatically coherent but unverified — the "gray zone" existing detectors miss
3. **Prātibhāsika** content: apparent coherence that dissolves on inspection — hallucination proper

The key mechanism I formalise is *adhyāsa* (superimposition) — precisely the process by which prātibhāsika (hallucinatory) content is superimposed as vyāvahārika (coherent), which is the failure mode of every binary detector in the literature.

**Empirical results on two benchmarks:**
- HaluEval (n=100): 87% binary-equivalent accuracy; 11% adhyāsa cases detected that evade binary classification
- TruthfulQA (n=100): 75% accuracy; 26% adhyāsa cases detected
- Pāramārthika tier: zero false positives across both datasets

The implementation uses sentence-transformers, a cross-encoder NLI model, and FAISS-backed fact retrieval, in clean modular Python. A draft workshop paper (8 sections, ACL format) is attached.

I believe this research has significant potential for extension in directions that align with your group's work:

1. **Sanskrit corpus grounding**: The Vedāntic ontological hierarchy could be tested against Sanskrit text corpora where the *pāramārthika/vyāvahārika* distinction has precise, established meanings — grounding the classifier in native Sanskrit epistemology rather than analogy
2. **Pāṇinian morphological integration**: If the claim parser uses Pāṇinian morphological tagging, source-traceability scoring can be made Sanskrit-aware, producing a hallucination detector native to Sanskrit NLP systems
3. **IKS-grounded AI evaluation**: A broader framework for evaluating LLM outputs on Sanskrit/Indian-language tasks using Indian epistemological standards rather than Western-derived benchmarks

I hold [your degree] from [your institution] with [CGPA]. I am prepared to pursue this full-time from [start date].

The full code is at: https://github.com/shrikanthdevaru-lang/trisatta-hallucination
A draft paper (ACL format) is attached to this email.

I would be very grateful for 15–20 minutes of your time to discuss whether this direction fits your current research agenda and whether funded positions are available.

Thank you sincerely for your time and consideration.

Warm regards,
**Shrikantha Devaru**
shrikanthdevaru@gmail.com
GitHub: github.com/shrikanthdevaru-lang

---

# Backup Email — Prof. Mitesh Khapra, IIT Madras (AI4Bharat)

**To:** miteshk@cse.iitm.ac.in
**Subject:** PhD Inquiry — LLM Hallucination Taxonomy Grounded in Indian Epistemology (Working Prototype)

---

Dear Professor Khapra,

I am writing to inquire about PhD opportunities under your supervision at IIT Madras. Your leadership of the AI4Bharat initiative — and the emphasis on building language AI that is grounded in Indian linguistic and cultural realities — resonates strongly with the research prototype I have developed.

I have built **Trisattā**, a hallucination detection framework for LLMs grounded in Advaita Vedānta's *trisattā* doctrine. Rather than the standard binary (hallucinated / not-hallucinated), the system classifies LLM outputs into three ontological tiers: *pāramārthika* (verifiable), *vyāvahārika* (pragmatically coherent), and *prātibhāsika* (apparently coherent but factually hollow).

The practical motivation connects directly to AI4Bharat's mission: when an Indian-language LLM answers a question about Indian history, law, or culture, a binary hallucination label is insufficient — we need to know *how hallucinated* the output is, and whether it is superimposing incorrect content that superficially resembles correct content (*adhyāsa*). This is particularly acute for low-resource Indian languages where fact stores are sparse and binary detectors lack calibration.

**Results on standard English benchmarks (as proof of concept):**
- HaluEval: 87% accuracy, 11% adhyāsa cases identified
- TruthfulQA: 75% accuracy, 26% adhyāsa cases identified

I see the natural extension as applying this framework to the IndicQA and Sangraha datasets from your group, building Indian-language fact stores, and evaluating whether adhyāsa rates vary systematically across language families.

Full code: https://github.com/shrikanthdevaru-lang/trisatta-hallucination
Draft paper (ACL format) attached.

I would be grateful for any guidance on whether this direction fits current PhD openings in your group.

Warm regards,
**Shrikantha Devaru**
shrikanthdevaru@gmail.com

---

# Quick-Send List (Copy + Personalise First Paragraph)

| Professor | Institution | Email | Fit |
|-----------|-------------|-------|-----|
| Prof. Manish Shrivastava | IIT Hyderabad | manish.shrivastava@iith.ac.in | ⭐⭐⭐ Sanskrit NLP |
| Prof. Mitesh Khapra | IIT Madras | miteshk@cse.iitm.ac.in | ⭐⭐⭐ AI4Bharat, Indian languages |
| Prof. Mausam | IIT Delhi | mausam@cse.iitd.ac.in | ⭐⭐ NLP, knowledge graphs |
| Prof. Radhika Mamidi | IIIT Hyderabad | radhika.mamidi@iiit.ac.in | ⭐⭐⭐ Sanskrit computational ling. |
| Prof. Pushpak Bhattacharyya | IIT Bombay | pb@cse.iitb.ac.in | ⭐⭐ NLP, multilingual AI |
| Prof. Vasudeva Varma | IIIT Hyderabad | vv@iiit.ac.in | ⭐⭐ Information retrieval, NLP |
