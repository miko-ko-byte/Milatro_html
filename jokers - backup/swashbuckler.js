
function swashbuckler_effect(points, mult, hand, gameState, handInfo) {
    // Assuming gameState.jokers is an array of joker objects with a 'sellValue' property
    const sellValueSum = gameState.jokers.reduce((sum, joker) => sum + (joker.sellValue || 0), 0);
    return { points: points, mult: mult + sellValueSum, message: `+${sellValueSum} mult!` };
}

const swashbuckler = {
    name: "Swashbuckler",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: swashbuckler_effect
};

