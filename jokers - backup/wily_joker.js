
function wily_joker_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Three of a Kind") {
        return { points: points + 100, mult: mult, message: `+100 chips!` };
    }
    return { points: points, mult: mult, message: "" };
}

const wily_joker = {
    name: "Wily Joker",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: wily_joker_effect
};


