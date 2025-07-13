
function fortune_teller_effect(points, mult, hand, gameState, handInfo) {
    // Assuming gameState.tarotCardsUsed is a number
    const multAdded = gameState.tarotCardsUsed;
    return { points: points, mult: mult + multAdded, message: `+${multAdded} mult!` };
}

const fortune_teller = {
    name: "Fortune Teller",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: fortune_teller_effect
};

