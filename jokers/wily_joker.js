
function wily_joker_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Three of a Kind") {
        return { points: points + 100, mult: mult, message: `+100 chips!` };
    }
    return { points: points, mult: mult, message: "" };
}




