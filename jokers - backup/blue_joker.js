
function blue_joker_effect(points, mult, hand, gameState, handInfo) {
    // Assuming gameState.deck is an array of card objects
    const chipsAdded = gameState.deck.length * 2;
    return { points: points + chipsAdded, mult: mult, message: `+${chipsAdded} chips!` };
}

const blue_joker = {
    name: "Blue Joker",
    image_url: "assets/jokers/Blue_Deck.png",
    rarity: "Common",
    effect: blue_joker_effect
};


