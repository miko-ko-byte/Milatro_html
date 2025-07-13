
function the_idol_effect(points, mult, hand, gameState, handInfo) {
    // This joker's rank and suit change each round, so it needs to be stateful.
    // This needs to be implemented at a higher level.
    return { points: points, mult: mult, message: "" };
}

const the_idol = {
    name: "The Idol",
    image_url: "assets/jokers/joker.png",
    rarity: "Uncommon",
    effect: the_idol_effect
};

