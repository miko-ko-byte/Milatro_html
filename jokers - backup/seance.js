
function seance_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Straight Flush") {
        // Creating a spectral card is not possible with the current effect system.
        // Returning a message for now.
        return { points: points, mult: mult, message: `Create a Spectral card!` };
    }
    return { points: points, mult: mult, message: "" };
}

const seance = {
    name: "Séance",
    image_url: "assets/jokers/joker.png",
    rarity: "Uncommon",
    effect: seance_effect
};

