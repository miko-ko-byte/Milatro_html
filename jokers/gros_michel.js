
function gros_michel_effect(points, mult, hand, gameState, handInfo) {
    // The 1 in 6 chance of being destroyed is a stateful effect that needs to be handled outside of this function.
    return { points: points, mult: mult + 15, message: `+15 mult!` };
}




