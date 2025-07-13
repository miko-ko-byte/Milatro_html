
function obelisk_effect(points, mult, hand, gameState, handInfo) {
    // This is a stateful joker that needs to track consecutive hands without the most played poker hand.
    // This needs to be implemented at a higher level.
    return { points: points, mult: mult, message: "" };
}

const obelisk = {
    name: "Obelisk",
    image_url: "assets/jokers/joker.png",
    rarity: "Rare",
    effect: obelisk_effect
};


