
function runner_effect(points, mult, hand, gameState, handInfo) {
    // This is a stateful joker that needs to track if a straight has been played.
    // This needs to be implemented at a higher level.
    return { points: points, mult: mult, message: "" };
}

const runner = {
    name: "Runner",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: runner_effect
};

