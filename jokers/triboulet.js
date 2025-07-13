
function triboulet_effect(points, mult, hand, gameState, handInfo) {
    let multMultiplier = 1;
    hand.forEach(card => {
        if (['K', 'Q'].includes(card.rank)) {
            multMultiplier *= 2;
        }
    });
    return { points: points, mult: mult * multMultiplier, message: `x${multMultiplier.toFixed(2)} mult!` };
}




