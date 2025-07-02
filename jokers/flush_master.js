
function flush_master_effect(points, mult, hand, gameState, handInfo) {
    let newMult = mult;
    if (handInfo.name === 'Flush') {
        newMult *= 2;
    }
    return { points: points, mult: newMult };
}
