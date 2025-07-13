function bbw_effect(points, mult, hand, gameState, handInfo) {
    let multAdded = 0;
    hand.forEach(card => {
        if (card.suit === '♠' || card.suit === '♣') {
            multAdded += mult; // Double the current mult
        }
    });
    return { points: points, mult: mult + multAdded, message: `x2 mult!` };
}