
function business_card_effect(points, mult, hand, gameState, handInfo) {
    let moneyAdded = 0;
    hand.forEach(card => {
        if (['J', 'Q', 'K'].includes(card.rank)) {
            if (Math.random() < 0.5) {
                moneyAdded += 2;
            }
        }
    });
    // This effect requires modifying the player's money, which is not directly possible.
    // Returning a message for now.
    return { points: points, mult: mult, message: `+$${moneyAdded}!` };
}

const business_card = {
    name: "Business Card",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: business_card_effect
};


