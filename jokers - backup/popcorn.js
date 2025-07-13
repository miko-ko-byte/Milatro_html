
function popcorn_effect(points, mult, hand, gameState, handInfo) {
    // This is a stateful joker that loses mult each round.
    // This needs to be implemented at a higher level.
    return { points: points, mult: mult + 20, message: `+20 mult!` };
}

const popcorn = {
    name: "Popcorn",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: popcorn_effect
};
