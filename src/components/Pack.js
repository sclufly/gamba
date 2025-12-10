import { useState, useRef, useEffect } from 'react';
import sets from '../data/sets';
import dp1 from '../data/dp1';
import me1 from '../data/me1';
import sv8 from '../data/sv8';
import sv8pt5 from '../data/sv8pt5';
import sv10 from '../data/sv10';
import rarities from '../data/rarities';
import Dropdown from './Dropdown';
import { useCardMouseTracking, saveCardToCollection, generateCards } from '../utils/utils';
import '../styles/Pack.css';

const Pack = () => {

    const [maxCards, setMaxCards] = useState(null);
    const [cardObjects, setCardObjects] = useState(null);
    const [opened, setOpened] = useState(false);
    const [removedCount, setRemovedCount] = useState(0);
    const [finalReveal, setFinalReveal] = useState(false);
    const [selectedSetId, setSelectedSetId] = useState('dp1');
    const [imageUrl, setImageUrl] = useState(null);
    const cardRefs = useRef([]);
    const { handleMouseMove } = useCardMouseTracking();

    // Pack opening animation states
    const [showPack, setShowPack] = useState(false);
    const [cutProgress, setCutProgress] = useState(0);
    const [packOpening, setPackOpening] = useState(false);
    const [mousePressed, setMousePressed] = useState(false);
    const packRef = useRef(null);

    // Mouse tracking for holographic effect
    useEffect(() => {
        cardRefs.current.forEach((cardElement) => {
            if (cardElement) {
                const mouseMoveHandler = (e) => handleMouseMove(e, cardElement);
                cardElement.addEventListener('mousemove', mouseMoveHandler);
                
                // Cleanup
                cardElement._mouseMoveHandler = mouseMoveHandler;
            }
        });

        return () => {
            cardRefs.current.forEach((cardElement) => {
                if (cardElement && cardElement._mouseMoveHandler) {
                    cardElement.removeEventListener('mousemove', cardElement._mouseMoveHandler);
                }
            });
        };
    }, [imageUrl]);

    const allowedSetIds = ['sv8pt5', 'sv10', 'sv8', 'me1', 'dp1'];
    const dropdownSets = (sets.data || []).filter(s => allowedSetIds.includes(s.id));
    const baseRarities = ['Common', 'Uncommon', 'Rare'];

    const packSize = 5;

    // this represents the number of cards in a normal pack
    // the real number is 10, but this can be reduced to increase hit rates
    const rarityMultiplier = 1.2;

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
        const selectedCards = generateCards(cardsByRarity, selectedSetId, rarities, baseRarities, packSize, rarityMultiplier);
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

        // reset animation state
        setRemovedCount(0);
        setFinalReveal(false);
        setOpened(false);
        
        // Show pack opening animation first
        setShowPack(true);
        setCutProgress(0);
        setPackOpening(false);
    }

    // Handle mouse movement across the pack for cutting animation
    const handlePackMouseMove = (e) => {
        if (!packRef.current || packOpening || !mousePressed) return;
        
        const wrapperRect = packRef.current.getBoundingClientRect();
        const packWidth = 300; // actual pack width
        const packLeft = wrapperRect.left + (wrapperRect.width - packWidth) / 2;
        const x = e.clientX - packLeft;
        const progress = Math.max(0, Math.min(1, x / packWidth));
        setCutProgress(progress);
        
        // When user reaches the full horizontal distance, trigger pack opening
        if (progress >= 0.99) {
            setPackOpening(true);
            setMousePressed(false);
            // After pack splits and fades, show the cards
            setTimeout(() => {
                setShowPack(false);
                setOpened(true);
            }, 800);
        }
    };

    const handlePackMouseDown = () => {
        if (!packOpening) {
            setMousePressed(true);
        }
    };

    const handlePackMouseUp = () => {
        setMousePressed(false);
    };

    const handleCardClick = (index) => {
        if (!cardObjects) return;
        const topIndex = removedCount; // top card is the lowest index that hasn't been removed
        if (index !== topIndex) return; // only allow clicking the top card

        // remove this top card (triggers CSS animation)
        setRemovedCount((c) => {
            const next = c + 1;
            // when all cards have been clicked, show final reveal after short delay
            if (next >= cardObjects.length) {
                // reveal immediately when last card is clicked
                setFinalReveal(true);
            }
            return next;
        });
    }

    return (
        <div className="pack-container">
            <p>Welcome to <b>&lt;Pack /&gt;</b>! Select a set below and click the 🍀 button to receive 5 random cards.</p>
            <div className="pack-controls">
                <Dropdown 
                    sets={dropdownSets}
                    selectedSetId={selectedSetId}
                    onSetChange={setSelectedSetId}
                />
            </div>
            <button 
                className="card-button" 
                onClick={handleClick}
                disabled={showPack || (imageUrl && !finalReveal)}
            >🍀</button>
            {showPack && (
                <div className="pack-opening-container">
                    <div 
                        ref={packRef}
                        className="pack-interaction-area"
                        onMouseMove={handlePackMouseMove}
                        onMouseDown={handlePackMouseDown}
                        onMouseUp={handlePackMouseUp}
                        onMouseLeave={handlePackMouseUp}
                    >
                        <div 
                            className={`pack-graphic ${packOpening ? 'opening' : ''}`}
                            style={{ '--cut-progress': cutProgress }}
                        >
                            <div className="pack-half pack-top"></div>
                            <div className="pack-half pack-bottom"></div>
                            <div className="cut-line" style={{ width: `${cutProgress * 100}%` }}></div>
                            {cutProgress < 0.99 && (
                                <div className="pack-instruction">Hold and drag right →</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {imageUrl && (
                <div className={`pack-results ${showPack ? 'hidden' : ''} ${opened ? 'pack-opened' : ''} ${finalReveal ? 'pack-final' : ''}`}>
                    <div className={`pack-clip ${finalReveal ? 'no-clip' : ''}`}>
                    {imageUrl.map((url, index) => {
                        const card = cardObjects[index];
                        const isCommonRarity = baseRarities.includes(card.rarity);
                        const isRareHolo = card.rarity.includes('Rare Holo');
                        const cardGlare = isCommonRarity 
                            ? 'card-glare' 
                            : isRareHolo 
                                ? 'card-glare card-holo card-holo-clipped' 
                                : 'card-glare card-holo';
                        const total = imageUrl.length;
                        // Now we treat index 0 as the top-most card. removedCount counts how many top cards have been removed.
                        // When finalReveal is active, show all cards again (don't mark them removed)
                        const removed = !finalReveal && index < removedCount;
                        const isTop = index === removedCount && !removed && !finalReveal;

                        return (
                            <div 
                                key={index} 
                                className={`pack-card-result ${removed ? 'removed' : 'stacked'} ${isTop ? 'clickable' : ''}`}
                                ref={(el) => (cardRefs.current[index] = el)}
                                style={{ ['--i']: index, ['--total']: total }}
                                onClick={() => handleCardClick(index)}
                            >
                                <div className="card-3d-container">
                                    {[...Array(100)].map((_, i) => (
                                        <div key={i + 1} className={`card-grid-cell card-grid-cell-${i + 1}`}></div>
                                    ))}
                                    <div className="card-3d-rotator">
                                        <img src={url} alt={`set ${index + 1} hires`} className="pack-card-image card-3d-image" />
                                        <div className={cardGlare}></div>
                                    </div>
                                </div>
                                {/* only show info when this card is visible (top) or in final reveal */}
                                {(!removed && (isTop || finalReveal)) && (
                                    <p className="pack-card-info">{card.name} ({card.rarity}) — {card.number}/{maxCards}</p>
                                )}
                            </div>
                        );
                    })}
                    </div>
                </div>
            )}
        </div>
    );
};

// TODO:
// i should add nice animations for viewing collected cards
// i should add a limit on the number of packs you can open per day
// i should add price data for special cards

export default Pack;