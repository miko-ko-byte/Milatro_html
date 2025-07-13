
function hit_the_road_effect(points, mult, hand, gameState, handInfo) {
    // This joker's effect triggers on discard, not on hand scoring.
    // This needs to be implemented at a higher level.
    return { points: points, mult: mult, message: "" };
}

const hit_the_road = {
    name: "Hit the Road",
    image_url: "assets/jokers/joker.png",
    rarity: "Rare",
    effect: hit_the_road_effect
};


