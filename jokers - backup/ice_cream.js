
function ice_cream_effect(points, mult, hand, gameState, handInfo) {
    // This is a stateful joker that loses chips each hand.
    // This needs to be implemented at a higher level.
    return { points: points + 100, mult: mult, message: `+100 chips!` };
}

const ice_cream = {
    name: "Ice Cream",
    image_url: "assets/jokers/ice_cream.png",
    rarity: "Common",
    effect: ice_cream_effect
};


