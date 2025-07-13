
function the_family_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Four of a Kind") {
        return { points: points, mult: mult * 4, message: `x4 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}



