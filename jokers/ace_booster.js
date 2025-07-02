
function ace_booster_effect(points, mult, hand, gameState, handInfo) {
    let pointsAdded = 0;
    hand.forEach(card => {
        if (card.rank === 'A') {
            pointsAdded += 10;
        }
    });
    return { points: points + pointsAdded, mult: mult, message: `+${pointsAdded} points!` };
}
