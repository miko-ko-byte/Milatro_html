
function droll_joker_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Flush") {
        return { points: points, mult: mult + 10, message: `+10 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}

const droll_joker = {
    name: "Droll Joker",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: droll_joker_effect
};


