window.double_it_and_give_it_to_the_mult_effect = function(points, mult, hand, gameState, handInfo) {
    console.log("[doble_it_and_give_it_to_the_mult.js] Applying Cara feliz effect");
    
    let multAdded = 0;
    const faceCards = ['J', 'Q', 'K'];
    let firstFaceCardValue = 0;
    
    if (!Array.isArray(hand)) {
        console.error("[doble_it_and_give_it_to_the_mult.js] Hand is not an array:", hand);
        return { points, mult, message: "No valid hand provided" };
    }
    
    for (const card of hand) {
        if (faceCards.includes(card.rank)) {
            firstFaceCardValue = rankValues[card.rank];
            break;
        }
    }
    
    if (firstFaceCardValue > 0) {
        multAdded = firstFaceCardValue * 2;
    }
    
    return {
        points: points,
        mult: mult + multAdded,
        message: multAdded > 0 ? `+${multAdded} mult!` : "No face cards played"
    };
};