import raw from './sv8pt5.json';

const allCards = Array.isArray(raw.cards)
  ? raw.cards.map(({ id, name, supertype, number, rarity, images }) => ({ id, name, supertype, number, rarity, images }))
  : [];

// group cards by rarity for efficient lookup
const cardsByRarity = {};
allCards.forEach(card => {
  if (!cardsByRarity[card.rarity]) {
    cardsByRarity[card.rarity] = [];
  }
  cardsByRarity[card.rarity].push(card);
});

export { cardsByRarity };
export default { data: allCards, cardsByRarity };
