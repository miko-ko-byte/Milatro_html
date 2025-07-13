
function the_trio_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Three of a Kind") {
        return { points: points, mult: mult * 3, message: `x3 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}



