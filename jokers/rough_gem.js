
function rough_gem_effect(points, mult, hand, gameState, handInfo) {
    let moneyAdded = 0;
    hand.forEach(card => {
        if (card.suit === '♦') {
            moneyAdded += 1;
        }
    });
    // This effect requires modifying the player's money, which is not directly possible.
    // Returning a message for now.
    return { points: points, mult: mult, message: `+$${moneyAdded}!` };
}




