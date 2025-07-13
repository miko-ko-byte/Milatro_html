
function half_joker_effect(points, mult, hand, gameState, handInfo) {
    if (hand.length <= 3) {
        return { points: points, mult: mult + 20, message: `+20 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}

const half_joker = {
    name: "Half Joker",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: half_joker_effect
};


