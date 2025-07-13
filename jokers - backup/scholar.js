
function scholar_effect(points, mult, hand, gameState, handInfo) {
    let chipsAdded = 0;
    let multAdded = 0;
    hand.forEach(card => {
        if (card.rank === 'A') {
            chipsAdded += 20;
            multAdded += 4;
        }
    });
    return { points: points + chipsAdded, mult: mult + multAdded, message: `+${chipsAdded} chips! +${multAdded} mult!` };
}

const scholar = {
    name: "Scholar",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: scholar_effect
};


