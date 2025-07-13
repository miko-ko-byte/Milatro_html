
function fibonacci_effect(points, mult, hand, gameState, handInfo) {
    let multAdded = 0;
    hand.forEach(card => {
        if (['A', '2', '3', '5', '8'].includes(card.rank)) {
            multAdded += 8;
        }
    });
    return { points: points, mult: mult + multAdded, message: `+${multAdded} mult!` };
}




