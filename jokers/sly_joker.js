
function sly_joker_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Pair") {
        return { points: points + 50, mult: mult, message: `+50 chips!` };
    }
    return { points: points, mult: mult, message: "" };
}



