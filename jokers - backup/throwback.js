
function throwback_effect(points, mult, hand, gameState, handInfo) {
    // This is a stateful joker that needs to track skipped blinds.
    // This needs to be implemented at a higher level.
    return { points: points, mult: mult, message: "" };
}

const throwback = {
    name: "Throwback",
    image_url: "assets/jokers/joker.png",
    rarity: "Uncommon",
    effect: throwback_effect
};

