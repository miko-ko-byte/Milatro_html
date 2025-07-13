
function crazy_joker_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Straight") {
        return { points: points, mult: mult + 12, message: `+12 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}




