
function phantom_pair_effect(points, mult, hand, gameState, handInfo) {
    let multAdded = 0;
    if (handInfo.name === 'Pair') {
        multAdded = 2;
    }
    return { points: points, mult: mult + multAdded, message: `+${multAdded} mult!` };
}
