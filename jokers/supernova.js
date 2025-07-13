
function supernova_effect(points, mult, hand, gameState, handInfo) {
    // Assuming gameState.pokerHandHistory is an object tracking how many times each hand has been played.
    const handCount = gameState.pokerHandHistory[handInfo.poker_hand] || 0;
    return { points: points, mult: mult + handCount, message: `+${handCount} mult!` };
}



