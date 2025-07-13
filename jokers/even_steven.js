
function even_steven_effect(points, mult, hand, gameState, handInfo) {
    let multAdded = 0;
    hand.forEach(card => {
        const rank = parseInt(card.rank);
        if (!isNaN(rank) && rank % 2 === 0) {
            multAdded += 4;
        }
    });
    return { points: points, mult: mult + multAdded, message: `+${multAdded} mult!` };
}




