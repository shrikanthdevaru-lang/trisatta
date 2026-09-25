import json

print("Reading local sutras data...")
with open("data.json", "r", encoding="utf-8") as f:
    sutras_data = json.load(f)

print("Reading local meanings data...")
with open("meanings.json", "r", encoding="utf-8") as f:
    meanings_dict = json.load(f)

print("Generating sutras.py...")
with open("sutras.py", "w", encoding="utf-8") as f:
    f.write('"""\nSwadeshi Ashtadhyayi Sūtras generated from Ashtadhyayi.com data.\nIncludes all 3,983 rules compiled automatically.\n"""\n\nCORE_SUTRAS = [\n')
    count = 0
    for s in sutras_data['data']:
        s_id = s['i']
        a, p, n = s['a'], s['p'], s['n']
        text_dev = s['s']
        text_eng = s['e']
        meaning = meanings_dict.get(s_id, "").replace('"', "'").replace('\n', ' ').strip()
        if not meaning:
            meaning = "Grammar Rule"
        line = f'    "Sūtra {a}.{p}.{n}: {text_eng} ({text_dev}) — {meaning}",\n'
        f.write(line)
        count += 1
    f.write(']\n\n')
    f.write('def get_sutras() -> list:\n')
    f.write('    return CORE_SUTRAS\n')

print(f"Done! Wrote {count} sutras to sutras.py")
