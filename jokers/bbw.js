function bbw_effect(points, mult, hand, gameState, handInfo) {
    let newMult = mult;
    hand.forEach(card => {
        if (card.suit === '♠' || card.suit === '♣') {
            newMult *= 2;
        }
    });
    return { points: points, mult: newMult };
}