import { useState } from 'react';
import sets from '../data/sets';

const Card = () => {

    const [imageUrl, setImageUrl] = useState(null);
    const [setName, setSetName] = useState(null);
    const [cardNumber, setCardNumber] = useState(null);
    const [maxCards, setMaxCards] = useState(null);
    const [releaseDate, setReleaseDate] = useState(null);
    const [selectedSetId, setSelectedSetId] = useState('random');

    const allowedSetIds = ['sv8pt5', 'sv10', 'sv8', 'me1', 'dp1'];
    const dropdownSets = (sets.data || []).filter(s => allowedSetIds.includes(s.id));

    const handleClick = async () => {
        // determine which set to use: either selected or random
        let setItem;
        if (selectedSetId && selectedSetId !== 'random') {
            setItem = sets.data.find(s => s.id === selectedSetId);
        }
        if (!setItem) {
            const randomIndex = Math.floor(Math.random() * sets.data.length);
            setItem = sets.data[randomIndex];
        }

        const setId = setItem.id;
        const max = Number(setItem.total) || Number(setItem.printedTotal) || 1;
        const generatedCardNumber = Math.floor(Math.random() * max) + 1;

        const url = `https://images.pokemontcg.io/${setId}/${generatedCardNumber}_hires.png`;

        console.log('set id used:', setId);
        console.log(url);

        setImageUrl(url);
        setSetName(setItem.name);
        setCardNumber(generatedCardNumber);
        setMaxCards(max);
        setReleaseDate(setItem.releaseDate);
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
            {imageUrl && <p style={{ textAlign: 'center' }}>{setName} ({releaseDate}) — {cardNumber}/{maxCards}</p>}
        </div>
    );
};

// TODO:
// i should display the rarity and image of the pokemon
// i should have nice animations for opening a pack
// i should have a collection tracker
// i should have a limit on the number of cards you can get per day

export default Card;