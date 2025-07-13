
function green_joker_effect(points, mult, hand, gameState, handInfo) {
    // This is a stateful joker that needs to track hands played and discards.
    // This needs to be implemented at a higher level.
    return { points: points, mult: mult, message: "" };
}

const green_joker = {
    name: "Green Joker",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: green_joker_effect
};


