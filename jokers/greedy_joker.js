
function greedy_joker_effect(points, mult, hand, gameState, handInfo) {
    let newMult = mult;
    hand.forEach(card => {
        if (card.suit === '♦') {
            newMult += 3;
        }
    });
    return { points: points, mult: newMult };
}
