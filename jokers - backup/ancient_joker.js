
function ancient_joker_effect(points, mult, hand, gameState, handInfo) {
    // This joker's suit changes each round, so it needs to be stateful.
    // This needs to be implemented at a higher level.
    return { points: points, mult: mult, message: "" };
}

const ancient_joker = {
    name: "Ancient Joker",
    image_url: "assets/jokers/joker.png",
    rarity: "Rare",
    effect: ancient_joker_effect
};


