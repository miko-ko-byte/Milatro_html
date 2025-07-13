function lusty_joker_effect(points, mult, hand, gameState, handInfo) {
    let multAdded = 0;
    hand.forEach(card => {
        if (card.suit === '♥') {
            multAdded += 3;
        }
    });
    return { points: points, mult: mult + multAdded, message: `+${multAdded} mult!` };
}

const lusty_joker = {
    name: "Lusty Joker",
    image_url: "assets/jokers/Lusty_Joker.png",
    rarity: "Common",
    effect: lusty_joker_effect
};

