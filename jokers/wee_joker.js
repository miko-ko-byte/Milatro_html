
function wee_joker_effect(points, mult, hand, gameState, handInfo) {
    let chipsAdded = 0;
    hand.forEach(card => {
        if (card.rank === '2') {
            chipsAdded += 8;
        }
    });
    return { points: points + chipsAdded, mult: mult, message: `+${chipsAdded} chips!` };
}



