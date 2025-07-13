
function cavendish_effect(points, mult, hand, gameState, handInfo) {
    // The 1 in 1000 chance of being destroyed is a stateful effect that needs to be handled outside of this function.
    return { points: points, mult: mult * 3, message: `x3 mult!` };
}



