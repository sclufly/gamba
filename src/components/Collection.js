import { useState, useEffect, useRef } from 'react';
import sets from '../data/sets';
import Dropdown from './Dropdown';
import { useCardMouseTracking, getCardGlareClass } from '../utils/utils';
import { ALLOWED_SET_IDS, BASE_RARITIES } from '../utils/constants';
import '../styles/Collection.css';

const Collection = () => {
    const [selectedSetId, setSelectedSetId] = useState('dp1');
    const [collectedCards, setCollectedCards] = useState([]);
    const [enlargedCard, setEnlargedCard] = useState(null);
    const cardRef = useRef(null);
    const { handleMouseMove } = useCardMouseTracking();

    const allowedSetIds = ALLOWED_SET_IDS;
    const dropdownSets = (sets.data || []).filter(s => allowedSetIds.includes(s.id));
    const baseRarities = BASE_RARITIES;

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

    // Mouse tracking for holographic effect on enlarged card
    useEffect(() => {
        const mouseMoveHandler = (e) => handleMouseMove(e, cardRef.current);

        if (cardRef.current && enlargedCard) {
            cardRef.current.addEventListener('mousemove', mouseMoveHandler);
        }

        return () => {
            if (cardRef.current) {
                cardRef.current.removeEventListener('mousemove', mouseMoveHandler);
            }
        };
    }, [enlargedCard]);

    const handleCardClick = (card) => {
        setEnlargedCard(card);
    };

    const closeEnlargedView = () => {
        setEnlargedCard(null);
    };

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
                                    onClick={() => handleCardClick(card)}
                                />
                                <p className="collection-card-name">
                                    {card.name}
                                </p>
                                <p className="collection-card-rarity">
                                    {card.rarity} • #{card.number}
                                </p>
                                <p className="collection-card-count">
                                    Pulled {card.count}x
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="collection-empty">No cards collected from this set yet.</p>
            )}

            {enlargedCard && (
                <div className="collection-modal-overlay" onClick={closeEnlargedView}>
                    <div className="collection-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="collection-modal-close" onClick={closeEnlargedView}>×</button>
                        <div className="collection-enlarged-card">
                            <div className="card-3d-container" ref={cardRef}>
                                {[...Array(100)].map((_, i) => (
                                    <div key={i + 1} className={`card-grid-cell card-grid-cell-${i + 1}`}></div>
                                ))}
                                <div className="card-3d-rotator">
                                    <img 
                                        src={enlargedCard.images.large} 
                                        alt={enlargedCard.name} 
                                        className="card-3d-image"
                                    />
                                    <div className={getCardGlareClass(enlargedCard.rarity)}></div>
                                </div>
                            </div>
                            <div className="collection-modal-info">
                                <p className="collection-modal-name">{enlargedCard.name}</p>
                                <p className="collection-modal-details">
                                    {enlargedCard.rarity} • #{enlargedCard.number}
                                </p>
                                <p className="collection-modal-pulls">
                                    Pulled {enlargedCard.count}x
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Collection;
