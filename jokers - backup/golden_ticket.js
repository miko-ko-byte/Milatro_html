
function golden_ticket_effect(points, mult, hand, gameState, handInfo) {
    let moneyAdded = 0;
    hand.forEach(card => {
        // Assuming card has a 'gold' property
        if (card.gold) {
            moneyAdded += 4;
        }
    });
    // This effect requires modifying the player's money, which is not directly possible.
    // Returning a message for now.
    return { points: points, mult: mult, message: `+$${moneyAdded}!` };
}

const golden_ticket = {
    name: "Golden Ticket",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: golden_ticket_effect
};


