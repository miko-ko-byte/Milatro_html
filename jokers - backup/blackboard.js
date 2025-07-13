
function blackboard_effect(points, mult, hand, gameState, handInfo) {
    const allBlack = hand.every(card => ['♠', '♣'].includes(card.suit));
    if (allBlack) {
        return { points: points, mult: mult * 3, message: `x3 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}

const blackboard = {
    name: "Blackboard",
    image_url: "assets/jokers/joker.png",
    rarity: "Uncommon",
    effect: blackboard_effect
};


