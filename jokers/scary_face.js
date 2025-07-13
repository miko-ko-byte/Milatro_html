
function scary_face_effect(points, mult, hand, gameState, handInfo) {
    let chipsAdded = 0;
    hand.forEach(card => {
        if (['J', 'Q', 'K'].includes(card.rank)) {
            chipsAdded += 30;
        }
    });
    return { points: points + chipsAdded, mult: mult, message: `+${chipsAdded} chips!` };
}




