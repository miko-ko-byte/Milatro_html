
function the_tribe_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Flush") {
        return { points: points, mult: mult * 2, message: `x2 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}



