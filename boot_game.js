console.log("[boot_game.js] boot_game.js loaded");

const rankValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

function initGame() {
    setBg("default")
    console.log("[boot_game.js] Initializing game...");
    gameState.hand = []; // Clear hand to prevent accumulation
    createDeck();
    shuffleDeck();
    dealHand(true);
    updateUI();
}

function showNotification(message, duration) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.background = 'rgba(0,0,0,0.8)';
    notification.style.color = 'white';
    notification.style.padding = '20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, duration);
}

function createDeck() {
    gameState.deck = [];
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    for (let suit of suits) {
        for (let rank of ranks) {
            gameState.deck.push({ suit, rank });
        }
    }
    console.log("[boot_game.js] Deck created:", gameState.deck.length, "cards");
}

function shuffleDeck() {
    for (let i =  gameState.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
    }
    console.log("[boot_game.js] Deck shuffled");
}

function dealHand(initial = false) {
    if (initial) {
        gameState.hand = []; // Clear hand on initial deal
    }
    const cardsNeeded = 8 - gameState.hand.length;
    const newCards = gameState.deck.splice(0, Math.min(cardsNeeded, gameState.deck.length));
    console.log("[boot_game.js] Dealing", newCards.length, "cards. Current hand size:", gameState.hand.length);
    if (gameState.animationSpeed === 0 || initial) {
        gameState.hand.push(...newCards);
        renderHand();
        updateSelection();
        updateUI();
        if (gameState.organize === "pairs") {
            sortByPairs();
        } else {
            sortBySuiteType();
        }
        console.log("[boot_game.js] Dealt", newCards.length, "cards. New hand size:", gameState.hand.length);
    } else {
        animateDeal(newCards);
    }
}

function createCardElement(card, index) {
    const cardEl = document.createElement('div');
    // Se usa el símbolo del palo directamente en la clase para que coincida con el CSS
    cardEl.className = `card ${card.suit}`; 
    cardEl.dataset.index = index;
    cardEl.innerHTML = `
        <span class="card-rank">${card.rank}</span>
        <span class="card-suit">${card.suit}</span>
        <span class="card-rank-bottom">${card.rank}</span>
    `;
    cardEl.addEventListener('click', () => {
        console.log("[boot_game.js] Card clicked at index:", index);
        toggleCardSelection(index);
    });
    return cardEl;
}

function renderHand() {
    const handElement = document.getElementById('hand');
    if (!handElement) {
        console.error("[boot_game.js] Error: #hand element not found in DOM");
        return;
    }
    handElement.innerHTML = '';
    gameState.hand.forEach((card, index) => {
        const cardEl = createCardElement(card, index);
        if (gameState.selectedCards.includes(index)) {
            cardEl.classList.add('selected');
        }
        handElement.appendChild(cardEl);
        console.log(`[boot_game.js] Added card to DOM: ${card.rank}${card.suit} at index ${index}`);
    });
    console.log("[boot_game.js] Hand rendered:", gameState.hand);
    console.log("[boot_game.js] DOM check: #hand children count:", handElement.children.length);
}

function toggleCardSelection(index) {
    console.log("[boot_game.js] Toggling card selection at index:", index);
    if (gameState.selectedCards.includes(index)) {
        gameState.selectedCards = gameState.selectedCards.filter(i => i !== index);
    } else if (gameState.selectedCards.length < 5) {
        gameState.selectedCards.push(index);
    }
    renderHand();
    updateSelection();
}
function updateSelection() {
    const selectedHandCards = gameState.selectedCards
        .map(i => gameState.hand[i])
        .filter(card => card !== undefined);
    const handResult = analyzePokerHand(selectedHandCards);
    document.getElementById('hand-name').textContent = handResult.name || 'Selecciona cartas';
    document.getElementById('hand-score').textContent = `Puntos: ${handResult.points || 0} | Mult: ${handResult.mult || 0}`;
    document.getElementById('hand-score-points').textContent = handResult.points || 0;
    document.getElementById('hand-score-mult').textContent = handResult.mult || 0;

    // Enable/disable Play Hand and Discard buttons
    const playButton = document.getElementById('play-btn');
    if (playButton) {
        playButton.disabled = gameState.selectedCards.length === 0;
    }
    const discardButton = document.getElementById('discard-btn');
    if (discardButton) {
        discardButton.disabled = gameState.discardsLeft <= 0 || gameState.selectedCards.length === 0;
    }
}

async function animateJokerEffect(jokerElement, value, type) {
    const jokerRect = jokerElement.getBoundingClientRect();
    const effectEl = document.createElement('div');
    effectEl.textContent = type === 'mult' ? `x${value}` : `+${value}`;
    
    let colorClass = '';
    if (type === 'mult') {
        colorClass = 'joker-mult-animation';
    } else if (type === 'points') {
        colorClass = 'joker-points-animation';
    }

    effectEl.className = `joker-effect-animation ${colorClass}`;
    effectEl.style.left = `${jokerRect.left + jokerRect.width / 2}px`;
    effectEl.style.top = `${jokerRect.top}px`;
    document.body.appendChild(effectEl);

    requestAnimationFrame(() => {
        effectEl.style.opacity = '1';
        effectEl.style.transform = 'translateY(-20px)';
    });

    await sleep(1000 * gameState.animationSpeed);
    effectEl.remove();
}

async function animateCardMessage(cardElement, message) {
    const cardRect = cardElement.getBoundingClientRect();

    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    messageEl.className = 'card-message-animation joker-message-animation';
    messageEl.style.left = `${cardRect.left + cardRect.width / 2}px`;
    messageEl.style.top = `${cardRect.top}px`;
    document.body.appendChild(messageEl);

    requestAnimationFrame(() => {
        messageEl.style.opacity = '1';
        messageEl.style.transform = 'translateY(-20px)';
    });

    await sleep(1000 * gameState.animationSpeed);
    messageEl.remove();
}

async function animateScoreUpdate(startScore, endScore) {
    const scoreElement = document.getElementById('score');
    const duration = 1000 * gameState.animationSpeed;
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    const scoreIncrement = (endScore - startScore) / totalFrames;

    for (let i = 0; i < totalFrames; i++) {
        startScore += scoreIncrement;
        scoreElement.textContent = Math.round(startScore);
        await sleep(frameDuration);
    }

    scoreElement.textContent = endScore;
}

async function playHand() {
    console.log("[boot_game.js] playHand function called. Selected cards:", gameState.selectedCards, "Hand:", gameState.hand);
    if (gameState.selectedCards.length === 0) {
        console.log("[boot_game.js] playHand aborted: No cards selected.");
        return;
    }
    console.log("[boot_game.js] --- Starting playHand sequence ---");
    document.getElementById('play-btn').disabled = true;
    document.getElementById('discard-btn').disabled = true;

    gameState.handsLeft--;
    console.log(`[boot_game.js] Hands left after play: ${gameState.handsLeft}`);
    updateUI();
    await sleep(200 * gameState.animationSpeed);

    const selectedHandCards = gameState.selectedCards
        .map(i => gameState.hand[i])
        .filter(card => card !== undefined);
    
    if (!Array.isArray(selectedHandCards)) {
        console.error("[boot_game.js] selectedHandCards is not an array:", selectedHandCards);
        return;
    }

    console.log("[boot_game.js] Selected hand cards for play:", selectedHandCards);

    let handResult = analyzePokerHand(selectedHandCards);
    let currentPoints = 0;
    let currentMult = handResult.mult;

    console.log(`[boot_game.js] Hand analysis: ${handResult.name}, Points: ${handResult.points}, Multiplier: ${handResult.mult}`);

    if (gameState.animationSpeed > 0) {
        const handElement = document.getElementById('hand');
        const allCardElements = Array.from(handElement.querySelectorAll('.card'));
        const selectedIndexes = new Set(gameState.selectedCards);
        const selectedElements = allCardElements.filter(el => selectedIndexes.has(parseInt(el.dataset.index)));
        
        for (let i = 0; i < selectedElements.length; i++) {
            const cardEl = selectedElements[i];
            const cardValue = rankValues[selectedHandCards[i].rank];
            console.log(`[boot_game.js] Animating card at index ${gameState.selectedCards[i]} (${selectedHandCards[i].rank}${selectedHandCards[i].suit}), Value: ${cardValue}`);
            await animateCardScores([cardEl], [selectedHandCards[i]], gameState.animationSpeed);
            currentPoints += cardValue;
            document.getElementById('hand-score-points').textContent = currentPoints;
            console.log(`[boot_game.js] Accumulated points after card ${i}: ${currentPoints}`);
        }
    } else {
        currentPoints = handResult.points;
        console.log(`[boot_game.js] Animation skipped. Using handResult.points: ${currentPoints}`);
    }
    console.log(`[boot_game.js] Card animations finished. Total points before jokers: ${currentPoints}`);

    await sleep(200 * gameState.animationSpeed);

    console.log("[boot_game.js] Starting joker effects. Jokers owned:", gameState.jokersOwned.map(j => j && j.name));
    for (const joker of gameState.jokersOwned) {
        if (joker && joker.effect) {
            console.log(`[boot_game.js] Triggering joker effect for: ${joker.name}`);
            const jokerElement = document.querySelector(`.joker-card[data-index="${gameState.jokersOwned.indexOf(joker)}"]`);
            let effectResult = joker.effect(currentPoints, currentMult, selectedHandCards, gameState, handResult);

            if (effectResult && effectResult.points !== undefined && effectResult.mult !== undefined) {
                const pointsAdded = effectResult.points - currentPoints;
                const multAdded = effectResult.mult - currentMult;

                if (pointsAdded > 0) {
                    console.log(`[boot_game.js] Joker '${joker.name}' added pointspollution: +${pointsAdded}`);
                    await animateJokerEffect(jokerElement, pointsAdded, 'points');
                }
                if (multAdded > 0) {
                    console.log(`[boot_game.js] Joker '${joker.name}' added multiplier: x${multAdded}`);
                    await animateJokerEffect(jokerElement, multAdded, 'mult');
                }

                currentPoints = effectResult.points;
                currentMult = effectResult.mult;

                if (effectResult.message) {
                    console.log(`[boot_game.js] Joker '${joker.name}' message: ${effectResult.message}`);
                    await animateCardMessage(jokerElement, effectResult.message);
                }

                // Apply sub-effect if it exists
                if (joker.subEffect && joker.subEffect.effect) {
                    console.log(`[boot_game.js] Applying sub-effect for ${joker.name}: ${joker.subEffect.name}`);
                    const subEffectResult = joker.subEffect.effect(currentPoints, currentMult, gameState);
                    if (subEffectResult === null) {
                        console.log(`[boot_game.js] Sub-effect '${joker.subEffect.name}' broke for ${joker.name}`);
                        gameState.jokersOwned.splice(gameState.jokersOwned.indexOf(joker), 1); // Remove broken joker
                        await animateCardMessage(jokerElement, `${joker.subEffect.name} se rompió!`);
                        updateUI(); // Update UI after joker removal
                    } else {
                        const pointsAdded = subEffectResult.points - currentPoints;
                        const multAdded = subEffectResult.mult - currentMult;
                        if (pointsAdded > 0) {
                            console.log(`[boot_game.js] Sub-effect '${joker.subEffect.name}' added points: +${pointsAdded}`);
                            await animateJokerEffect(jokerElement, pointsAdded, 'points');
                        }
                        if (multAdded > 0) {
                            console.log(`[boot_game.js] Sub-effect '${joker.subEffect.name}' added multiplier: x${multAdded}`);
                            await animateJokerEffect(jokerElement, multAdded, 'mult');
                        }
                        currentPoints = subEffectResult.points;
                        currentMult = subEffectResult.mult;
                    }
                }
                await sleep(200 * gameState.animationSpeed);
            } else {
                console.log(`[boot_game.js] Joker '${joker.name}' had no effect or invalid effect result.`);
            }
        } else {
            if (joker) {
                console.log(`[boot_game.js] Joker '${joker.name}' has no effect function.`);
            }
        }
    }
    console.log(`[boot_game.js] Joker effects finished. Final points: ${currentPoints}, Final multiplier: ${currentMult}`);

    const totalScore = currentPoints * currentMult;
    const currentTotalScore = gameState.score;
    console.log(`[boot_game.js] Calculating total score: ${currentPoints} * ${currentMult} = ${totalScore}. Previous score: ${currentTotalScore}`);
    await animateScoreUpdate(currentTotalScore, currentTotalScore + totalScore);
    gameState.score += totalScore;

    updateUI();
    console.log(`[boot_game.js] Updated gameState.score: ${gameState.score}`);

    // Remove played cards
    gameState.selectedCards.sort((a, b) => b - a);
    console.log("[boot_game.js] Removing played cards at indexes:", gameState.selectedCards);
    gameState.selectedCards.forEach(index => {
        const removed = gameState.hand.splice(index, 1);
        console.log(`[boot_game.js] Removed card at index ${index}:`, removed);
    });
    gameState.selectedCards = [];

    renderHand();
    dealHand(false);

    if (gameState.score >= gameState.targetScore) {
        console.log("[boot_game.js] Target score reached or exceeded. Showing notification and next round menu.");
        showNotification("¡Ciega superada!", 1500 * gameState.animationSpeed);
        await sleep(1500 * gameState.animationSpeed);
        nextRoundMenu();
    } else if (gameState.handsLeft <= 0) {
        console.log("[boot_game.js] No hands left. Game over.");
        gameOver(false);
    } else {
        console.log("[boot_game.js] Hand played. Updating UI for next turn.");
        updateUI();
    }
}

async function animateDeal(newCards) {
    if (gameState.animationSpeed === 0) {
        gameState.hand.push(...newCards);
        renderHand();
        if (gameState.score >= gameState.targetScore) {
            showNotification("¡Ciega superada!", 1500 * gameState.animationSpeed);
            //nextRoundMenu();
        } else if (gameState.handsLeft <= 0) {
            gameOver(false);
        } else {
            updateSelection();
            updateUI();
        }
        if (gameState.organize === "pairs") {
            sortByPairs();
        } else {
            sortBySuiteType();
        }
        console.log("[boot_game.js] animateDeal: Instant mode completed");
        return;
    }

    const handElement = document.getElementById('hand');
    const deckElement = document.getElementById('deck-container');
    const deckRect = deckElement.getBoundingClientRect();

    const tempHand = [...gameState.hand, ...newCards];
    handElement.innerHTML = '';
    tempHand.forEach((card, index) => {
        const cardEl = createCardElement(card, index);
        cardEl.style.opacity = '0';
        handElement.appendChild(cardEl);
    });

    const finalCardElements = Array.from(handElement.querySelectorAll('.card'));
    const newCardElements = finalCardElements.slice(gameState.hand.length);

    const flyingCards = [];
    for (let i = 0; i < newCardElements.length; i++) {
        const targetEl = newCardElements[i];
        const targetRect = targetEl.getBoundingClientRect();

        const flyingCard = document.createElement('div');
        flyingCard.className = 'flying-card';
        flyingCard.style.left = `${deckRect.left}px`;
        flyingCard.style.top = `${deckRect.top}px`;
        document.body.appendChild(flyingCard);
        flyingCards.push({ div: flyingCard, rect: targetRect });

        await sleep(100 * gameState.animationSpeed);
        requestAnimationFrame(() => {
            flyingCard.style.transform = `translate(${targetRect.left - deckRect.left}px, ${targetRect.top - deckRect.top}px)`;
        });
    }

    await sleep(700 * gameState.animationSpeed);
    gameState.hand.push(...newCards);
    renderHand();
    flyingCards.forEach(fc => fc.div.remove());

    console.log("[boot_game.js] animateDeal: Animation completed");
    if (gameState.score >= gameState.targetScore) {
        showNotification("¡Ciega superada!", 1500 * gameState.animationSpeed);
        await sleep(1500 * gameState.animationSpeed);
        //nextRoundMenu();
        return;
    } else if (gameState.handsLeft <= 0) {
        gameOver(false);
    } else {
        updateSelection();
        updateUI();
    }
    if (gameState.organize === "pairs") {
        sortByPairs();
    } else {
        sortBySuiteType();
    }
}

function sortByPairs() {
    console.log("[boot_game.js] Sorting hand by pairs");
    gameState.hand.sort((a, b) => {
        const rankA = rankValues[a.rank];
        const rankB = rankValues[b.rank];
        return rankB - rankA;
    });
    renderHand();
}

function sortBySuiteType() {
    console.log("[boot_game.js] Sorting hand by suite type");
    gameState.hand.sort((a, b) => {
        if (a.suit === b.suit) {
            return rankValues[b.rank] - rankValues[a.rank];
        }
        return a.suit.localeCompare(b.suit);
    });
    renderHand();
}
function discardSelected() {
    if (gameState.discardsLeft <= 0 || gameState.selectedCards.length === 0) return;
    gameState.discardsLeft--;
    gameState.selectedCards.sort((a, b) => b - a);
    gameState.selectedCards.forEach(index => {
        gameState.hand.splice(index, 1);
    });
    gameState.selectedCards = [];
    renderHand();
    dealHand(false);
    updateUI();
}

function analyzePokerHand(cards) {
    if (!cards || cards.length === 0) {
        return { name: null, points: 0, mult: 0 };
    }

    const suits = cards.map(card => card.suit);
    const ranks = cards.map(card => rankValues[card.rank]).sort((a, b) => a - b);
    
    const isFlush = new Set(suits).size === 1;
    const rankSet = new Set(ranks);
    const isStraight = cards.length === 5 && rankSet.size === cards.length && (ranks[ranks.length - 1] - ranks[0] === cards.length - 1);
    
    const rankCounts = {};
    ranks.forEach(rank => {
        rankCounts[rank] = (rankCounts[rank] || 0) + 1;
    });
    const counts = Object.values(rankCounts).sort((a, b) => b - a);

    if (isFlush && isStraight) return { name: 'Escalera de Color', points: 100, mult: 8 };
    if (counts[0] === 4) return { name: 'Póker', points: 60, mult: 7 };
    if (counts[0] === 3 && counts[1] === 2) return { name: 'Full House', points: 40, mult: 4 };
    if (isFlush) return { name: 'Color', points: 35, mult: 4 };
    if (isStraight) return { name: 'Escalera', points: 30, mult: 4 };
    if (counts[0] === 3) return { name: 'Trío', points: 30, mult: 3 };
    if (counts[0] === 2 && counts[1] === 2) return { name: 'Doble Pareja', points: 20, mult: 2 };
    if (counts[0] === 2) return { name: 'Pareja', points: 10, mult: 2 };

    // CORRECCIÓN: Se usa rankValues para el cálculo de Carta Alta.
    const cardValueSum = cards.reduce((sum, card) => {
        return sum + rankValues[card.rank];
    }, 0);

    // Add cardValueSum to points for all hand types
    if (isFlush && isStraight) return { name: 'Escalera de Color', points: 100 + cardValueSum, mult: 8 };
    if (counts[0] === 4) return { name: 'Póker', points: 60 + cardValueSum, mult: 7 };
    if (counts[0] === 3 && counts[1] === 2) return { name: 'Full House', points: 40 + cardValueSum, mult: 4 };
    if (isFlush) return { name: 'Color', points: 35 + cardValueSum, mult: 4 };
    if (isStraight) return { name: 'Escalera', points: 30 + cardValueSum, mult: 4 };
    if (counts[0] === 3) return { name: 'Trío', points: 30 + cardValueSum, mult: 3 };
    if (counts[0] === 2 && counts[1] === 2) return { name: 'Doble Pareja', points: 20 + cardValueSum, mult: 2 };
    if (counts[0] === 2) return { name: 'Pareja', points: 10 + cardValueSum, mult: 2 };

    return { name: 'Carta Alta', points: cardValueSum, mult: 1 };
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function gameOver(won) {
    document.getElementById('game-over').style.display = 'flex';
    
    // CORRECCIÓN: Se cambió 'game-over-text' por 'game-result' para que coincida con el HTML
    const gameResultElement = document.getElementById('game-result');
    if (gameResultElement) {
        gameResultElement.textContent = won ? '¡Ganaste!' : 'Game Over';
    }

    const finalScoreElement = document.getElementById('final-score');
    if (finalScoreElement) {
        finalScoreElement.textContent = gameState.score;
    }
    
    console.log("[boot_game.js] Game over, won:", won);
    if (!won) {
        setTimeout(() => {
            restartGame();
        }, 2000);
    }
}

async function animateCardScores(cardElements, cardsData, animationSpeed) {
    let totalAnimatedPoints = 0;
    for (let i = 0; i < cardElements.length; i++) {
        const cardEl = cardElements[i];
        const cardData = cardsData[i];
        const cardRect = cardEl.getBoundingClientRect();
        const cardValue = rankValues[cardData.rank];

        const scoreEl = document.createElement('div');
        scoreEl.textContent = `+${cardValue}`;
        scoreEl.className = 'card-score-animation';
        scoreEl.style.position = 'absolute';
        scoreEl.style.left = `${cardRect.left + cardRect.width / 2}px`;
        scoreEl.style.top = `${cardRect.top + cardRect.height / 2}px`;
        scoreEl.style.opacity = '0';
        scoreEl.style.transform = 'translate(-50%, -50%) rotate(0deg) scale(0)';
        scoreEl.style.transition = `all ${0.6 * animationSpeed}s ease-out`;
        document.body.appendChild(scoreEl);

        // Animate in
        requestAnimationFrame(() => {
            scoreEl.style.opacity = '1';
            scoreEl.style.transform = 'translate(-50%, -150%) rotate(360deg) scale(1)';
        });

        await sleep(600 * animationSpeed); // Wait for the animation to go up

        // Animate out
        scoreEl.style.transition = `all ${0.4 * animationSpeed}s ease-in`;
        scoreEl.style.opacity = '0';
        scoreEl.style.transform = 'translate(-50%, -50%) rotate(720deg) scale(0)';

        await sleep(400 * animationSpeed); // Wait for the animation to go back and fade out

        scoreEl.remove();
        totalAnimatedPoints += cardValue; // Accumulate points
        document.getElementById('hand-score-points').textContent = totalAnimatedPoints; // Update hand score points during animation
    }
    return totalAnimatedPoints;
}
