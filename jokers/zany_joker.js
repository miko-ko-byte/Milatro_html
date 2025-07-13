
function zany_joker_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Three of a Kind") {
        return { points: points, mult: mult + 12, message: `+12 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}




