
function flush_master_effect(points, mult, hand, gameState, handInfo) {
    let multAdded = 0;
    if (handInfo.name === 'Flush') {
        multAdded = mult;
    }
    return { points: points, mult: mult + multAdded, message: `x2 mult!` };
}
