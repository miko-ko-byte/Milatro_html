
function gambling_effect(points, mult, hand, gameState, handInfo) {
    let newMult = mult;
    newMult += Math.floor(Math.random() * 101);
    return { points: points, mult: newMult };
}
