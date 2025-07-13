
function seeing_double_effect(points, mult, hand, gameState, handInfo) {
    const hasClub = hand.some(card => card.suit === '♣');
    const hasOtherSuit = hand.some(card => card.suit !== '♣');
    if (hasClub && hasOtherSuit) {
        return { points: points, mult: mult * 2, message: `x2 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}




