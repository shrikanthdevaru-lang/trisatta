import json
import os

filepath = 'data/brahma-kanda.json'

with open(filepath, 'r', encoding='utf-8') as f:
    data = json.load(f)

# The new words list for Verse 1
new_words = [
    {
      "word": "अनादिनिधनम्",
      "iast": "anādinidhanaṃ",
      "meaning": "without beginning or end; eternal",
      "grammar": "adj, acc. sg. neut.",
      "tikas": {
        "punyaraja": {
          "sanskrit": "अनादि — आदिरहितम्, निधनरहितम् च — इति नित्यत्वं सूचितम् ।",
          "hindi": "अनादि — जिसका आदि नहीं, निधन — जिसका अन्त नहीं; इस प्रकार शब्दब्रह्म की नित्यता सूचित की गई है।",
          "english": "Anādi means without beginning, nidhana means without end — thus the eternal nature of Śabda-Brahman is indicated."
        },
        "helaraja": {
          "sanskrit": "न विद्यते आदिर्यस्य तत् अनादि, न विद्यते निधनं यस्य तत् च — द्वन्द्वसमासः ।",
          "hindi": "जिसका आदि न हो वह अनादि, जिसका निधन (नाश) न हो वह अनिधन — यह द्वन्द्व समास है।",
          "english": "That which has no beginning is anādi, that which has no end is anidhana — this is a dvandva compound."
        },
        "iyer": {
          "english": "The compound anādinidhana indicates the eternal and imperishable nature of Brahman. Unlike finite created objects, Śabda-Brahman transcends time and change."
        }
      },
      "extra": {
        "sanskrit": "शब्दब्रह्मणः नित्यत्वं न केवलं कालदृष्ट्या अपि तु स्वरूपदृष्ट्या अपि वर्तते। उत्पत्तिविनाशरहितमेव परमार्थसत्यम्।",
        "hindi": "यहाँ अनादिनिधन पद से यह स्पष्ट किया गया है कि शब्दब्रह्म की उत्पत्ति या विनाश नहीं होता। यह न केवल समय के पार है, बल्कि स्वरूप से भी शाश्वत है।",
        "english": "In Indian philosophy, something that has a beginning must have an end. By stating the Word is 'anādi-nidhana', Bhartṛhari immediately elevates language from a human convention to the status of the eternal Absolute."
      }
    },
    {
      "word": "ब्रह्म",
      "iast": "brahma",
      "meaning": "the Absolute, Brahman; here identified with Śabda (Word)",
      "grammar": "noun, nom. sg. neut.",
      "tikas": {
        "punyaraja": {
          "sanskrit": "ब्रह्म इति — बृहत् वा बृंहयति वा इति ब्रह्म । शब्दतत्त्वरूपं ब्रह्म उच्यते ।",
          "hindi": "ब्रह्म — जो बड़ा है अथवा जो विस्तार करता है, वह ब्रह्म है। यहाँ शब्दतत्त्वरूप ब्रह्म कहा गया है।",
          "english": "Brahman — that which is vast or that which expands. Here it refers to Brahman in its form as Śabda-tattva (Word-essence)."
        },
        "helaraja": {
          "sanskrit": "वेदान्ते परं ब्रह्म उच्यते, अत्र तु शाब्दब्रह्म — वैयाकरणदर्शने विशिष्टम् ।",
          "hindi": "वेदान्त में परब्रह्म कहा जाता है, किन्तु यहाँ वैयाकरण-दर्शन में शाब्दब्रह्म की विशिष्ट उपासना है।",
          "english": "While Vedānta speaks of Para-Brahman, here in the grammarian's philosophy, Śābda-Brahman is the specific focus of contemplation."
        }
      },
      "extra": {
        "sanskrit": "अत्र वेदान्तिनां निरुपाधिकब्रह्म न विवक्षितम्, अपि तु सर्वशक्तियुक्तं वाक्स्वरूपं ब्रह्म।",
        "hindi": "भर्तृहरि का 'ब्रह्म' वेदान्तियों के निर्गुण ब्रह्म से भिन्न है; यह वह चेतना है जो स्वयं को भाषा और विचारों के रूप में अभिव्यक्त करती है।",
        "english": "Unlike Advaita Vedānta where Brahman is completely without attributes (Nirguṇa), Bhartṛhari's Brahman is inherently dynamic. Its very nature is to express itself as meaning and language."
      }
    },
    {
      "word": "शब्दतत्त्वम्",
      "iast": "śabdatattvaṃ",
      "meaning": "whose essence is Word/Sound; the Word-essence",
      "grammar": "noun, nom. sg. neut. (bahuvrīhi)",
      "tikas": {
        "punyaraja": {
          "sanskrit": "शब्दः एव तत्त्वं यस्य तत् शब्दतत्त्वम् — बहुव्रीहिः । सर्वस्य जगतः मूलं शब्दः इति भर्तृहरेः सिद्धान्तः ।",
          "hindi": "जिसका तत्त्व (सार) शब्द ही है — यह बहुव्रीहि समास है।",
          "english": "Śabda-tattva is a bahuvrīhi compound meaning 'whose essence is Word.'"
        }
      },
      "extra": {
        "sanskrit": "शब्द एव परमसत्ता। जगति यत्किञ्चित् प्रतीयते तत् सर्वं शब्दात्मकमेव।",
        "hindi": "इस दर्शन के अनुसार विचार और भाषा अविभाज्य हैं। बिना शब्द के किसी भी तत्त्व का ज्ञान असम्भव है।",
        "english": "This is the core thesis of Śabdādvaita: language and consciousness are identical. We cannot know anything without language, hence the ultimate reality of all objects is the Word itself."
      }
    },
    {
      "word": "यत्",
      "iast": "yat",
      "meaning": "which",
      "grammar": "rel. pron., nom. sg. neut.",
      "tikas": {},
      "extra": {
        "sanskrit": "यत् इति सर्वनाम अक्षरब्रह्मणः परामर्शार्थम्।",
        "hindi": "यहाँ 'यत्' सर्वनाम का प्रयोग उस अक्षर ब्रह्म की ओर संकेत करने के लिए किया गया है।",
        "english": "The relative pronoun 'yat' directly connects the preceding descriptive attributes to the core substance 'akṣaram'."
      }
    },
    {
      "word": "अक्षरम्",
      "iast": "akṣaram",
      "meaning": "imperishable, indestructible; also means 'syllable'",
      "grammar": "noun/adj, nom. sg. neut.",
      "tikas": {
        "punyaraja": {
          "sanskrit": "अक्षरम् — न क्षरति, न नश्यति इति अक्षरम् — नित्यशब्दवादः अत्र प्रतिष्ठापितः ।",
          "hindi": "अक्षर — जो क्षरित (नष्ट) नहीं होता, वह अक्षर है। यहाँ नित्य-शब्द-वाद की स्थापना की गई है।",
          "english": "Akṣara means that which does not perish. The theory of the eternal Word (nitya-śabda-vāda) is established here."
        }
      },
      "extra": {
        "sanskrit": "अक्षरशब्दः श्लेषार्थे प्रयुक्तः — न क्षरति इति अक्षरम् (अविनाशि), तथा च वर्णात्मकः शब्दः (अ उ म् इत्यादि)।",
        "hindi": "'अक्षर' शब्द यहाँ श्लेष (double meaning) के रूप में है: पहला अर्थ है जो कभी नष्ट नहीं होता, और दूसरा अर्थ है भाषा की इकाई (syllable) जैसे ॐ।",
        "english": "Bhartṛhari employs a brilliant pun on 'akṣara'. Philosophically it means 'imperishable', but grammatically it means 'syllable' (like Om), beautifully fusing metaphysics and grammar."
      }
    },
    {
      "word": "विवर्तते",
      "iast": "vivartate",
      "meaning": "manifests, appears, undergoes apparent transformation",
      "grammar": "verb, 3rd sg. pres. ātm.",
      "tikas": {
        "helaraja": {
          "sanskrit": "परिणामं विना प्रतीतिमात्रेण जगत्स्फुरणं विवर्तः — रज्जौ सर्पवत् ।",
          "hindi": "बिना वास्तविक परिणाम के, केवल प्रतीति से जगत् का प्रकट होना विवर्त है — जैसे रस्सी में सर्प की प्रतीति।",
          "english": "Vivarta is the appearance of the world without real transformation, like the perception of a snake in a rope."
        }
      },
      "extra": {
        "sanskrit": "एकस्य तत्त्वस्य अतात्त्विकोऽन्यथाप्रथा विवर्तः। ब्रह्म स्वस्वरूपम् अज्ञात्वा नानारूपेण भासते।",
        "hindi": "सांख्य दर्शन के 'परिणामवाद' (जहाँ दूध दही में सचमुच बदल जाता है) के विपरीत, यहाँ 'विवर्त' है — ब्रह्म बिना बदले ही जगत् के रूप में दिखाई देता है।",
        "english": "A vital philosophical distinction: unlike Sāṃkhya's 'pariṇāma' (real transformation like milk to curd), 'vivarta' means the original substance never changes, yet produces the illusion of multiplicity."
      }
    },
    {
      "word": "अर्थभावेन",
      "iast": "arthabhāvena",
      "meaning": "through the appearance of objects/meanings",
      "grammar": "noun, inst. sg. masc.",
      "tikas": {
        "punyaraja": {
          "sanskrit": "अर्थाः — पदार्थाः, भावाः — प्रतीतयः; शब्दतत्त्वं अर्थरूपेण प्रतीयते जगति ।",
          "hindi": "अर्थ = पदार्थ (वस्तुएँ), भाव = प्रतीति; शब्दतत्त्व ही जगत् में अर्थरूप से प्रतीत होता है।",
          "english": "Artha means objects of meaning, bhāva means appearance. Śabda-tattva manifests as the objects of the world."
        }
      },
      "extra": {
        "sanskrit": "अर्थस्य भावः अर्थभावः, तेन। शब्दादेव अर्थस्य उत्पत्तिः, न तु शब्दार्थयोः पृथक्सत्ता।",
        "hindi": "वस्तुएँ और कुछ नहीं बल्कि शब्दों के अर्थ का ही भौतिक रूप हैं। शब्द से ही अर्थ का प्राकट्य होता है।",
        "english": "This shows the cognitive mapping of the universe. What we call physical 'objects' (artha) are merely the semantic correlates (meanings) of the eternal Word expressing itself outwardly."
      }
    },
    {
      "word": "प्रक्रिया",
      "iast": "prakriyā",
      "meaning": "the process of creation, manifestation",
      "grammar": "noun, nom. sg. fem.",
      "tikas": {},
      "extra": {
        "sanskrit": "प्रक्रिया नाम सृष्टेः व्यापारः।",
        "hindi": "प्रक्रिया का अर्थ यहाँ सृष्टि के सतत विकास या व्यापार से है।",
        "english": "Prakriyā emphasizes that creation is not a one-time past event, but an ongoing process or dynamics of manifestation."
      }
    },
    {
      "word": "जगतः",
      "iast": "jagataḥ",
      "meaning": "of the world",
      "grammar": "noun, gen. sg. neut.",
      "tikas": {},
      "extra": {
        "sanskrit": "गच्छति इति जगत्। यत् नित्यं परिवर्तते तत् जगत्।",
        "hindi": "जो निरन्तर गतिशील और परिवर्तनशील है, उसे जगत् कहते हैं।",
        "english": "The root 'gam' (to move) gives us 'jagat'. It represents the ever-changing phenomenal world, contrasted with the changeless Brahman."
      }
    },
    {
      "word": "यतः",
      "iast": "yataḥ",
      "meaning": "from which",
      "grammar": "indec. (ablative sense)",
      "tikas": {},
      "extra": {
        "sanskrit": "यस्मात् कारणात् इत्यर्थः। उपादानकारणं निमित्तकारणं च ब्रह्मैव।",
        "hindi": "यहाँ 'यतः' स्पष्ट करता है कि वह शब्दब्रह्म ही इस सृष्टि का एकमात्र उपादान और निमित्त कारण है।",
        "english": "'Yataḥ' indicates the source. It confirms Brahman as both the material and efficient cause of the universe."
      }
    }
]

# Update verse 1
data['verses'][0]['words'] = new_words

with open(filepath, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated verse 1 successfully.")
