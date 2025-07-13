
function bull_effect(points, mult, hand, gameState, handInfo) {
    // Assuming gameState.money is a number
    const chipsAdded = Math.floor(gameState.money / 1) * 2;
    return { points: points + chipsAdded, mult: mult, message: `+${chipsAdded} chips!` };
}




