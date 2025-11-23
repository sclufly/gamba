import { useState } from 'react';
import sets from '../data/sets';
import Dropdown from './Dropdown';
import '../styles/Card.css';

const Card = () => {

    const [setObject, setSetObject] = useState(null);
    const [maxCards, setMaxCards] = useState(null);
    const [cardNumber, setCardNumber] = useState(null);
    const [cardObject, setCardObject] = useState(null);
    const [selectedSetId, setSelectedSetId] = useState('random');
    const [imageUrl, setImageUrl] = useState(null);

    const allowedSetIds = ['sv8pt5', 'sv10', 'sv8', 'me1', 'dp1'];
    const filteredSets = (sets.data || []).filter(s => allowedSetIds.includes(s.id));
    const dropdownSets = [{ id: 'random', name: 'Random' }, ...filteredSets];

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
        const generatedCardNumber = Math.floor(Math.random() * max) + 1;
        const url = `https://images.pokemontcg.io/${set.id}/${generatedCardNumber}_hires.png`;
        

        console.log('set id used:', set.id);
        console.log(url);

        setSetObject(set);
        setMaxCards(max);
        setCardNumber(generatedCardNumber);
        setImageUrl(url);
    }

    return (
        <div className="card-container">
            <p>Welcome to <b>&lt;Card /&gt;</b>! Select a set below and click the 🍀 button to receive 1 random card.</p>
            <div className="card-controls">
                <Dropdown 
                    sets={dropdownSets}
                    selectedSetId={selectedSetId}
                    onSetChange={setSelectedSetId}
                />
            </div>
            <button className="card-button" onClick={handleClick}>🍀</button>
            {imageUrl && (
                <div className="card-image-container">
                    <div className="card-3d-container">
                        {[...Array(100)].map((_, i) => (
                            <div key={i + 1} className={`card-grid-cell card-grid-cell-${i + 1}`}></div>
                        ))}
                        <img src={imageUrl} alt="set hires" className="card-image card-3d-image" />
                    </div>
                </div>
            )}
            {imageUrl && <p className="card-info">{setObject.name} ({setObject.releaseDate}) — {cardNumber}/{maxCards}</p>}
        </div>
    );
};

export default Card;