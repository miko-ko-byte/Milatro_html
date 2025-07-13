
function steel_joker_effect(points, mult, hand, gameState, handInfo) {
    // Assuming gameState.deck is an array of card objects with a 'steel' property
    const steelCards = gameState.deck.filter(card => card.steel).length;
    const multMultiplier = 1 + (steelCards * 0.2);
    return { points: points, mult: mult * multMultiplier, message: `x${multMultiplier.toFixed(2)} mult!` };
}

const steel_joker = {
    name: "Steel Joker",
    image_url: "assets/jokers/joker.png",
    rarity: "Uncommon",
    effect: steel_joker_effect
};

