
function clever_joker_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Two Pair") {
        return { points: points + 80, mult: mult, message: `+80 chips!` };
    }
    return { points: points, mult: mult, message: "" };
}

const clever_joker = {
    name: "Clever Joker",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: clever_joker_effect
};


