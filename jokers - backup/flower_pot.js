
function flower_pot_effect(points, mult, hand, gameState, handInfo) {
    const suits = new Set(hand.map(card => card.suit));
    if (suits.has('♦') && suits.has('♣') && suits.has('♥') && suits.has('♠')) {
        return { points: points, mult: mult * 3, message: `x3 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}

const flower_pot = {
    name: "Flower Pot",
    image_url: "assets/jokers/joker.png",
    rarity: "Uncommon",
    effect: flower_pot_effect
};


