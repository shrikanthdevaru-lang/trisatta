import json

filepath = 'data/brahma-kanda.json'

with open(filepath, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Update the image for Verse 1
data['verses'][0]['image'] = "assets/images/bk-1-1.jpg"

with open(filepath, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated verse 1 image successfully.")
