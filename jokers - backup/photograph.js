
function photograph_effect(points, mult, hand, gameState, handInfo) {
    // This joker's effect should only trigger on the first played face card.
    // This needs to be implemented at a higher level.
    const faceCards = hand.filter(card => ['J', 'Q', 'K'].includes(card.rank));
    if (faceCards.length > 0) {
        return { points: points, mult: mult * 2, message: `x2 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}

const photograph = {
    name: "Photograph",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: photograph_effect
};

