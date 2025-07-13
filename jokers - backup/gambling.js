window.gambling_effect = function(points, mult, hand, gameState, handInfo) {
    console.log("[gambling.js] Applying gambling effect");
    const multAdded = Math.floor(Math.random() * 101);
    return {
        points: points,
        mult: mult + multAdded,
        message: `+${multAdded} mult!`
    };
};