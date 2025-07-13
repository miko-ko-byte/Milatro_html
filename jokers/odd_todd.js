
function odd_todd_effect(points, mult, hand, gameState, handInfo) {
    let chipsAdded = 0;
    hand.forEach(card => {
        const rank = card.rank;
        if (['A', '9', '7', '5', '3'].includes(rank)) {
            chipsAdded += 31;
        }
    });
    return { points: points + chipsAdded, mult: mult, message: `+${chipsAdded} chips!` };
}



