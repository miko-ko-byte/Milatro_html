
function supernoba_effect(points, mult, hand, gameState, handInfo) {
    let newMult = mult;
    if (gameState.handPlayCount && gameState.handPlayCount[handInfo.name]) {
        newMult += (mult * gameState.handPlayCount[handInfo.name]);
    }
    return { points: points, mult: newMult };
}
