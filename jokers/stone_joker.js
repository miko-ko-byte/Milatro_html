
function stone_joker_effect(points, mult, hand, gameState, handInfo) {
    // Assuming gameState.deck is an array of card objects with a 'stone' property
    const stoneCards = gameState.deck.filter(card => card.stone).length;
    const chipsAdded = stoneCards * 25;
    return { points: points + chipsAdded, mult: mult, message: `+${chipsAdded} chips!` };
}



