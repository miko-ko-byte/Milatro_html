
function abstract_joker_effect(points, mult, hand, gameState, handInfo) {
    // Assuming gameState.jokers is an array of joker objects
    const multAdded = gameState.jokers.length * 3;
    return { points: points, mult: mult + multAdded, message: `+${multAdded} mult!` };
}




