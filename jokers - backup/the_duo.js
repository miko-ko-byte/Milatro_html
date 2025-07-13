
function the_duo_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Pair") {
        return { points: points, mult: mult * 2, message: `x2 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}

const the_duo = {
    name: "The Duo",
    image_url: "assets/jokers/joker.png",
    rarity: "Rare",
    effect: the_duo_effect
};

