
function jolly_joker_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Pair") {
        return { points: points, mult: mult + 8, message: `+8 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}

const jolly_joker = {
    name: "Jolly Joker",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: jolly_joker_effect
};


