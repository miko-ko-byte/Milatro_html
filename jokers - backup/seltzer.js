
function seltzer_effect(points, mult, hand, gameState, handInfo) {
    // This joker's effect lasts for 10 hands, so it needs to be stateful.
    // This needs to be implemented at a higher level.
    return { points: points, mult: mult, message: "" };
}

const seltzer = {
    name: "Seltzer",
    image_url: "assets/jokers/joker.png",
    rarity: "Uncommon",
    effect: seltzer_effect
};


