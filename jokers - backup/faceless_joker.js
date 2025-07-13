
function faceless_joker_effect(points, mult, hand, gameState, handInfo) {
    // This joker's effect triggers on discard, not on hand scoring.
    // This needs to be implemented at a higher level.
    return { points: points, mult: mult, message: "" };
}

const faceless_joker = {
    name: "Faceless Joker",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: faceless_joker_effect
};

