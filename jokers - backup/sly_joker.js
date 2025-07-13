
function sly_joker_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Pair") {
        return { points: points + 50, mult: mult, message: `+50 chips!` };
    }
    return { points: points, mult: mult, message: "" };
}

const sly_joker = {
    name: "Sly Joker",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: sly_joker_effect
};

