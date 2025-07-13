
function ride_the_bus_effect(points, mult, hand, gameState, handInfo) {
    // This is a stateful joker that needs to track consecutive hands without face cards.
    // This needs to be implemented at a higher level.
    return { points: points, mult: mult, message: "" };
}

const ride_the_bus = {
    name: "Ride the Bus",
    image_url: "assets/jokers/joker.png",
    rarity: "Common",
    effect: ride_the_bus_effect
};


