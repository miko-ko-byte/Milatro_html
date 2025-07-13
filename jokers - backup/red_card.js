
function red_card_effect(points, mult, hand, gameState, handInfo) {
    // This is a stateful joker that needs to track skipped booster packs.
    // This needs to be implemented at a higher level.
    return { points: points, mult: mult, message: "" };
}

const red_card = {
    name: "Red Card",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: red_card_effect
};


