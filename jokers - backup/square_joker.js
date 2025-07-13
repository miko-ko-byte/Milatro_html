
function square_joker_effect(points, mult, hand, gameState, handInfo) {
    if (hand.length === 4) {
        return { points: points + 4, mult: mult, message: `+4 chips!` };
    }
    return { points: points, mult: mult, message: "" };
}

const square_joker = {
    name: "Square Joker",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: square_joker_effect
};

