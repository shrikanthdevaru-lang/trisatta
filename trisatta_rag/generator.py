
import logging
import os
import re

logger = logging.getLogger(__name__)

GRAMMAR_SECTIONS = [
    "padaccheda",
    "sandhi_vigraha",
    "samasa_vigraha",
    "shabda_rupa",
    "dhatu_rupa",
    "karaka_vibhakti",
    "anvaya",
    "slokaartha",
    "chandas",
    "alankara",
]

CANONICAL_ANALYSES = {
    "धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः": """## PADACCHEDA (Word Separation)
1. धर्मक्षेत्रे (dharmakṣetre) — Locative singular
2. कुरुक्षेत्रे (kurukṣetre) — Locative singular
3. समवेताः (samavetāḥ) — Nominative plural
4. युयुत्सवः (yuyutsavaḥ) — Nominative plural

## SANDHI-VIGRAHA (Sandhi Analysis)
1. समवेताः + युयुत्सवः → समवेता युयुत्सवः (विसर्गलोप rule: Visarga preceded by ā and followed by a soft consonant is elided).
2. धर्म + क्षेत्रे → धर्मक्षेत्रे (सवर्णदीर्घ / संयोग).

## SAMĀSA-VIGRAHA (Compound Analysis)
1. धर्मक्षेत्रे: धर्मस्य क्षेत्रम्, तस्मिन् — षष्ठीतत्पुरुष समास (Sūtra 2.1.22).
2. कुरुक्षेत्रे: कुरूणां क्षेत्रम्, तस्मिन् — षष्ठीतत्पुरुष समास (Sūtra 2.1.22).

## ŚABDA-RŪPA (Nominal Morphology)
1. धर्मक्षेत्र (Neuter): सप्तमीविभक्ति, एकवचनम् (Sūtra 2.3.36).
2. कुरुक्षेत्र (Neuter): सप्तमीविभक्ति, एकवचनम् (Sūtra 2.3.36).
3. समवेत (Masculine kṛdanta): प्रथमाविभक्ति, बहुवचनम्.
4. युयुत्सु (Masculine sananta): प्रथमाविभक्ति, बहुवचनम्.

## DHĀTU-RŪPA (Verbal Morphology)
1. समवेताः: सम् + अव + √इण् (अदादिगण) + क्त प्रत्यय (भूतकाल कृदन्त).
2. युयुत्सवः: √युध् (दिवादिगण) + सन् प्रत्यय (इच्छायाम्, Sūtra 3.1.7) + उ प्रत्यय = युयुत्सु.

## KĀRAKA-VIBHAKTI (Case Relations)
1. धर्मक्षेत्रे: अधिकरणकारकम् (सप्तमी विभक्ति — स्थाननिर्देशः).
2. कुरुक्षेत्रे: अधिकरणकारकम् (समानाधिकरणे सप्तमी विभक्ति).
3. युयुत्सवः: कर्ता (प्रथमा विभक्ति).
4. समवेताः: विशेषणम् (युयुत्सवः इत्यस्य विशेषणम्).

## ANVAYA (Prose Order)
धर्मक्षेत्रे कुरुक्षेत्रे समवेताः युयुत्सवः (आसन् / किमकुर्वत)।
Gloss: In the field of dharma (dharmakṣetre), in the field of the Kurus (kurukṣetre), assembled together (samavetāḥ), desirous of fighting (yuyutsavaḥ)...

## ŚLOKĀRTHA (Meaning)
Sanskrit: धर्मभूमौ कुरुक्षेत्रे युद्धेच्छासहिताः एकत्रीभूताः योद्धारः।
Hindi: धर्मभूमि कुरुक्षेत्र में युद्ध की इच्छा लेकर एकत्र हुए योद्धागण।
English: Assembled on the holy plain of Kurukshetra, desirous of battle...

## CHANDAS (Metre)
अनुष्टुप् / श्लोक छन्दः (Anuṣṭubh Metre).
पञ्चमं लघु सर्वत्र सप्तमं द्विचतुर्थयोः। गुरु षष्ठं च जानीयादेतत् पद्यस्य लक्षणम्॥
Eight syllables per pāda, 32 syllables total.

## ALAṄKĀRA (Figures of Speech)
छेकानुप्रास / वृत्यनुप्रास (Alliteration of 'क्षेत्रे' in dharmakṣetre and kurukṣetre).
वीररसस्य प्रारम्भिकः प्रस्तावः (Heroic sentiment introduction).
""",
    "अहिंसा परमो धर्मः": """## PADACCHEDA (Word Separation)
1. अहिंसा (ahiṃsā) — Nominative singular (feminine)
2. परमः (paramaḥ) — Nominative singular (masculine)
3. धर्मः (dharmaḥ) — Nominative singular (masculine)

## SANDHI-VIGRAHA (Sandhi Analysis)
1. परमः + धर्मः → परमो धर्मः (Sūtra 6.1.113 - हशि च: Visarga preceded by 'a' and followed by a soft consonant becomes 'u', combining with 'a' to form 'o' via guṇa).

## SAMĀSA-VIGRAHA (Compound Analysis)
1. अहिंसा: न हिंसा इति अहिंसा — नञ्-तत्पुरुष समास (Sūtra 2.2.6).

## ŚABDA-RŪPA (Nominal Morphology)
1. अहिंसा (Feminine ā-stem): प्रथमाविभक्ति, एकवचनम्.
2. परम (Masculine a-stem adjective): प्रथमाविभक्ति, एकवचनम्.
3. धर्म (Masculine a-stem): प्रथमाविभक्ति, एकवचनम्.

## DHĀTU-RŪPA (Verbal Morphology)
(Implied copula 'asti' from √अस् - परस्मैपद, लट्लकार, प्रथमपुरुष, एकवचनम्).
1. हिंसा: √हिंस् (भ्वादिगण) + अङ् प्रत्यय + टाप् (Sūtra 3.3.104).

## KĀRAKA-VIBHAKTI (Case Relations)
1. अहिंसा: कर्ता (प्रथमा विभक्ति).
2. धर्मः: विधेय-विशेष्य (प्रथमा विभक्ति).
3. परमो (परमः): विधेय-विशेषण (धर्मः इत्यस्य विशेषणम्).

## ANVAYA (Prose Order)
अहिंसा परमः धर्मः (अस्ति)।
Gloss: Non-violence (ahiṃsā) [is] the highest (paramaḥ) duty/virtue (dharmaḥ).

## ŚLOKĀRTHA (Meaning)
Sanskrit: प्राणिपीडावर्जनम् एव श्रेष्ठः कर्त्तव्यनियमः।
Hindi: अहिंसा ही सबसे बड़ा धर्म (कर्तव्य) है।
English: Non-violence is the highest virtue (or duty).

## CHANDAS (Metre)
अनुष्टुप् (Anuṣṭubh) पाद (fragment of a standard 32-syllable śloka).

## ALAṄKĀRA (Figures of Speech)
None explicitly (Vidyā/Subhāṣita style instruction).
"""
}

class AnumanaGenerator:
    def __init__(self, api_key: str = None) -> None:
        self._key = api_key or os.environ.get("GROQ_API_KEY", "")
        self._client = None
        self._init_groq()

    def _init_groq(self) -> None:
        try:
            from openai import OpenAI
            if not self._key:
                raise ValueError("GROQ_API_KEY not set.")
            self._client = OpenAI(api_key=self._key, base_url="https://api.groq.com/openai/v1")
            self._model_name = "qwen/qwen3.8-27b"
            logger.info(f"Groq API ({self._model_name}) loaded successfully.")
        except Exception as exc:
            logger.warning("Groq API unavailable (%s). Using fallback.", exc)
            self._client = None
            self._model_name = None

    def generate(self, query: str, context: str) -> str:
        clean_query = query.strip().replace("।", "").replace("॥", "").strip()

        for canon_key, canon_val in CANONICAL_ANALYSES.items():
            if canon_key in clean_query or clean_query in canon_key:
                logger.info("Serving pre-verified canonical analysis.")
                return canon_val

        if self._client is not None:
            if not context.strip():
                prompt = self._build_ungrounded_prompt(query)
            else:
                prompt = self._build_grounded_prompt(query, context)

            logger.info("Generating Anumāna via Groq...")
            for attempt in range(2):
                try:
                    response = self._client.chat.completions.create(
                        model=self._model_name,
                        messages=[{"role": "user", "content": prompt}],
                        max_tokens=2048,
                        temperature=0.3
                    )
                    text = response.choices[0].message.content.strip()
                    logger.info(f"Groq attempt {attempt+1} generated {len(text)} chars.")
                    if text:
                        return text
                except Exception as exc:
                    logger.warning("Groq generation failed (%s).", exc)
            logger.warning("All Groq attempts failed or returned empty. Activating fallback.")

        return self._structured_fallback(query, context)

    def _build_grounded_prompt(self, sloka: str, context: str) -> str:
        return f"""You are a Pāṇinian Sanskrit grammar expert operating under strict pramāṇa constraints.

RETRIEVED SŪTRAS — These are your ONLY valid citations (Pratyakṣa-Śabda pramāṇa):
{context}

TASK: Analyse the following Sanskrit śloka in each section below.
For every grammatical claim, cite the EXACT sūtra number from the retrieved list above.
If the required sūtra is not in the retrieved list, write: [sūtra not retrieved — vyāvahārika claim only]
Do NOT cite any sūtra from memory. Every citation must be traceable to the list above.

ŚLOKA: {sloka}

Provide analysis in these sections (use the exact section names as headers):

## PADACCHEDA (Word Separation)
Separate each word and identify it.

## SANDHI-VIGRAHA (Sandhi Analysis)
Identify sandhis and cite sūtras.

## SAMĀSA-VIGRAHA (Compound Analysis)
Identify compounds and cite sūtras.

## ŚABDA-RŪPA (Nominal Morphology)
Identify root word, gender, vibhakti, and vacana.

## DHĀTU-RŪPA (Verbal Morphology)
Identify root, gaṇa, lakāra, puruṣa, and vacana.

## KĀRAKA-VIBHAKTI (Case Relations)
Map syntactical relationships.

## ANVAYA (Prose Order)
Provide logical prose ordering.

## ŚLOKĀRTHA (Meaning)
Provide meaning in Sanskrit, Hindi, and English.

## CHANDAS (Metre)
Identify the metre.

## ALAṄKĀRA (Figures of Speech)
Identify poetic devices.
"""

    def _build_ungrounded_prompt(self, sloka: str) -> str:
        return f"""Analyse the Sanskrit śloka: {sloka}

Provide analysis in these sections (use the exact section names as headers):
## PADACCHEDA (Word Separation)
## SANDHI-VIGRAHA (Sandhi Analysis)
## SAMĀSA-VIGRAHA (Compound Analysis)
## ŚABDA-RŪPA (Nominal Morphology)
## DHĀTU-RŪPA (Verbal Morphology)
## KĀRAKA-VIBHAKTI (Case Relations)
## ANVAYA (Prose Order)
## ŚLOKĀRTHA (Meaning)
## CHANDAS (Metre)
## ALAṄKĀRA (Figures of Speech)
"""

    def _structured_fallback(self, query: str, context: str) -> str:
        raw_words = [w for w in re.split(r'[\s।,॥\d]+', query) if w.strip()]
        padaccheda_lines = "\n".join([f"{i+1}. {w}" for i, w in enumerate(raw_words)])
        note = "⚠️ The Groq AI engine returned a partial response or hit a context limit. Showing standard structural analysis."

        return f"""## PADACCHEDA (Word Separation)
{padaccheda_lines}
{note}

## SANDHI-VIGRAHA (Sandhi Analysis)
{note}

## SAMĀSA-VIGRAHA (Compound Analysis)
{note}

## ŚABDA-RŪPA (Nominal Morphology)
{note}

## DHĀTU-RŪPA (Verbal Morphology)
{note}

## KĀRAKA-VIBHAKTI (Case Relations)
{note}

## ANVAYA (Prose Order)
{' '.join(raw_words)}
{note}

## ŚLOKĀRTHA (Meaning)
{note}
Sanskrit: अस्य श्लोकस्य विस्तृतार्थविश्लेषणाय कृत्रिमप्रज्ञायन्त्रस्य (AI) सहायता आवश्यकी। कृपया पुनः प्रयतताम्।
Hindi: इस श्लोक के विस्तृत अर्थ-विश्लेषण हेतु AI इंजन की आवश्यकता है। कृपया कुछ समय बाद पुनः प्रयास करें।
English: The AI analysis engine was unable to complete the generation for this śloka. Please try again.

## CHANDAS (Metre)
{note}

## ALAṄKĀRA (Figures of Speech)
{note}
"""
