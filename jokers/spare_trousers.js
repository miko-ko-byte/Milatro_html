
function spare_trousers_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Two Pair") {
        return { points: points, mult: mult + 2, message: `+2 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}



