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
