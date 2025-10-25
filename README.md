
# Gamba

Small React app for randomly fetching Pokemon TCG card images from a set.

## What this is

This repository is a lightweight front-end demo that lets you fetch random Pokémon TCG card images from configured sets. It uses local JSON/JS data in `src/data` for sets and constructs image URLs from the Pokémon TCG images CDN.

Key component: `src/components/Card.js` — a simple UI with a dropdown to pick a set (or Random) and a button to fetch a random card image from that set.

## Sets available in the dropdown

By design the `Card` dropdown shows only these choices (plus `Random`):

- Prismatic Evolutions (id: `sv8pt5`)
- Destined Rivals (id: `sv10`)
- Surging Sparks (id: `sv8`)
- Mega Evolution (id: `me1`)
- Diamond & Pearl (id: `dp1`)

The set data lives under `src/data` (e.g. `sets.js` / `sets.json`). The code allow-lists those IDs so only the above names appear in the select.

## How to run

1. Install dependencies (run from repository root):

```bash
npm install
```

2. Start the dev server:

```bash
npm start
```

This will open the app (typically at `http://localhost:3000/`).

## How the image URL is formed

Card images are fetched from the public CDN using the pattern:

```
https://images.pokemontcg.io/{setId}/{cardNumber}_hires.png
```

`Card.js` constructs `cardNumber` randomly from the set's `total` or `printedTotal` fields when available.

## Development notes

- If a selected set id is missing from `src/data/sets`, the component falls back to selecting a random set to avoid crashes.
- The component uses a local allowlist (`allowedSetIds`) to restrict dropdown options to the user's requested sets.
- The code avoids state shadowing by using a local `generatedCardNumber` variable when building the image URL.

## TODOs

- Display rarity and the Pokémon image metadata returned by the API (if integrated).
- Add animations for opening a pack and a collection tracker.
- Add a per-day limit for pulls and persistence (localStorage or backend).

## Where to look in the code

- `src/components/Card.js` — dropdown + random card fetch logic.
- `src/data/` — set data files (`sets.js`, `sets.json`, other set JSON).

---
