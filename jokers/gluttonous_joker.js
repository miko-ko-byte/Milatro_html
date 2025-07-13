function gluttonous_joker_effect(points, mult, hand, gameState, handInfo) {
    let multAdded = 0;
    hand.forEach(card => {
        if (card.suit === '♣') {
            multAdded += 3;
        }
    });
    return { points: points, mult: mult + multAdded, message: `+${multAdded} mult!` };
}


