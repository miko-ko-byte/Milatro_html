
function castle_effect(points, mult, hand, gameState, handInfo) {
    // This is a stateful joker that needs to track discarded cards of a specific suit.
    // This needs to be implemented at a higher level.
    return { points: points, mult: mult, message: "" };
}

const castle = {
    name: "Castle",
    image_url: "assets/jokers/joker.png",
    rarity: "Uncommon",
    effect: castle_effect
};


