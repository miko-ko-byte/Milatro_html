
function stuntman_effect(points, mult, hand, gameState, handInfo) {
    return { points: points + 250, mult: mult, message: `+250 chips!` };
}

const stuntman = {
    name: "Stuntman",
    image_url: "assets/jokers/joker.png",
    rarity: "Rare",
    effect: stuntman_effect
};


