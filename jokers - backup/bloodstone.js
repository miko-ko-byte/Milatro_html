
function bloodstone_effect(points, mult, hand, gameState, handInfo) {
    let multMultiplier = 1;
    hand.forEach(card => {
        if (card.suit === '♥' && Math.random() < 0.5) {
            multMultiplier *= 1.5;
        }
    });
    return { points: points, mult: mult * multMultiplier, message: `x${multMultiplier.toFixed(2)} mult!` };
}

const bloodstone = {
    name: "Bloodstone",
    image_url: "assets/jokers/joker.png",
    rarity: "Uncommon",
    effect: bloodstone_effect
};


