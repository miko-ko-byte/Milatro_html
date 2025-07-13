
function erosion_effect(points, mult, hand, gameState, handInfo) {
    // Assuming gameState.deck is an array of card objects and gameState.startingDeckSize is a number
    const deckSizeDifference = gameState.startingDeckSize - gameState.deck.length;
    if (deckSizeDifference > 0) {
        const multAdded = deckSizeDifference * 4;
        return { points: points, mult: mult + multAdded, message: `+${multAdded} mult!` };
    }
    return { points: points, mult: mult, message: "" };
}

const erosion = {
    name: "Erosion",
    image_url: "assets/jokers/joker.png",
    rarity: "Uncommon",
    effect: erosion_effect
};


