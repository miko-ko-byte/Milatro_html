
function square_joker_effect(points, mult, hand, gameState, handInfo) {
    if (hand.length === 4) {
        return { points: points + 4, mult: mult, message: `+4 chips!` };
    }
    return { points: points, mult: mult, message: "" };
}



