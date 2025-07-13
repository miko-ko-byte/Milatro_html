
function campfire_effect(points, mult, hand, gameState, handInfo) {
    // This is a stateful joker that needs to track sold cards.
    // This needs to be implemented at a higher level.
    return { points: points, mult: mult, message: "" };
}

const campfire = {
    name: "Campfire",
    image_url: "assets/jokers/joker.png",
    rarity: "Rare",
    effect: campfire_effect
};

