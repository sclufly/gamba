import { useState, useEffect } from 'react';
import sets from '../data/sets';

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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
            <h2>Collection</h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20 }}>
                <label htmlFor="collection-set-select" style={{ fontSize: 14 }}>Set:</label>
                <select 
                    id="collection-set-select" 
                    value={selectedSetId} 
                    onChange={e => setSelectedSetId(e.target.value)}
                >
                    {dropdownSets.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))} 
                </select>
            </div>

            {totalCards > 0 ? (
                <div>
                    <p style={{ textAlign: 'center', marginBottom: 20 }}>
                        <strong>{totalCards}</strong> unique cards collected • <strong>{totalPulls}</strong> total pulls
                    </p>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                        gap: 20,
                        maxWidth: 1200,
                        padding: 20
                    }}>
                        {collectedCards.map((card) => (
                            <div key={card.id} style={{ 
                                textAlign: 'center',
                                backgroundColor: '#3e3e3e',
                                borderRadius: 8,
                                padding: 10
                            }}>
                                <img 
                                    src={card.images.small} 
                                    alt={card.name} 
                                    style={{ width: '100%', height: 'auto', borderRadius: 4 }} 
                                />
                                <p style={{ fontSize: 14, margin: '8px 0 4px 0', fontWeight: 'bold' }}>
                                    {card.name}
                                </p>
                                <p style={{ fontSize: 12, margin: '4px 0', color: '#ccc' }}>
                                    {card.rarity}
                                </p>
                                <p style={{ fontSize: 12, margin: '4px 0', color: '#ccc' }}>
                                    #{card.number}
                                </p>
                                <p style={{ fontSize: 14, margin: '8px 0 0 0', color: '#0066cc', fontWeight: 'bold' }}>
                                    Pulled: {card.count}x
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p style={{ color: '#666', marginTop: 20 }}>No cards collected from this set yet.</p>
            )}
        </div>
    );
};

export default Collection;
