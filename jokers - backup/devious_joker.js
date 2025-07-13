
function devious_joker_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Straight") {
        return { points: points + 100, mult: mult, message: `+100 chips!` };
    }
    return { points: points, mult: mult, message: "" };
}

const devious_joker = {
    name: "Devious Joker",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: devious_joker_effect
};

