
function shoot_the_moon_effect(points, mult, hand, gameState, handInfo) {
    let multAdded = 0;
    hand.forEach(card => {
        if (card.rank === 'Q') {
            multAdded += 13;
        }
    });
    return { points: points, mult: mult + multAdded, message: `+${multAdded} mult!` };
}




