
function arrowhead_effect(points, mult, hand, gameState, handInfo) {
    let chipsAdded = 0;
    hand.forEach(card => {
        if (card.suit === '♠') {
            chipsAdded += 50;
        }
    });
    return { points: points + chipsAdded, mult: mult, message: `+${chipsAdded} chips!` };
}

const arrowhead = {
    name: "Arrowhead",
    image_url: "assets/jokers/joker.png",
    rarity: "Uncommon",
    effect: arrowhead_effect
};

