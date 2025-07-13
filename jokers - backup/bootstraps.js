
function bootstraps_effect(points, mult, hand, gameState, handInfo) {
    // Assuming gameState.money is a number
    const multAdded = Math.floor(gameState.money / 5) * 2;
    return { points: points, mult: mult + multAdded, message: `+${multAdded} mult!` };
}

const bootstraps = {
    name: "Bootstraps",
    image_url: "assets/jokers/joker.png",
    rarity: "Uncommon",
    effect: bootstraps_effect
};


