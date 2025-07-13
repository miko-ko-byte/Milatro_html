
function hiker_effect(points, mult, hand, gameState, handInfo) {
    // This joker permanently enhances cards, which is a form of state
    // that needs to be handled outside the scope of this function.
    let chipsAdded = hand.length * 5;
    return { points: points + chipsAdded, mult: mult, message: `+${chipsAdded} chips!` };
}



