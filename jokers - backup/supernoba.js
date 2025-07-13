
function supernoba_effect(points, mult, hand, gameState, handInfo) {
    let multAdded = 0;
    if (gameState.handPlayCount && gameState.handPlayCount[handInfo.name]) {
        multAdded = (mult * gameState.handPlayCount[handInfo.name]);
    }
    return { points: points, mult: mult + multAdded, message: `+${multAdded} mult!` };
}
