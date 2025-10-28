import os

script_dir = os.path.dirname(os.path.abspath(__file__))
data_dir = os.path.join(os.path.dirname(script_dir), 'data')

json_files = ['dp1.json', 'me1.json', 'sv8.json', 'sv8pt5.json', 'sv10.json']
fields_to_keep = ['id', 'name', 'supertype', 'number', 'rarity', 'images']

# process each JSON file
for json_file in json_files:
    base_name = json_file.replace('.json', '')
    output_path = os.path.join(data_dir, f'{base_name}.js')
    fields_str = ', '.join(fields_to_keep)
    
    # create the JavaScript content that groups by rarity
    js_content = f"""import raw from './{json_file}';

const allCards = Array.isArray(raw.cards)
  ? raw.cards.map(({{ {fields_str} }}) => ({{ {fields_str} }}))
  : [];

// group cards by rarity for efficient lookup
const cardsByRarity = {{}};
allCards.forEach(card => {{
  if (!cardsByRarity[card.rarity]) {{
    cardsByRarity[card.rarity] = [];
  }}
  cardsByRarity[card.rarity].push(card);
}});

export {{ cardsByRarity }};
export default {{ data: allCards, cardsByRarity }};
"""
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
