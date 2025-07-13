
function drivers_license_effect(points, mult, hand, gameState, handInfo) {
    // Assuming gameState.deck is an array of card objects with an 'enhanced' property
    const enhancedCards = gameState.deck.filter(card => card.enhanced).length;
    if (enhancedCards >= 16) {
        return { points: points, mult: mult * 3, message: `x3 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}

const drivers_license = {
    name: "Driver's License",
    image_url: "assets/jokers/joker.png",
    rarity: "Rare",
    effect: drivers_license_effect
};


