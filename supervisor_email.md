Subject: PhD Application — Computational Framework for LLM Hallucination Detection Grounded in Advaita Vedānta

Dear Professor [Name],

I am writing to express my interest in pursuing a PhD under your supervision in the area of Natural Language Processing and AI reliability. I am reaching out specifically because your work on [mention their specific work — e.g., "language model evaluation / knowledge-grounded NLP / Indian language processing"] aligns closely with the research direction I am proposing.

I have developed a working prototype of a novel hallucination taxonomy for Large Language Models, grounded in Advaita Vedānta's trisattā (three-levels-of-being) doctrine. The core argument is that the standard binary classification of LLM outputs as "hallucinated / not hallucinated" is epistemologically impoverished — it collapses three ontologically distinct failure modes into a single undifferentiated label.

My framework maps LLM outputs to three levels:

• Pāramārthika (absolute) — verifiable against a fact store; zero false positives in experiments
• Vyāvahārika (pragmatic) — coherent but unverified; the "gray zone" binary classifiers miss
• Prātibhāsika (apparent) — coherence that dissolves on inspection; hallucination proper

The key mechanism I formalise is adhyāsa (superimposition from Vedānta) — the process by which prātibhāsika (hallucinatory) content is superimposed as vyāvahārika (coherent), which is precisely the failure mode of every existing binary detector.

Empirical results on two standard benchmarks:
• HaluEval (n=100): 87% binary-equivalent accuracy; 11% adhyāsa cases detected
• TruthfulQA (n=100): 75% accuracy; 26% adhyāsa cases detected

The classifier uses sentence-transformers (all-MiniLM-L6-v2), a cross-encoder NLI model, and FAISS-backed fact retrieval — a clean, modular implementation in Python.

The full code is available at: [GitHub link]
A draft paper (8 sections, workshop-ready) is attached.

I believe this line of research has significant potential for extension into:
1. Real-time grounding verification in RAG (Retrieval-Augmented Generation) pipelines
2. Sanskrit NLP corpora, where the Vedāntic vocabulary has direct ontological precision
3. A general epistemological framework for AI trustworthiness grounded in Indian Knowledge Systems

I would be grateful for 15–20 minutes of your time to discuss whether this project aligns with your current research agenda and whether there are funded PhD positions available.

I hold [your degree] from [your institution] with [your CGPA/rank]. I have attached my CV and the draft paper.

Thank you for your time and consideration.

Warm regards,
Shrikantha Devaru
[Email] | [Phone] | [GitHub]


---
SUGGESTED PROFESSORS TO SEND THIS TO:
(Research the specific person before sending — personalise the opening paragraph)

IIT Bombay:
  • Prof. Pushpak Bhattacharyya (NLP, sentiment analysis, Indian languages)
  • Prof. Sunita Sarawagi (ML, information extraction)

IIT Madras:
  • Prof. Balaraman Ravindran (RL, AI, complex systems)
  • Prof. Mitesh Khapra (NLP, language models, AI4Bharat)
    → Strong fit: runs AI4Bharat, deeply invested in Indian language AI

IIT Delhi:
  • Prof. Mausam (NLP, knowledge graphs, open IE)
  • Prof. Parag Singla (ML, probabilistic reasoning)

IIT Hyderabad:
  • Prof. Manish Shrivastava (NLP, Sanskrit computational linguistics)
    → STRONGEST FIT: active work in Sanskrit NLP + computational linguistics

IIT Kanpur:
  • Prof. Arnab Bhattacharya (data mining, NLP)

IIIT Hyderabad:
  • Prof. Vasudeva Varma (NLP, information retrieval)
  • Prof. Radhika Mamidi (computational linguistics, Sanskrit)
    → Strong fit: Sanskrit computational linguistics background

HOW TO PERSONALISE:
1. Google the professor's 3 most recent papers
2. In your opening paragraph, write 1–2 sentences connecting their specific work to yours
3. Example: "Your recent work on [paper title] raises the question of how to grade
   model outputs by epistemic reliability — which is precisely what our trisattā
   taxonomy operationalises..."
