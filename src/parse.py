import PyPDF2
import json
import re
import os
import random

# Resolve paths relative to this script's location (src/)
_DIR = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(_DIR, 'karlsruhe.pdf'), 'rb') as f:
    reader = PyPDF2.PdfReader(f)
    text = ''
    for page in reader.pages:
        text += page.extract_text()

# Clean up text
text = text.replace('\n', '')
start = text.find('{"features"')
if start != -1:
    text = text[start:]
end = text.rfind('}')
if end != -1:
    text = text[:end+1]

    # Use Regex to extract features robustly to bypass bad JSON formatting from PDF text extraction
    features = []
    
    # Extract coordinates blocks
    coord_matches = re.findall(r'\[([0-9]+\.[0-9]+),\s*([0-9]+\.[0-9]+)\]', text)
    stadt_matches = re.findall(r'"stadtteil"\s*:\s*"([^"]+)"', text)
    
    for i in range(len(coord_matches)):
        lng = float(coord_matches[i][0])
        lat = float(coord_matches[i][1])
        stadtteil = stadt_matches[i] if i < len(stadt_matches) else "Karlsruhe"
        
        f = {
            'id': i + 1,
            'pos': [lat, lng],
            'moisture': random.randint(5, 95),
            'name': 'Obstbaum',
            'type': 'Einzelbaum',
            'waterRequired': random.randint(1, 5),
            'sourceNearby': random.random() > 0.5,
            'hasAutoValve': random.random() > 0.8,
            'fact': "Karlsruhe's urban forest helps cool the city by up to 2°C.",
            'stadtteil': stadtteil
        }
        features.append(f)

    os.makedirs(os.path.join(_DIR, 'data'), exist_ok=True)
    with open(os.path.join(_DIR, 'data', 'trees.json'), 'w', encoding='utf-8') as out:
        json.dump(features, out, indent=2)
        
    print(f"Successfully processed {len(features)} trees using Regex.")
