
function mad_joker_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Two Pair") {
        return { points: points, mult: mult + 10, message: `+10 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}




