
function glass_joker_effect(points, mult, hand, gameState, handInfo) {
    // This is a stateful joker that needs to track destroyed glass cards.
    // This needs to be implemented at a higher level.
    return { points: points, mult: mult, message: "" };
}

const glass_joker = {
    name: "Glass Joker",
    image_url: "assets/jokers/joker.png",
    rarity: "Uncommon",
    effect: glass_joker_effect
};


