
function flower_pot_effect(points, mult, hand, gameState, handInfo) {
    const suits = new Set(hand.map(card => card.suit));
    if (suits.has('♦') && suits.has('♣') && suits.has('♥') && suits.has('♠')) {
        return { points: points, mult: mult * 3, message: `x3 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}




