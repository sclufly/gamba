import { useState } from 'react';
import sets from '../data/sets';
import dp1 from '../data/dp1';
import me1 from '../data/me1';
import sv8 from '../data/sv8';
import sv8pt5 from '../data/sv8pt5';
import sv10 from '../data/sv10';
import rarities from '../data/rarities';

const Pack = () => {

    const [maxCards, setMaxCards] = useState(null);
    const [cardObjects, setCardObjects] = useState(null);
    const [selectedSetId, setSelectedSetId] = useState('dp1');
    const [imageUrl, setImageUrl] = useState(null);

    const allowedSetIds = ['sv8pt5', 'sv10', 'sv8', 'me1', 'dp1'];
    const dropdownSets = (sets.data || []).filter(s => allowedSetIds.includes(s.id));
    const baseRarities = ['Common', 'Uncommon', 'Rare'];

    const packSize = 5;

    // this represents the number of cards in a normal pack
    // the real number is 10, but this can be reduced to increase hit rates
    const rarityMultiplier = 1.2;

    // helper function to get collection for a specific set from local storage
    const getSetCollection = (setId) => {
        const collection = localStorage.getItem(`${setId}`);
        return collection ? JSON.parse(collection) : {};
    };

    // helper function to save a card to local storage
    const saveCardToCollection = (card, setId) => {
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

    // generate cards based on rarity
    const generateCards = (cardsByRarity, setId) => {
        const setRarities = rarities[setId];
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

        // sort cards by rarity (common first, rarest last)
        const rarityOrder = Object.keys(setRarities).reverse();
        selectedCards.sort((a, b) => rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity));

        return selectedCards;
    }

    const handleClick = async () => {
        
        // get the card data based on selected set ID
        let cardsByRarity;
        let allCards;
        switch(selectedSetId) {
            case 'dp1':
                cardsByRarity = dp1.cardsByRarity;
                allCards = dp1.data;
                break;
            case 'me1':
                cardsByRarity = me1.cardsByRarity;
                allCards = me1.data;
                break;
            case 'sv8':
                cardsByRarity = sv8.cardsByRarity;
                allCards = sv8.data;
                break;
            case 'sv8pt5':
                cardsByRarity = sv8pt5.cardsByRarity;
                allCards = sv8pt5.data;
                break;
            case 'sv10':
                cardsByRarity = sv10.cardsByRarity;
                allCards = sv10.data;
                break;
            default:
                cardsByRarity = {};
                allCards = [];
        }
        
        const max = allCards.length;

        // generate cards and set their URLs
        const selectedCards = generateCards(cardsByRarity, selectedSetId);
        const urls = selectedCards.map(card => card.images.large);

        // save each card to local storage
        selectedCards.forEach(card => {
            const savedCard = saveCardToCollection(card, selectedSetId);
            console.log(`Saved ${savedCard.name} to collection. Pull count: ${savedCard.count}`);
        });

        console.log('set id used:', selectedSetId);
        console.log('selected cards:', selectedCards);

        setMaxCards(max);
        setCardObjects(selectedCards);
        setImageUrl(urls);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <label htmlFor="set-select" style={{ fontSize: 14 }}>Set:</label>
                <select id="set-select" value={selectedSetId} onChange={e => setSelectedSetId(e.target.value)}>
                    {dropdownSets.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))} 
                </select>
                <button className="card-button" onClick={handleClick}>LUCKGE 🍀</button>
            </div>
            {imageUrl && (
                <div style={{ marginTop: 20 }}>
                    {imageUrl.map((url, index) => (
                        <div key={index} style={{ marginBottom: 20 }}>
                            <img src={url} alt={`set ${index + 1} hires`} style={{ width: 400, height: 'auto', display: 'block' }} />
                            <p style={{ textAlign: 'center' }}>{cardObjects[index].name} ({cardObjects[index].rarity}) — {cardObjects[index].number}/{maxCards}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// TODO:
// i should add nice animations for opening a pack and viewing collected cards
// i should add a limit on the number of packs you can open per day
// i should add a mode for looking at special cards (not added to collection)
// i should add price data for special cards

export default Pack;