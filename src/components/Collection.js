import { useState, useEffect } from 'react';
import sets from '../data/sets';
import Dropdown from './Dropdown';
import '../styles/Collection.css';

const Collection = () => {
    const [selectedSetId, setSelectedSetId] = useState('dp1');
    const [collectedCards, setCollectedCards] = useState([]);

    const allowedSetIds = ['sv8pt5', 'sv10', 'sv8', 'me1', 'dp1'];
    const dropdownSets = (sets.data || []).filter(s => allowedSetIds.includes(s.id));

    // helper function to get collection for a specific set from local storage
    const getSetCollection = (setId) => {
        const collection = localStorage.getItem(`${setId}`);
        return collection ? JSON.parse(collection) : {};
    };

    // load collection when component mounts or when set changes
    useEffect(() => {
        const setCollection = getSetCollection(selectedSetId);
        const cardsArray = Object.values(setCollection).sort((a, b) => {
            const numA = parseInt(a.number);
            const numB = parseInt(b.number);
            return numA - numB;
        });
        setCollectedCards(cardsArray);
    }, [selectedSetId]);

    const totalCards = collectedCards.length;
    const totalPulls = collectedCards.reduce((sum, card) => sum + card.count, 0);

    return (
        <div className="collection-container">
            <p>Welcome to <b>&lt;Collection /&gt;</b>! Select a set below to view your collected cards from <b>&lt;Pack /&gt;</b> pulls.</p>
            <div className="collection-controls">
                <Dropdown 
                    sets={dropdownSets}
                    selectedSetId={selectedSetId}
                    onSetChange={setSelectedSetId}
                />
            </div>

            {totalCards > 0 ? (
                <div>
                    <p className="collection-stats">
                        <strong>{totalCards}</strong> unique cards collected • <strong>{totalPulls}</strong> total pulls
                    </p>
                    <div className="collection-grid">
                        {collectedCards.map((card) => (
                            <div key={card.id} className="collection-card">
                                <img 
                                    src={card.images.small} 
                                    alt={card.name} 
                                    className="collection-card-image"
                                />
                                <p className="collection-card-name">
                                    {card.name}
                                </p>
                                <p className="collection-card-rarity">
                                    {card.rarity}
                                </p>
                                <p className="collection-card-number">
                                    #{card.number}
                                </p>
                                <p className="collection-card-count">
                                    Pulled: {card.count}x
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="collection-empty">No cards collected from this set yet.</p>
            )}
        </div>
    );
};

export default Collection;
