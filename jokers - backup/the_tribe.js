
function the_tribe_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Flush") {
        return { points: points, mult: mult * 2, message: `x2 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}

const the_tribe = {
    name: "The Tribe",
    image_url: "assets/jokers/joker.png",
    rarity: "Rare",
    effect: the_tribe_effect
};

