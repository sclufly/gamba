// Mouse tracking utility for holographic card effects
export const useCardMouseTracking = (cardRef, imageUrl) => {
    const handleMouseMove = (e, cardElement) => {
        if (!cardElement) return;
        
        const rect = cardElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = x / rect.width;
        const py = y / rect.height;
        
        cardElement.style.setProperty('--mx', `${px * 100}%`);
        cardElement.style.setProperty('--my', `${py * 100}%`);
        cardElement.style.setProperty('--posx', `${px * 100}%`);
        cardElement.style.setProperty('--posy', `${py * 100}%`);
        
        // Calculate distance from center for hyp variable
        const dx = px - 0.5;
        const dy = py - 0.5;
        const hyp = Math.sqrt(dx * dx + dy * dy);
        cardElement.style.setProperty('--hyp', hyp);
    };

    return { handleMouseMove };
};

// Collection management utilities
export const getSetCollection = (setId) => {
    const collection = localStorage.getItem(`${setId}`);
    return collection ? JSON.parse(collection) : {};
};

export const saveCardToCollection = (card, setId) => {
    const setCollection = getSetCollection(setId);
    
    // either increment pull count of existing card or add new card to collection
    if (setCollection[card.id]) {
        setCollection[card.id].count += 1;
    } else {
        setCollection[card.id] = {
            id: card.id,
            name: card.name,
            rarity: card.rarity,
            number: card.number,
            images: card.images,
            count: 1,
            firstPulled: new Date().toISOString()
        };
    }
    
    localStorage.setItem(`${setId}`, JSON.stringify(setCollection));
    return setCollection[card.id];
};

// Helper function for god pack generation
const getGodPack = (cardsByRarity, setRarities, baseRarities) => {
    const selectedCards = [];
    
    // Get rarities that are not base rarities
    const rareCardRarities = Object.keys(setRarities).filter(
        r => !baseRarities.includes(r) && cardsByRarity[r]?.length > 0
    );
    
    for (let i = 0; i < 5; i++) {
        // Pick a random rarity from the rare card pool
        const selectedRarity = rareCardRarities[Math.floor(Math.random() * rareCardRarities.length)];
        
        // Pick a random card from that rarity
        const cardsInRarity = cardsByRarity[selectedRarity] || [];
        const randomCard = cardsInRarity[Math.floor(Math.random() * cardsInRarity.length)];
        selectedCards.push(randomCard);
        
        console.log('GOD PACK', selectedRarity);
    }
    
    return selectedCards;
};

// Helper function for normal pack generation
const getNormalPack = (cardsByRarity, setRarities, baseRarities, packSize, rarityMultiplier) => {
    const selectedCards = [];
    
    for (let i = 0; i < packSize; i++) {
        let selectedRarity = null;
        const roll = Math.random() * 100; // 0-100
        let cumulativeThreshold = 0;
        
        // check each rarity with cumulative probability ranges
        for (const [rarity, rate] of Object.entries(setRarities)) {
            if (rate === null || !cardsByRarity[rarity]?.length) continue;

            // convert per-pack rate to per-card rate
            const perCardRate = rate * rarityMultiplier;
            const rarityPercentage = 100 / perCardRate;
            cumulativeThreshold += rarityPercentage;
            
            // if there's a hit, take it
            if (roll < cumulativeThreshold) {
                selectedRarity = rarity;
                break;
            }
        }
        
        // if no rare card was selected, default to Common/Uncommon/Rare
        if (!selectedRarity) {
            selectedRarity = baseRarities[Math.floor(Math.random() * baseRarities.length)];
        }
        
        // pick a random card from the selected rarity
        const cardsInRarity = cardsByRarity[selectedRarity] || [];
        const randomCard = cardsInRarity[Math.floor(Math.random() * cardsInRarity.length)];
        selectedCards.push(randomCard);

        console.log(roll, selectedRarity);
    }
    
    return selectedCards;
};

// Card generation utility
export const generateCards = (cardsByRarity, setId, rarities, baseRarities, packSize, rarityMultiplier) => {
    const setRarities = rarities[setId];
    
    // determine if this is a "god pack" (1% chance)
    const isGodPack = Math.random() < 0.01;

    const selectedCards = isGodPack
        ? getGodPack(cardsByRarity, setRarities, baseRarities)
        : getNormalPack(cardsByRarity, setRarities, baseRarities, packSize, rarityMultiplier);

    // sort cards by rarity (common first, rarest last), then by supertype (Energy first)
    const rarityOrder = Object.keys(setRarities).reverse();
    const rarityRank = Object.fromEntries(
        rarityOrder.map((r, i) => [r, i])
    );

    selectedCards.sort((a, b) =>
        rarityRank[a.rarity] - rarityRank[b.rarity] ||
        ((a.supertype === "Energy") ? 0 : 1) -
        ((b.supertype === "Energy") ? 0 : 1)
    );

    return selectedCards;
};
