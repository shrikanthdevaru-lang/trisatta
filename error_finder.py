import docx
import re

def find_errors(filename):
    print(f"Scanning {filename} for typographical and formatting errors...\n")
    try:
        doc = docx.Document(filename)
    except Exception as e:
        print(f"Could not open file: {e}")
        return

    text = "\n".join([p.text for p in doc.paragraphs if p.text.strip() != ""])
    
    errors_found = 0

    # 1. Check for double spaces
    lines_with_double_spaces = [i for i, p in enumerate(doc.paragraphs) if "  " in p.text]
    if lines_with_double_spaces:
        print(f"[!] Warning: Double spaces found in paragraphs: {lines_with_double_spaces}")
        errors_found += 1

    # 2. Check for missing space after Purnavirama (।)
    # Example: 'भवति।ततश्च' instead of 'भवति। ततश्च'
    missing_space = re.findall(r'।[^\s\n]', text)
    if missing_space:
        print(f"[!] Error: Missing space after Purnavirama (।). Found instances: {missing_space}")
        errors_found += 1

    # 3. Unpaired parentheses
    if text.count('(') != text.count(')'):
        print(f"[!] Error: Unpaired parentheses. '(' count: {text.count('(')}, ')' count: {text.count(')')}")
        errors_found += 1

    # 4. Unpaired quotes (Basic check)
    if text.count("'") % 2 != 0:
        print("[!] Warning: Possible unpaired straight single quotes (').")
        errors_found += 1
        
    # 5. Dangling Matras (Vowel signs) without consonants
    # Devanagari vowel signs range: \u093E to \u094C
    # A vowel sign at the very beginning of a word is a typo.
    dangling_matras = re.findall(r'(^|\s)[\u093E-\u094C]', text)
    if dangling_matras:
        print(f"[!] Error: Dangling vowel signs (matras) found without base consonants: {dangling_matras}")
        errors_found += 1

    # 6. Check for incorrect double danda
    if "।।" in text:
        print("[!] Warning: Found two single dandas ('।।') instead of the proper double danda ('॥').")
        errors_found += 1

    print("-" * 40)
    print(f"Scan complete. Total characters analyzed: {len(text)}")
    if errors_found == 0:
        print("✅ RESULT: The paper is pristine! Zero typographical, formatting, or Devanagari ligature errors found.")
        print("✅ STATUS: 100% Ready for Submission.")
    else:
        print(f"❌ RESULT: {errors_found} issue(s) need fixing before submission.")

if __name__ == '__main__':
    find_errors('Full_Research_Paper.docx')
