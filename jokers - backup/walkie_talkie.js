
function walkie_talkie_effect(points, mult, hand, gameState, handInfo) {
    let chipsAdded = 0;
    let multAdded = 0;
    hand.forEach(card => {
        if (['10', '4'].includes(card.rank)) {
            chipsAdded += 10;
            multAdded += 4;
        }
    });
    return { points: points + chipsAdded, mult: mult + multAdded, message: `+${chipsAdded} chips! +${multAdded} mult!` };
}

const walkie_talkie = {
    name: "Walkie Talkie",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: walkie_talkie_effect
};


