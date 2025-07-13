
function smiley_face_effect(points, mult, hand, gameState, handInfo) {
    let multAdded = 0;
    hand.forEach(card => {
        if (['J', 'Q', 'K'].includes(card.rank)) {
            multAdded += 5;
        }
    });
    return { points: points, mult: mult + multAdded, message: `+${multAdded} mult!` };
}

const smiley_face = {
    name: "Smiley Face",
    image_url: "assets/jokers/happy_face.png",
    rarity: "Common",
    effect: smiley_face_effect
};

