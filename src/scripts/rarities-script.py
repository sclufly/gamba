import json
import os

json_files = ['dp1.json', 'me1.json', 'sv8.json', 'sv8pt5.json', 'sv10.json']

# load JSON
card_sets = {}
script_dir = os.path.dirname(os.path.abspath(__file__))
for filename in json_files:
    file_path = os.path.join(script_dir, filename)
    with open(file_path, 'r', encoding='utf-8') as f:
        card_sets[filename.replace('.json', '')] = json.load(f)

# process each set
for set_name, set_data in card_sets.items():
    
    found_rarities = set()
    for card in set_data['cards']:
        rarity = card.get('rarity')
        if rarity:
            found_rarities.add(rarity)
    
    print("-----")
    print(f"rarities for {set_name}:")
    print("-----")
    for rarity in sorted(found_rarities):
        print(f"{rarity}")