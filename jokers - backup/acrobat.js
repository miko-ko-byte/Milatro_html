
function acrobat_effect(points, mult, hand, gameState, handInfo) {
    // This joker's effect only triggers on the final hand of the round.
    // This needs to be implemented at a higher level.
    return { points: points, mult: mult, message: "" };
}

const acrobat = {
    name: "Acrobat",
    image_url: "assets/jokers/joker.png",
    rarity: "Uncommon",
    effect: acrobat_effect
};

