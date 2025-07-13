
function the_family_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Four of a Kind") {
        return { points: points, mult: mult * 4, message: `x4 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}

const the_family = {
    name: "The Family",
    image_url: "assets/jokers/joker.png",
    rarity: "Rare",
    effect: the_family_effect
};

