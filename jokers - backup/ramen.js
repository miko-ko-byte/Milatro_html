
function ramen_effect(points, mult, hand, gameState, handInfo) {
    // This is a stateful joker that loses mult per card discarded.
    // This needs to be implemented at a higher level.
    return { points: points, mult: mult * 2, message: `x2 mult!` };
}

const ramen = {
    name: "Ramen",
    image_url: "assets/jokers/joker.png",
    rarity: "Uncommon",
    effect: ramen_effect
};


