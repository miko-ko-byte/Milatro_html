
function seeing_double_effect(points, mult, hand, gameState, handInfo) {
    const hasClub = hand.some(card => card.suit === '♣');
    const hasOtherSuit = hand.some(card => card.suit !== '♣');
    if (hasClub && hasOtherSuit) {
        return { points: points, mult: mult * 2, message: `x2 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}

const seeing_double = {
    name: "Seeing Double",
    image_url: "assets/jokers/joker.png",
    rarity: "Uncommon",
    effect: seeing_double_effect
};


