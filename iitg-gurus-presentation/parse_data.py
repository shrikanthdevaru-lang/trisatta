import os
import glob
import json
import re

def parse_bullets(text):
    items = []
    curr = []
    for line in text.split('\n'):
        l = line.strip()
        if re.match(r'^[\-\*•]\s*', l):
            if curr:
                items.append(' '.join(curr))
                curr = []
            curr.append(re.sub(r'^[\-\*•]\s*', '', l))
        elif l and curr:
            curr.append(l)
    if curr:
        items.append(' '.join(curr))
    return items

def parse_guru_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        text = file.read()
    
    name_m = re.search(r'NAME:\s*(.*?)(?=\n[A-Z\s\(\)/]+:|\Z)', text, re.DOTALL)
    domain_m = re.search(r'VIDYASTHANA \(DOMAIN\):\s*(.*?)(?=\n[A-Z\s\(\)/]+:|\Z)', text, re.DOTALL)
    era_m = re.search(r'ERA:\s*(.*?)(?=\n[A-Z\s\(\)/]+:|\Z)', text, re.DOTALL)
    shloka_m = re.search(r'SHLOKA:\s*(.*?)(?=\n[A-Z\s\(\)/]+:|\Z)', text, re.DOTALL)
    trans_m = re.search(r'TRANSLATION:\s*(.*?)(?=\n[A-Z\s\(\)/]+:|\Z)', text, re.DOTALL)
    quote_m = re.search(r'QUOTE:\s*(.*?)(?=\n[A-Z\s\(\)/]+:|\Z)', text, re.DOTALL)
    about_m = re.search(r'ABOUT THE GURU / CONTEXT:\s*(.*?)(?=\n[A-Z\s\(\)/]+:|\Z)', text, re.DOTALL)
    contrib_m = re.search(r'MAJOR CONTRIBUTIONS:\s*(.*?)(?=\n[A-Z\s\(\)/]+:|\Z)', text, re.DOTALL)
    legacy_m = re.search(r'INFLUENCE THAT CONTINUES / LEGACY:\s*(.*?)(?=\n[A-Z\s\(\)/]+:|\Z)', text, re.DOTALL)
    
    name = name_m.group(1).strip() if name_m else ""
    domain = domain_m.group(1).strip() if domain_m else ""
    era = era_m.group(1).strip() if era_m else ""
    shloka = shloka_m.group(1).strip() if shloka_m else ""
    translation = trans_m.group(1).strip() if trans_m else ""
    quote = quote_m.group(1).strip() if quote_m else ""
    about = about_m.group(1).strip() if about_m else ""
    
    contribs_raw = parse_bullets(contrib_m.group(1)) if contrib_m else []
    legacies_raw = parse_bullets(legacy_m.group(1)) if legacy_m else []
    
    # Process contributions into title & description
    contributions = []
    for c in contribs_raw:
        if ':' in c:
            parts = c.split(':', 1)
            contributions.append({"title": parts[0].strip(), "desc": parts[1].strip()})
        else:
            contributions.append({"title": "", "desc": c})
            
    # Process legacy into title & description
    legacy = []
    for l in legacies_raw:
        if ':' in l:
            parts = l.split(':', 1)
            legacy.append({"title": parts[0].strip(), "desc": parts[1].strip()})
        else:
            legacy.append({"title": "", "desc": l})
            
    # File ID slug
    file_id = os.path.basename(filepath).replace('_Data.txt', '')

    return {
        "id": file_id,
        "name": name,
        "domain": domain,
        "era": era,
        "shloka": shloka,
        "translation": translation,
        "quote": quote,
        "about": about,
        "contributions": contributions,
        "legacy": legacy
    }

def main():
    folder = '/Users/sjs.iss/Desktop/IITG_Guru_Text_Data/*.txt'
    files = glob.glob(folder)
    gurus = []
    
    for f in sorted(files):
        gurus.append(parse_guru_file(f))
        
    out_file = '/Users/sjs.iss/shri projects/sanskrit ai @shri/iitg-gurus-presentation/gurus_data.json'
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(gurus, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully extracted {len(gurus)} gurus into {out_file}")

if __name__ == "__main__":
    main()
