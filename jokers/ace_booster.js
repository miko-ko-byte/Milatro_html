
function ace_booster_effect(points, mult, hand, gameState, handInfo) {
    let newPoints = points;
    hand.forEach(card => {
        if (card.rank === 'A') {
            newPoints += 10;
        }
    });
    return { points: newPoints, mult: mult };
}
