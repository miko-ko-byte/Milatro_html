
function the_order_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Straight") {
        return { points: points, mult: mult * 3, message: `x3 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}

const the_order = {
    name: "The Order",
    image_url: "assets/jokers/joker.png",
    rarity: "Rare",
    effect: the_order_effect
};

