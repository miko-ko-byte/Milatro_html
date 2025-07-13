
function flash_card_effect(points, mult, hand, gameState, handInfo) {
    // This is a stateful joker that needs to track shop rerolls.
    // This needs to be implemented at a higher level.
    return { points: points, mult: mult, message: "" };
}

const flash_card = {
    name: "Flash Card",
    image_url: "assets/jokers/joker.png",
    rarity: "Uncommon",
    effect: flash_card_effect
};


