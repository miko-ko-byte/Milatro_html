
function clever_joker_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Two Pair") {
        return { points: points + 80, mult: mult, message: `+80 chips!` };
    }
    return { points: points, mult: mult, message: "" };
}




