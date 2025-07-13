
function card_sharp_effect(points, mult, hand, gameState, handInfo) {
    // Assuming gameState.pokerHandHistory is an object tracking how many times each hand has been played this round.
    if (gameState.pokerHandHistory[handInfo.poker_hand] > 1) {
        return { points: points, mult: mult * 3, message: `x3 mult!` };
    }
    return { points: points, mult: mult, message: "" };
}




