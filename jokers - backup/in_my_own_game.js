
function in_my_own_game_effect(points, mult, hand, gameState, handInfo) {
    let pointsAdded = 0;
    if (gameState.handsPlayed % 4 === 0) {
        pointsAdded = 100;
    }
    return { points: points + pointsAdded, mult: mult, message: `+${pointsAdded} points!` };
}
