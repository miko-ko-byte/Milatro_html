
function crafty_joker_effect(points, mult, hand, gameState, handInfo) {
    if (handInfo.poker_hand === "Flush") {
        return { points: points + 80, mult: mult, message: `+80 chips!` };
    }
    return { points: points, mult: mult, message: "" };
}




