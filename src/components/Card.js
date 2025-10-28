import { useState } from 'react';
import sets from '../data/sets';

const Card = () => {

    const [setObject, setSetObject] = useState(null);
    const [maxCards, setMaxCards] = useState(null);
    const [cardNumber, setCardNumber] = useState(null);
    const [cardObject, setCardObject] = useState(null);
    const [selectedSetId, setSelectedSetId] = useState('random');
    const [imageUrl, setImageUrl] = useState(null);

    const allowedSetIds = ['sv8pt5', 'sv10', 'sv8', 'me1', 'dp1'];
    const dropdownSets = (sets.data || []).filter(s => allowedSetIds.includes(s.id));

    const generateCardNumber = (max) => {

        let cardNumber = 1;

        // if a random set is selected, use a random card
        if (selectedSetId === 'random') {
            cardNumber = Math.floor(Math.random() * max) + 1;
        } 
        // otherwise, calculate card number based on rarity
        else {
            cardNumber = 4;
        }

        return cardNumber;
    }

    const handleClick = async () => {
        // determine which set to use: either selected or random
        let set;
        if (selectedSetId !== 'random') {
            set = sets.data.find(s => s.id === selectedSetId);
        } else {
            const randomIndex = Math.floor(Math.random() * sets.data.length);
            set = sets.data[randomIndex];
        }
        

        const max = Number(set.total) || Number(set.printedTotal) || 1;
        const generatedCardNumber = generateCardNumber(max);
        const url = `https://images.pokemontcg.io/${set.id}/${generatedCardNumber}_hires.png`;
        

        console.log('set id used:', set.id);
        console.log(url);

        setSetObject(set);
        setMaxCards(max);
        setCardNumber(generatedCardNumber);
        setImageUrl(url);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <label htmlFor="set-select" style={{ fontSize: 14 }}>Set:</label>
                <select id="set-select" value={selectedSetId} onChange={e => setSelectedSetId(e.target.value)}>
                    <option value="random">Random</option>
                    {dropdownSets.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))} 
                </select>
                <button className="card-button" onClick={handleClick}>LUCKGE 🍀</button>
            </div>
            {imageUrl && (
                <div style={{ marginTop: 20 }}>
                    <img src={imageUrl} alt="set hires" style={{ width: 400, height: 'auto', display: 'block' }} />
                </div>
            )}
            {imageUrl && <p style={{ textAlign: 'center' }}>{setObject.name} ({setObject.releaseDate}) — {cardNumber}/{maxCards}</p>}
        </div>
    );
};

// TODO:
// i should display the rarity and image of the pokemon
// i should have nice animations for opening a pack
// i should have a collection tracker
// i should have a limit on the number of cards you can get per day

export default Card;