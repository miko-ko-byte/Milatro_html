
function phantom_trio(points, mult, hand, gameState, handInfo) {
    let multAdded = 0;
    if (handInfo.name === 'Two Pair') {
        multAdded = mult; // Double the current mult
    }
    return { points: points, mult: mult + multAdded, message: `x2 mult!` };
}
