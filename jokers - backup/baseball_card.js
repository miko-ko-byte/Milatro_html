
function baseball_card_effect(points, mult, hand, gameState, handInfo) {
    // Assuming gameState.jokers is an array of joker objects with a 'rarity' property
    const uncommonJokers = gameState.jokers.filter(joker => joker.rarity === "Uncommon").length;
    const multMultiplier = 1 + (uncommonJokers * 0.5);
    return { points: points, mult: mult * multMultiplier, message: `x${multMultiplier.toFixed(2)} mult!` };
}

const baseball_card = {
    name: "Baseball Card",
    image_url: "assets/jokers/joker.png",
    rarity: "Rare",
    effect: baseball_card_effect
};


