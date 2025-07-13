
function vampire_effect(points, mult, hand, gameState, handInfo) {
    // This is a stateful joker that needs to track enhanced cards played.
    // This needs to be implemented at a higher level.
    return { points: points, mult: mult, message: "" };
}

const vampire = {
    name: "Vampire",
    image_url: "assets/jokers/joker.png",
    rarity: "Uncommon",
    effect: vampire_effect
};


