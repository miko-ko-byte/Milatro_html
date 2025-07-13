
function hologram_effect(points, mult, hand, gameState, handInfo) {
    // This is a stateful joker that needs to track added cards.
    // This needs to be implemented at a higher level.
    return { points: points, mult: mult, message: "" };
}

const hologram = {
    name: "Hologram",
    image_url: "assets/jokers/joker.png",
    rarity: "Uncommon",
    effect: hologram_effect
};


