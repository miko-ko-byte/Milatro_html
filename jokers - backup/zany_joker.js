
function zany_joker_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Three of a Kind") {
        return { points: points, mult: mult + 12, message: `+12 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}

const zany_joker = {
    name: "Zany Joker",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: zany_joker_effect
};


