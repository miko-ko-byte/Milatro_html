
function baron_effect(points, mult, hand, gameState, handInfo) {
    let multMultiplier = 1;
    hand.forEach(card => {
        if (card.rank === 'K') {
            multMultiplier *= 1.5;
        }
    });
    return { points: points, mult: mult * multMultiplier, message: `x${multMultiplier.toFixed(2)} mult!` };
}




