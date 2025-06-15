// Game state
let gameState = {
    score: 0,
    round: 1,
    handsLeft: 4,
    discardsLeft: 3,
    targetScore: 300,
    deck: [],
    hand: [],
    selectedCards: []
};

// Variables para el drag and drop
let draggedCardIndex = null;
let isDragging = false;







// Card definitions
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const suitSymbols = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const rankValues = { 'A': 11, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10 };

// Poker hands scoring
const handTypes = {
    'Royal Flush': { base: 100, mult: 8 },
    'Straight Flush': { base: 100, mult: 8 },
    'Four of a Kind': { base: 60, mult: 7 },
    'Full House': { base: 40, mult: 4 },
    'Flush': { base: 35, mult: 4 },
    'Straight': { base: 30, mult: 4 },
    'Three of a Kind': { base: 30, mult: 3 },
    'Two Pair': { base: 20, mult: 2 },
    'Pair': { base: 10, mult: 2 },
    'High Card': { base: 5, mult: 1 }
};

// Helper function for delays
const sleep = (ms) => new Promise(res => setTimeout(res, ms));



function handleDragStart(e) {
    isDragging = true;
    draggedCardIndex = parseInt(e.target.dataset.index);
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    
    console.log(`Comenzando arrastre de carta en posición ${draggedCardIndex}`);
    
    // Agregar clase visual a todas las cartas para mostrar zonas de drop
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        if (parseInt(card.dataset.index) !== draggedCardIndex) {
            card.classList.add('drop-zone');
        }
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    e.preventDefault();
    if (parseInt(e.target.dataset.index) !== draggedCardIndex) {
        e.target.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    e.target.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    const dropTargetIndex = parseInt(e.target.dataset.index);
    
    if (draggedCardIndex !== null && dropTargetIndex !== draggedCardIndex) {
        // Reordenar las cartas en el array
        reorderCards(draggedCardIndex, dropTargetIndex);
        console.log(`Carta movida de posición ${draggedCardIndex} a ${dropTargetIndex}`);
    }
    
    e.target.classList.remove('drag-over');
}

function handleDragEnd(e) {
    // Limpiar clases visuales
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.classList.remove('dragging', 'drop-zone', 'drag-over');
    });
    
    // Reset variables
    draggedCardIndex = null;
    setTimeout(() => {
        isDragging = false;
    }, 100);
}

// Función para reordenar cartas en el array
function reorderCards(fromIndex, toIndex) {
    // Guardar la carta que se está moviendo
    const cardToMove = gameState.hand[fromIndex];
    
    // Remover la carta de su posición original
    gameState.hand.splice(fromIndex, 1);
    
    // Ajustar el índice de destino si es necesario
    const adjustedToIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
    
    // Insertar la carta en la nueva posición
    gameState.hand.splice(adjustedToIndex, 0, cardToMove);
    
    // Actualizar las selecciones
    updateSelectedCardsAfterReorder(fromIndex, adjustedToIndex);
    
    // Re-renderizar la mano
    renderHand();
    updateSelection();
    
    showNotification("Carta reordenada", 800);
}

// Función para actualizar los índices de cartas seleccionadas después del reordenamiento
function updateSelectedCardsAfterReorder(fromIndex, toIndex) {
    const newSelectedCards = [];
    
    gameState.selectedCards.forEach(selectedIndex => {
        let newIndex = selectedIndex;
        
        if (selectedIndex === fromIndex) {
            // La carta que se movió tiene un nuevo índice
            newIndex = toIndex;
        } else if (fromIndex < toIndex) {
            // Movimiento hacia adelante
            if (selectedIndex > fromIndex && selectedIndex <= toIndex) {
                newIndex = selectedIndex - 1;
            }
        } else {
            // Movimiento hacia atrás
            if (selectedIndex >= toIndex && selectedIndex < fromIndex) {
                newIndex = selectedIndex + 1;
            }
        }
        
        newSelectedCards.push(newIndex);
    });
    
    gameState.selectedCards = newSelectedCards;
}

// Initialize game
function initGame() {
    console.log("Initializing game...");
    createDeck();
    shuffleDeck();
    dealHand(true); // Initial deal
    updateUI();
}

function createDeck() {
    gameState.deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            gameState.deck.push({ suit, rank, id: `${rank}_${suit}` });
        }
    }
    console.log("Deck created with", gameState.deck.length, "cards.");
}

function shuffleDeck() {
    for (let i = gameState.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
    }
    console.log("Deck shuffled.");
}

function dealHand(isInitialDeal = false) {
    const cardsNeeded = 8 - gameState.hand.length;
    if (cardsNeeded <= 0) return;

    const newCards = [];
    for (let i = 0; i < cardsNeeded; i++) {
        if (gameState.deck.length > 0) {
            newCards.push(gameState.deck.pop());
        }
    }

    if (isInitialDeal) {
        gameState.hand.push(...newCards);
        renderHand();
    } else {
        // Handle animated dealing for subsequent deals
        animateDeal(newCards);
    }
}


function renderHand() {
    const handElement = document.getElementById('hand');
    handElement.innerHTML = '';
    console.log("Rendering hand with", gameState.hand.length, "cards.");

    gameState.hand.forEach((card, index) => {
        const cardElement = createCardElement(card, index);
        handElement.appendChild(cardElement);
    });
}

function createCardElement(card, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = `card ${card.suit}`;
    cardDiv.dataset.index = index;
    cardDiv.dataset.id = card.id;
    
    // Hacer la carta arrastrable
    cardDiv.draggable = true;

    cardDiv.innerHTML = `
        <div class="card-rank">${card.rank}</div>
        <div class="card-suit">${suitSymbols[card.suit]}</div>
        <div class="card-rank-bottom">${card.rank}</div>
    `;

    // Event listeners para click (selección)
    cardDiv.addEventListener('click', (e) => {
        if (!isDragging) {
            toggleCardSelection(index);
        }
    });

    // Event listeners para drag and drop
    cardDiv.addEventListener('dragstart', handleDragStart);
    cardDiv.addEventListener('dragover', handleDragOver);
    cardDiv.addEventListener('dragenter', handleDragEnter);
    cardDiv.addEventListener('dragleave', handleDragLeave);
    cardDiv.addEventListener('drop', handleDrop);
    cardDiv.addEventListener('dragend', handleDragEnd);

    return cardDiv;
}

function toggleCardSelection(index) {
    if (gameState.selectedCards.includes(index)) {
        gameState.selectedCards = gameState.selectedCards.filter(i => i !== index);
    } else {
        // Allow selection of up to 5 cards
        if (gameState.selectedCards.length < 5) {
            gameState.selectedCards.push(index);
        }
    }
    updateSelection();
}

function updateSelection() {
    const handElement = document.getElementById('hand');
    const cardElements = handElement.querySelectorAll('.card');

    cardElements.forEach((cardEl) => {
        const index = parseInt(cardEl.dataset.index);
        if (gameState.selectedCards.includes(index)) {
            cardEl.classList.add('selected');
        } else {
            cardEl.classList.remove('selected');
        }
    });

    evaluateHand();
    updateUI();
}

function evaluateHand() {
    const handNameEl = document.getElementById('hand-name');
    const handScoreEl = document.getElementById('hand-score');
    const handScorePointsEl = document.getElementById('hand-score-points');
    const handScoreMultEl = document.getElementById('hand-score-mult');

    if (gameState.selectedCards.length === 0) {
        handNameEl.textContent = 'Selecciona cartas';
        handScoreEl.textContent = 'Puntos: 0 | Mult: 0';
        handScorePointsEl.textContent = '0';
        handScoreMultEl.textContent = '0';
        return;
    }

    const selectedHandCards = gameState.selectedCards
        .map(i => gameState.hand[i])
        .filter(card => card !== undefined);

    const handResult = analyzePokerHand(selectedHandCards);

    handNameEl.textContent = handResult.name;
    handScoreEl.textContent = `Puntos: ${handResult.points} | Mult: ${handResult.mult}`;
    handScorePointsEl.textContent = handResult.points;
    handScoreMultEl.textContent = handResult.mult;
}

function analyzePokerHand(cards) {
    if (cards.length === 0) return { name: 'Sin mano', points: 0, mult: 0 };

    const ranks = cards.map(c => c.rank);
    const suits = cards.map(c => c.suit);
    const rankCounts = {};
    ranks.forEach(rank => {
        rankCounts[rank] = (rankCounts[rank] || 0) + 1;
    });

    const counts = Object.values(rankCounts).sort((a, b) => b - a);
    const isFlush = new Set(suits).size === 1 && cards.length === 5;
    const isStraight = cards.length === 5 && checkStraight(ranks);
    
    let handName = 'High Card';
    if (isFlush && isStraight) {
        // Check for Royal Flush
        const royalRanks = new Set(['A', 'K', 'Q', 'J', '10']);
        if (ranks.every(rank => royalRanks.has(rank))) {
            handName = 'Royal Flush';
        } else {
            handName = 'Straight Flush';
        }
    } else if (counts[0] === 4) {
        handName = 'Four of a Kind';
    } else if (counts[0] === 3 && counts[1] === 2) {
        handName = 'Full House';
    } else if (isFlush) {
        handName = 'Flush';
    } else if (isStraight) {
        handName = 'Straight';
    } else if (counts[0] === 3) {
        handName = 'Three of a Kind';
    } else if (counts[0] === 2 && counts[1] === 2) {
        handName = 'Two Pair';
    } else if (counts[0] === 2) {
        handName = 'Pair';
    }

    const basePoints = handTypes[handName].base;
    const baseMult = handTypes[handName].mult;
    const cardPoints = cards.reduce((sum, card) => sum + rankValues[card.rank], 0);

    const result = {
        name: handName,
        points: basePoints + cardPoints,
        mult: baseMult
    };
    console.log("Analyzed Hand:", cards.map(c=>c.id), "Result:", result);
    return result;
}


// MODIFICATION START: Improved checkStraight function
function checkStraight(ranks) {
    if (new Set(ranks).size !== 5) return false; 

    const rankOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const numRanks = ranks.map(r => rankOrder.indexOf(r)).sort((a, b) => a - b);
    
    // Special case for Ace-low straight: A, 2, 3, 4, 5
    const isAceLow = numRanks.join(',') === '0,1,2,3,12'; // Indices for 2,3,4,5,A
    if (isAceLow) {
        console.log("Straight detected: Ace-low");
        return true;
    }

    // Standard straight check
    for (let i = 0; i < numRanks.length - 1; i++) {
        if (numRanks[i+1] - numRanks[i] !== 1) {
            return false;
        }
    }
    console.log("Straight detected: Standard");
    return true;
}
// MODIFICATION END

// MODIFICATION START: Complete rewrite of playHand with animations
async function playHand() {
    if (gameState.selectedCards.length === 0) return;
    console.log("--- Starting playHand sequence ---");

    // 1. Disable all controls
    document.getElementById('play-btn').disabled = true;
    document.getElementById('discard-btn').disabled = true;

    // 2. Prepare for animation
    const handElement = document.getElementById('hand');
    const allCardElements = Array.from(handElement.querySelectorAll('.card'));
    const selectedIndexes = new Set(gameState.selectedCards);
    const selectedElements = [];
    const unselectedElements = [];

    allCardElements.forEach(el => {
        if (selectedIndexes.has(parseInt(el.dataset.index))) {
            selectedElements.push(el);
        } else {
            unselectedElements.push(el);
        }
    });
    
    const selectedHandCards = gameState.selectedCards
        .map(i => gameState.hand[i])
        .filter(card => card !== undefined);

    // 3. Animate cards separating
    console.log("Animating cards: separating played from unplayed.");
    selectedElements.forEach(el => el.classList.add('card-played-up'));
    unselectedElements.forEach(el => el.classList.add('card-played-down'));
    await sleep(600);

    // 4. Analyze hand and animate point tickers
    const handResult = analyzePokerHand(selectedHandCards);
    console.log("Scoring hand. Result:", handResult);
    for (const cardEl of selectedElements) {
        const cardData = gameState.hand[parseInt(cardEl.dataset.index)];
        const points = rankValues[cardData.rank];
        const cardRect = cardEl.getBoundingClientRect();

        const popup = document.createElement('div');
        popup.textContent = `+${points}`;
        popup.style.position = 'fixed';
        popup.style.left = `${cardRect.left + cardRect.width / 2 - 15}px`;
        popup.style.top = `${cardRect.top - 30}px`;
        popup.style.color = '#4ecdc4';
        popup.style.fontSize = '24px';
        popup.style.fontWeight = 'bold';
        popup.style.textShadow = '1px 1px 2px black';
        popup.style.transition = 'all 0.5s ease';
        popup.style.transform = 'translateY(10px)';
        popup.style.opacity = '0';
        document.body.appendChild(popup);

        await sleep(50);
        popup.style.transform = 'translateY(0)';
        popup.style.opacity = '1';

        await sleep(600);
        popup.style.opacity = '0';
        await sleep(400);
        popup.remove();
    }
    
    // 5. Show hand result notification
    const totalScore = handResult.points * handResult.mult;
    showNotification(`${handResult.name}!`, 1500);
    await sleep(1500);
    showNotification(`+${totalScore} Puntos!`, 2000);
    
    // 6. Update game state
    gameState.score += totalScore;
    gameState.handsLeft--;

    // 7. Animate played cards fading out
    console.log("Animating played cards out.");
    selectedElements.forEach(el => el.classList.add('card-fade-out'));
    await sleep(500);

    // 8. Remove played cards from state and DOM
    gameState.selectedCards.sort((a, b) => b - a);
    gameState.selectedCards.forEach(index => {
        gameState.hand.splice(index, 1);
    });
    gameState.selectedCards = [];
    renderHand(); // Re-render the remaining cards in their final positions
    
    // 9. Deal new cards with animation
    await sleep(500);
    console.log("Dealing new cards.");
    dealHand(false); // Use animated deal

    // Wait for dealing animation to finish (managed inside animateDeal)
    // The game flow continues in the 'then' block of animateDeal
}
// MODIFICATION END


async function animateDeal(newCards) {
    const handElement = document.getElementById('hand');
    const deckElement = document.getElementById('deck-container');
    const deckRect = deckElement.getBoundingClientRect();

    // Temporarily add new cards to the hand state to calculate their final positions
    const tempHand = [...gameState.hand, ...newCards];
    handElement.innerHTML = ''; // Clear hand
    tempHand.forEach((card, index) => {
        const cardEl = createCardElement(card, index);
        cardEl.style.opacity = '0'; // Render them invisibly to get positions
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

        await sleep(100); // Stagger card dealing
        requestAnimationFrame(() => {
            flyingCard.style.transform = `translate(${targetRect.left - deckRect.left}px, ${targetRect.top - deckRect.top}px)`;
        });
    }

    await sleep(700); // Wait for flight animation

    // Update the actual game state
    gameState.hand.push(...newCards);
    renderHand(); // Render the final hand state visibly
    flyingCards.forEach(fc => fc.div.remove()); // Clean up flying cards

    // Continue game flow
    console.log("--- playHand sequence finished ---");
    if (gameState.score >= gameState.targetScore) {
        showNotification("¡Ciega superada!", 1500);
        await sleep(1500);
        nextRound();
    } else if (gameState.handsLeft <= 0) {
        gameOver(false);
    } else {
        updateSelection();
        updateUI();
    }
}


function discardCards() {
    if (gameState.selectedCards.length === 0 || gameState.discardsLeft <= 0) return;
    console.log("Discarding cards:", gameState.selectedCards);
    
    gameState.discardsLeft--;

    gameState.selectedCards.sort((a, b) => b - a);
    gameState.selectedCards.forEach(index => {
        gameState.hand.splice(index, 1);
    });
    
    gameState.selectedCards = [];
    
    renderHand(); // Re-render immediately
    dealHand(false); // Animated deal for new cards
    updateSelection();
    updateUI();
}

function nextRound() {
    console.log("--- Starting next round ---");
    gameState.round++;
    gameState.handsLeft = 4;
    gameState.discardsLeft = 3;
    gameState.targetScore = Math.floor(gameState.targetScore * 1.6);
    createDeck();
    shuffleDeck();
    gameState.hand = []; // Clear hand before dealing a new one
    dealHand(true);
    updateSelection();
    updateUI();
    showNotification(`¡Ronda ${gameState.round}!`, 2000);
}

function gameOver(won) {
    console.log("--- Game Over ---. Won:", won);
    document.getElementById('game-result').textContent = won ? '¡Victoria!' : '¡Derrota!';
    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('game-over').style.display = 'flex';
}

function restartGame() {
    console.log("--- Restarting Game ---");
    gameState = {
        score: 0,
        round: 1,
        handsLeft: 4,
        discardsLeft: 3,
        targetScore: 300,
        deck: [],
        hand: [],
        selectedCards: []
    };
    document.getElementById('game-over').style.display = 'none';
    initGame();
}

function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('round').textContent = gameState.round;
    document.getElementById('hands').textContent = gameState.handsLeft;
    document.getElementById('discards').textContent = gameState.discardsLeft;
    document.getElementById('target').textContent = gameState.targetScore;
    document.getElementById('deck-count').textContent = `${gameState.deck.length}/52`;


    const playBtn = document.getElementById('play-btn');
    const discardBtn = document.getElementById('discard-btn');

    // Only enable buttons if no animation is running. We can check if playHand is active.
    // For simplicity, we just check the selected card length. The playHand function will disable them during animation.
    discardBtn.disabled = gameState.selectedCards.length === 0 || gameState.discardsLeft <= 0;
    playBtn.disabled = gameState.selectedCards.length === 0;
}

function showNotification(message, duration = 1500) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

function showCombinations() {
    document.getElementById('combinations-modal').style.display = 'flex';
}
function closeCombinations() {
    document.getElementById('combinations-modal').style.display = 'none';
}
function exitGame() { console.log("Saliendo..."); }
function goToMenu() { console.log("Yendo al menú..."); }

// Event listeners
document.getElementById('play-btn').addEventListener('click', playHand);
document.getElementById('discard-btn').addEventListener('click', discardCards);

// Función para organizar cartas por palo
function sortBySuiteType() {
    console.log("Organizando cartas por palo...");
    
    // Definir orden de palos
    const suitOrder = { 'hearts': 0, 'diamonds': 1, 'clubs': 2, 'spades': 3 };
    
    // Ordenar las cartas en la mano
    gameState.hand.sort((a, b) => {
        // Primero por palo
        if (suitOrder[a.suit] !== suitOrder[b.suit]) {
            return suitOrder[a.suit] - suitOrder[b.suit];
        }
        // Luego por valor dentro del mismo palo
        const rankOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        return rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank);
    });
    
    // Limpiar selección y re-renderizar
    gameState.selectedCards = [];
    renderHand();
    updateSelection();
    showNotification("Organizadas por palo", 1000);
}

// Función para organizar cartas por pares/grupos de números
function sortByPairs() {
    console.log("Organizando cartas por pares/grupos...");
    
    // Contar ocurrencias de cada rango
    const rankCounts = {};
    gameState.hand.forEach(card => {
        rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
    });
    
    // Ordenar las cartas
    gameState.hand.sort((a, b) => {
        // Primero por cantidad de cartas del mismo rango (descendente)
        if (rankCounts[a.rank] !== rankCounts[b.rank]) {
            return rankCounts[b.rank] - rankCounts[a.rank];
        }
        
        // Luego por valor del rango
        const rankOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        if (rankOrder.indexOf(a.rank) !== rankOrder.indexOf(b.rank)) {
            return rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank);
        }
        
        // Finalmente por palo para mantener consistencia
        const suitOrder = { 'hearts': 0, 'diamonds': 1, 'clubs': 2, 'spades': 3 };
        return suitOrder[a.suit] - suitOrder[b.suit];
    });
    
    // Limpiar selección y re-renderizar
    gameState.selectedCards = [];
    renderHand();
    updateSelection();
    showNotification("Organizadas por pares", 1000);
}

// Modificación para agregar los event listeners en el código existente
// Agregar estas líneas al final del archivo boot.js, después de las otras event listeners:

document.getElementById('sort-suit-btn').addEventListener('click', sortBySuiteType);
document.getElementById('sort-pairs-btn').addEventListener('click', sortByPairs);


// Start game
initGame();