import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def fetch_json(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, context=ctx) as response:
        return json.loads(response.read().decode('utf-8'))

print("Fetching sutras...")
sutras_data = fetch_json("https://raw.githubusercontent.com/ashtadhyayi-com/data/master/sutraani/data.txt")

print("Fetching English meanings...")
meanings_dict = fetch_json("https://raw.githubusercontent.com/ashtadhyayi-com/data/master/sutraani/vasu_english_summary.txt")

print("Generating sutras.py...")
with open("sutras.py", "w", encoding="utf-8") as f:
    f.write('"""\nSwadeshi Ashtadhyayi Sūtras generated from Ashtadhyayi.com data.\nIncludes all 3,983 rules compiled automatically.\n"""\n\nCORE_SUTRAS = [\n')
    count = 0
    for s in sutras_data['data']:
        s_id = s['i']
        a, p, n = s['a'], s['p'], s['n']
        text_dev = s['s']
        text_eng = s['e']
        meaning = meanings_dict.get(s_id, "").replace('"', "'").replace('\n', ' ')
        if not meaning:
            meaning = "Pāṇinian Grammar Rule"
        line = f'    "Sūtra {a}.{p}.{n}: {text_eng} ({text_dev}) — {meaning}",\n'
        f.write(line)
        count += 1
    f.write(']\n\n')
    f.write('def get_sutras() -> list:\n')
    f.write('    return CORE_SUTRAS\n')

print(f"Done! Wrote {count} sutras to sutras.py")
