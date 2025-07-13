
function crazy_joker_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Straight") {
        return { points: points, mult: mult + 12, message: `+12 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}

const crazy_joker = {
    name: "Crazy Joker",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: crazy_joker_effect
};


