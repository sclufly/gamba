
# gamba

Pokemon TCG pack opening simulator with realistic rarity-based card pulls and collection tracking.

## What this is

A React web app that simulates opening Pokémon TCG booster packs with realistic pull rates. Features include pack opening, collection tracking with pull counters, and single card viewing. All card data is stored locally with pull rate probabilities based on TCGPlayer data.

**Key components:**
- `src/components/Pack.js` — Main pack opening UI with rarity-based card generation
- `src/components/Collection.js` — View collected cards with pull counts and statistics
- `src/components/Card.js` — Single random card generator with set selection
- `src/components/Menu.js` — Navigation hamburger menu
- `src/components/Dropdown.js` — Reusable custom dropdown for set selection

## Features

### Pack Opening (`<Pack />`)
- Generates 5 cards per pack based on real TCG pull rates
- Pull rates sourced from TCGPlayer articles for accuracy
- Cards are sorted by rarity (commons first, rarest card last)
- Each card pull is independent with weighted probabilities
- All pulled cards are automatically saved to collection

### Single Card Viewer (`<Card />`)
- Generate random individual cards
- Choose specific sets or random from all sets
- Quick way to view cards without opening full packs

### Collection Tracking (`<Collection />`)
- View all collected cards organized by set
- Pull counter for each card (tracks duplicate pulls)
- Statistics showing unique cards and total pulls
- Cards sorted by number within each set
- Persistent storage using localStorage

### Navigation
- Hamburger menu for page switching
- Three pages: Pack opening, Card viewer, and Collection viewing
- Responsive design with custom styled components

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
│   ├── Collection.js    # Collection viewer with statistics
│   ├── Card.js          # Single card random generator
│   ├── Menu.js          # Navigation hamburger menu
│   └── Dropdown.js      # Reusable custom dropdown component
├── styles/
│   ├── Pack.css         # Pack component styles
│   ├── Collection.css   # Collection component styles
│   ├── Card.css         # Card component styles
│   ├── Menu.css         # Menu component styles
│   └── Dropdown.css     # Dropdown component styles
├── data/
│   ├── sets.js          # Set metadata (name, total cards, release date)
│   ├── rarities.js      # Pull rates for each set
│   ├── dp1.js           # Diamond & Pearl card data
│   ├── me1.js           # Mega Evolution card data
│   ├── sv8.js           # Surging Sparks card data
│   ├── sv8pt5.js        # Prismatic Evolutions card data
│   ├── sv10.js          # Destined Rivals card data
│   └── *.json           # Raw card data from Pokemon TCG API
├── scripts/
│   └── filter-cards-script.py  # Generates filtered .js files from JSON
├── App.js               # Main app with page routing
└── App.css              # Global app styles
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

## Local Storage

The app uses localStorage to persist your collection:

- Each set has its own storage key: `dp1`, `me1`, `sv8`, `sv8pt5`, `sv10`
- Card data includes: id, name, rarity, number, images, pull count, and first pull timestamp
- Collection persists across browser sessions
- Clear browser data to reset your collection

## TODOs

- Add pack opening animations
- Add daily pull limit
- Display card prices for rare pulls
- Add completion percentage per set
- Export/import collection data

---
