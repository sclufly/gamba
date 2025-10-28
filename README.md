
# Gamba

Pokemon TCG pack opening simulator with realistic rarity-based card pulls.

## What this is

This repository is a React app that simulates opening Pokémon TCG booster packs with realistic pull rates. It uses local JSON/JS data for card information and pull rate probabilities from TCGPlayer.

**Key components:**
- `src/components/Pack.js` — Main pack opening UI with rarity-based card generation
- `src/components/Card.js` — Simple random card viewer with set selection

## Features

### Realistic Pack Opening
- Generates 5 cards per pack based on real TCG pull rates
- Pull rates sourced from TCGPlayer articles for accuracy
- Cards are sorted by rarity (commons first, rarest card last)
- Each card pull is independent with weighted probabilities

### Available Sets

- **Prismatic Evolutions** (sv8pt5)
- **Destined Rivals** (sv10)
- **Surging Sparks** (sv8)
- **Mega Evolution** (me1)
- **Diamond & Pearl** (dp1)

## How to run

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm start
```

The app will open at `http://localhost:3000/`.

## How it works

### Card Data Structure

Card data files (`dp1.js`, `me1.js`, etc.) export:
- `data`: Array of all cards with filtered fields (id, name, supertype, number, rarity, images)
- `cardsByRarity`: Pre-grouped object for efficient rarity-based lookups

Example structure:
```javascript
{
  data: [...],           // All cards array
  cardsByRarity: {
    "Common": [...],
    "Rare": [...],
    "Hyper Rare": [...]
  }
}
```

### Rarity System

Pull rates are defined in `src/data/rarities.js` as "1 in X" odds:

```javascript
{
  "Common": null,           // Base cards
  "Uncommon": null,         // Base cards
  "Rare": null,             // Base cards
  "Double Rare": 6,         // 1 in 6 packs
  "Ultra Rare": 13,         // 1 in 13 packs
  "Hyper Rare": 180         // 1 in 180 packs
}
```

### Card Generation Algorithm

1. For each of 5 cards in a pack:
   - Roll a random number (0-100)
   - Check rarities from rarest to most common
   - If roll matches a rare pull rate, select that rarity
   - Otherwise, default to Common/Uncommon/Rare
   - Pick a random card from the selected rarity pool

2. Sort the 5 cards by rarity (rarest last)

3. Display cards with images and metadata

## Project Structure

```
src/
├── components/
│   ├── Pack.js          # Main pack opening component
│   └── Card.js          # # Single card random generator
├── data/
│   ├── sets.js          # Set metadata (name, total cards, release date)
│   ├── rarities.js      # Pull rates for each set
│   ├── dp1.js           # Diamond & Pearl card data
│   ├── me1.js           # Mega Evolution card data
│   ├── sv8.js           # Surging Sparks card data
│   ├── sv8pt5.js        # Prismatic Evolutions card data
│   ├── sv10.js          # Destined Rivals card data
│   └── *.json           # Raw card data from Pokemon TCG API
└── scripts/
    └── filter-cards-script.py  # Generates filtered .js files from JSON
```

## Scripts

### filter-cards-script.py

Generates the card data JavaScript files from raw JSON:

```bash
python src/scripts/filter-cards-script.py
```

This script:
- Reads full card data from `.json` files
- Filters to only essential fields (id, name, supertype, number, rarity, images)
- Groups cards by rarity for efficient lookup
- Exports both flat array and grouped object

## Development notes

- Card grouping happens at module load time (not on every button click) for performance
- Pull rates are based on real TCGPlayer data but can be adjusted in `rarities.js`
- Cards are pre-filtered to reduce bundle size (only 6 fields per card)
- Image URLs use the Pokemon TCG images CDN (`images.pokemontcg.io`)

## TODOs

- Add pack opening animations
- Implement collection tracker with localStorage
- Add daily pull limit
- Display card prices for rare pulls
- Add mode for viewing special cards without adding to collection

## Where to look in the code

- `src/components/Pack.js` — Pack opening logic and rarity-based generation
- `src/data/rarities.js` — Pull rate configuration
- `src/data/dp1.js` (etc.) — Card data exports with rarity grouping
- `src/scripts/filter-cards-script.py` — Data processing script

---
