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

async function playHand() {
    
    console.log("[boot_game.js] playHand function called");
    if (gameState.selectedCards.length === 0) return;
    console.log("[boot_game.js] --- Starting playHand sequence ---");

    document.getElementById('play-btn').disabled = true;
    document.getElementById('discard-btn').disabled = true;

    const selectedHandCards = gameState.selectedCards
        .map(i => gameState.hand[i])
        .filter(card => card !== undefined);

    let handResult = analyzePokerHand(selectedHandCards);
    console.log("[boot_game.js] Hand result before jokers:", handResult);

    // Aplicar efectos de los jokers
    gameState.jokersOwned.forEach((joker, index) => {
        if (joker && joker.effect) {
            console.log(`[boot_game.js] Checking joker: ${joker.name}`);
            // The joker effect function receives the current points, multiplier, the hand, the game state, and hand info
            let mod = joker.effect(handResult.points, handResult.mult, selectedHandCards, gameState, handResult);
            if (mod) {
                // The joker returns the new total points and mult, not the delta
                handResult.points = mod.points;
                handResult.mult = mod.mult;
                console.log(`[boot_game.js] Joker '${joker.name}' applied. New points: ${handResult.points}, New mult: ${handResult.mult}`);
            } else {
                console.log(`[boot_game.js] Joker '${joker.name}' did not activate (condition not met).`);
            }

            // Apply sub-effect if present
            if (joker.subEffect && joker.subEffect.effect) {
                console.log(`[boot_game.js] Checking sub-effect: ${joker.subEffect.name} for joker: ${joker.name}`);
                const subMod = joker.subEffect.effect(handResult.points, handResult.mult, gameState);
                if (subMod) {
                    handResult.points = subMod.points || handResult.points;
                    handResult.mult = subMod.mult || handResult.mult;
                    console.log(`[boot_game.js] Sub-effect '${joker.subEffect.name}' applied: points=${handResult.points}, mult=${handResult.mult}`);
                } else {
                    console.log(`[boot_game.js] Sub-effect '${joker.subEffect.name}' did not activate (e.g., glass broke).`);
                }
            }
        } else {
            console.log(`[boot_game.js] Skipping joker at index ${index} because it has no .effect function.`);
        }
    });
    const totalScore = handResult.points * handResult.mult;
    console.log(`[boot_game.js] Final score for this hand: ${handResult.points} * ${handResult.mult} = ${totalScore}`);

    gameState.score += totalScore; // Actualización correcta del puntaje
    updateUI()
    console.log("[boot_game.js] Updated gameState.score:", gameState.score);
    gameState.handsLeft--;

    if (gameState.animationSpeed > 0) {
        const handElement = document.getElementById('hand');
        const allCardElements = Array.from(handElement.querySelectorAll('.card'));
        const selectedIndexes = new Set(gameState.selectedCards);
        const selectedElements = allCardElements.filter(el => selectedIndexes.has(parseInt(el.dataset.index)));
        
        selectedElements.forEach(el => el.classList.add('card-played-up'));
        await sleep(600 * gameState.animationSpeed);

        showNotification(`${handResult.name}! (+${totalScore} Puntos)`, 1500 * gameState.animationSpeed);
        await sleep(1500 * gameState.animationSpeed);
        
        selectedElements.forEach(el => el.classList.add('card-fade-out'));
        await sleep(500 * gameState.animationSpeed);
    }

    // Remover cartas jugadas
    gameState.selectedCards.sort((a, b) => b - a);
    gameState.selectedCards.forEach(index => {
        gameState.hand.splice(index, 1);
    });
    gameState.selectedCards = [];

    renderHand();
    dealHand(false);

    if (gameState.score >= gameState.targetScore) {
        showNotification("¡Ciega superada!", 1500 * gameState.animationSpeed);
        await sleep(1500 * gameState.animationSpeed);
        nextRoundMenu();
    } else if (gameState.handsLeft <= 0) {
        gameOver(false);
    } else {
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
    const highCardPoints = cards.reduce((sum, card) => {
        return sum + rankValues[card.rank];
    }, 0);
    return { name: 'Carta Alta', points: highCardPoints, mult: 1 };
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