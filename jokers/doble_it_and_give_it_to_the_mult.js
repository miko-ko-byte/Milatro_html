function double_it_and_give_it_to_the_mult_effect(points, mult, hand, gameState, handInfo) {
    let newMult = mult;
    const faceCards = ['J', 'Q', 'K'];
    let firstFaceCardValue = 0;
    for (const card of hand) {
        if (faceCards.includes(card.rank)) {
            firstFaceCardValue = 10; // Assuming J, Q, K are all value 10
            break;
        }
    }
    if (firstFaceCardValue > 0) {
        newMult += (firstFaceCardValue * 2);
    }
    return { points: points, mult: newMult };
}