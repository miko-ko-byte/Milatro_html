
function in_my_own_game_effect(points, mult, hand, gameState, handInfo) {
    let newPoints = points;
    if (gameState.handsPlayed % 4 === 0) {
        newPoints += 100;
    }
    return { points: newPoints, mult: mult };
}
