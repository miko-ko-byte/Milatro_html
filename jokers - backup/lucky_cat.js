
function lucky_cat_effect(points, mult, hand, gameState, handInfo) {
    // This is a stateful joker that needs to track lucky card triggers.
    // This needs to be implemented at a higher level.
    return { points: points, mult: mult, message: "" };
}

const lucky_cat = {
    name: "Lucky Cat",
    image_url: "assets/jokers/joker.png",
    rarity: "Uncommon",
    effect: lucky_cat_effect
};


