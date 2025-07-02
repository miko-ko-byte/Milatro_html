
function phantom_trio_effect(points, mult, hand, gameState, handInfo) {
    let newMult = mult;
    if (handInfo.name === 'Two Pair') {
        newMult *= 2;
    }
    return { points: points, mult: newMult };
}
