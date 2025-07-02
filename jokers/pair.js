
function phantom_pair_effect(points, mult, hand, gameState, handInfo) {
    let newMult = mult;
    if (handInfo.name === 'Pair') {
        newMult += 2;
    }
    return { points: points, mult: newMult };
}
