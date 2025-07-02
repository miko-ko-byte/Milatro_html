console.log("[boot_menu.js] boot_menu.js loaded");
console.log("[boot_menu.js] Starting boot menu...");

// Initial game state (default values)
let gameState = {
    score: 0,
    round: 0,
    handsLeft: 4,
    discardsLeft: 3,
    targetScore: 300,
    money: 4,
    deck: [],
    hand: [],
    selectedCards: [],
    deckType: 'standard',
    difficulty: 'easy',
    jokerCollection: 'none',
    nextBlindTargetScore: 300,
    nextBlindReward: 10,
    animationSpeed: 1,
    jokersOwned: [],
    shopJokers: [],
    seenSubEffects: [], // Array of sub-effect IDs seen
    seenJokers: [], // Array of joker IDs seen
    ownedBlackCards: [], // Array of black card IDs owned
    timesBooted: 0,
    startTime: null,
    completionPercentage: 0,
    recovery: false
};
// Available jokers for purchase in the shop
// Archivo: boot_menu.js
// Sub-effects that can be assigned to jokers in the shop
const subEffects = [
    {
        id: 'foil',
        name: 'Foil',
        description: 'Aumenta el multiplicador en +20.',
        effect: (points, mult) => ({ mult: mult + 20 }),
        probability: 0.05,
        costMultiplier: 1.5,
        visual: 'foil-effect'
    },
    {
        id: 'blessed',
        name: 'Blessed',
        description: 'Multiplica el multiplicador por 10.',
        effect: (points, mult) => ({ mult: mult * 10 }),
        probability: 0.05,
        costMultiplier: 2,
        visual: 'blessed-effect'
    },
    {
        id: 'golded',
        name: 'Golded',
        description: 'Si tienes menos de $20, duplica tu dinero.',
        effect: (points, mult, gameState) => {
            if (gameState.money < 20) gameState.money *= 2;
            return { points, mult };
        },
        probability: 0.20,
        costMultiplier: 1.8,
        visual: 'golded-effect'
    },
    {
        id: 'holographic',
        name: 'Holografica',
        description: '+10 Mult',
        effect: (points, mult, gameState) => {
           const newmult = mult + 10
            return { points, mult: newmult };
        },
        probability: 0.20,
        costMultiplier: 1.8,
        visual: 'holo-effect'
    },
    {
        id: 'polychrome',
        name: 'polychromatica',
        description: 'x1.5 Mult',
        effect: (points, mult, gameState) => {
            const newmult = Math.round(mult * 1.5);
            return { points, mult: newmult };
        },
        probability: 0.10,
        costMultiplier: 1.8,
        visual: 'poly-effect'
    },
    {
        id: 'negative',
        name: 'Negativa',
        description: 'añade un slot extra para jokers',
        effect: (points, mult, gameState) => {
            const newmult = Math.round(mult * 1.5);
            return { points, mult: newmult };
        },
        probability: 0.01,
        costMultiplier: 1.8,
        visual: 'negative-effect'
    },
    {
        id: 'glass',
        name: 'Glass',
        description: 'Multiplica puntos y multiplicador por 4, pero tiene un 10% de probabilidad de romperse.',
        effect: (points, mult) => {
            if (Math.random() < 0.1) {
                console.log("[boot_menu.js] Glass sub-effect broke!");
                return null; // Card breaks, no effect
            }
            return { points: points * 4, mult: mult * 4 };
        },
        probability: 0.05,
        costMultiplier: 2.5,
        visual: 'glass-effect'
    }
];

const availableJokers = [
    {
        id: 'joker',
        name: '+4 Mult',
        rarity: 'common',
        description: '+4 Mult. Disponible desde el inicio.',
        cost: 2,
        image: './images/jokers/joker.png',
        script: './jokers/joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'greedy_joker',
        name: 'Joker Avaricioso',
        rarity: 'common',
        description: 'Las cartas jugadas con el palo ♦ otorgan +3 Mult al puntuar.',
        cost: 5,
        image: './images/jokers/greedy_joker.png',
        script: './jokers/greedy_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'lusty_joker',
        name: 'Joker Lujurioso',
        rarity: 'common',
        description: 'Las cartas jugadas con el palo ♥ otorgan +3 Mult al puntuar.',
        cost: 5,
        image: './images/jokers/lusty_joker.png',
        script: './jokers/lusty_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'wrathful_joker',
        name: 'Joker Iracundo',
        rarity: 'common',
        description: 'Las cartas jugadas con el palo ♠ otorgan +3 Mult al puntuar.',
        cost: 5,
        image: './images/jokers/wrathful_joker.png',
        script: './jokers/wrathful_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'gluttonous_joker',
        name: 'Joker Glotón',
        rarity: 'common',
        description: 'Las cartas jugadas con el palo ♣ otorgan +3 Mult al puntuar.',
        cost: 5,
        image: './images/jokers/gluttonous_joker.png',
        script: './jokers/gluttonous_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'double_it_and_give_it_to_the_mult',
        name: 'Cara feliz',
        rarity: 'common',
        description: 'Cuando se puntúa una figura (K, Q, J), añade el doble del valor de la primera figura al multiplicador.',
        cost: 5,
        image: './images/jokers/happy_face.png',
        script: './jokers/doble_it_and_give_it_to_the_mult.js',
        canHaveSubEffect: true
    },
    {
        id: 'supernoba',
        name: 'Super Nova',
        rarity: 'common',
        description: 'Suma Mult tantas veces como se haya jugado la mano anotadora en la ciega actual.',
        cost: 5,
        image: './images/jokers/supernoba.png',
        script: './jokers/supernoba.js',
        canHaveSubEffect: true
    },
    {
        id: 'in_my_own_game',
        name: 'En mi propio juego',
        rarity: 'uncommon',
        description: '1 de cada 4 manos otorga +100 puntos extra.',
        cost: 6,
        image: './images/jokers/in_my_own_game.png',
        script: './jokers/in_my_own_game.js',
        canHaveSubEffect: true
    },
    {
        id: 'ace_booster',
        name: 'Impulsor de Ases',
        rarity: 'common',
        description: 'Añade +10 puntos por cada As en la mano puntuada.',
        cost: 4,
        image: './images/jokers/ace_booster.png',
        script: './jokers/ace_booster.js',
        canHaveSubEffect: true
    },
    {
        id: 'flush_master',
        name: 'Maestro del color',
        rarity: 'rare',
        description: 'Duplica el multiplicador para manos de color (Flush).',
        cost: 8,
        image: './images/jokers/flush_master.png',
        script: './jokers/flush_master.js',
        canHaveSubEffect: true
    },
    {
        id: 'bbw',
        name: 'BBW',
        rarity: 'rare',
        description: 'Por cada carta ♠ y ♣ se duplica el multiplicador.',
        cost: 12,
        image: './images/jokers/bbw.png',
        script: './jokers/bbw.js',
        canHaveSubEffect: true
    },
    {
        id: 'gambling',
        name: '¡VAMOS A APOSTAR!',
        rarity: 'rare',
        description: 'Añade un número aleatorio a tu mult (máximo 100).',
        cost: 14,
        image: './images/jokers/gambling.png',
        script: './jokers/gambling.js',
        canHaveSubEffect: true
    },
    {
        id: 'phantom_pair',
        name: 'Doble fantasma',
        rarity: 'rare',
        description: '+2 de multiplicador si la mano jugada contiene un par.',
        cost: 4,
        image: './images/jokers/pair.png',
        script: './jokers/pair.js',
        canHaveSubEffect: true
    },
    {
        id: 'phantom_trio',
        name: 'Penelopeada',
        rarity: 'rare',
        description: 'x2 de multiplicador si la mano jugada contiene doble par.',
        cost: 4,
        image: './images/jokers/triple.png',
        script: './jokers/triple.js',
        canHaveSubEffect: true
    },
    {
        id: 'time_twister',
        name: 'Doblado espacio-tiempo',
        rarity: 'black card',
        description: 'Retrocede el tiempo para otorgar una mano extra si tu puntuación está por debajo del objetivo, pero solo una vez por ronda.',
        cost: 20,
        image: './images/jokers/time_twister.png',
        script: './jokers/time_twister.js',
        canHaveSubEffect: false
    }
];

function assignSubEffectsToShopJokers(jokers) {
    return jokers.map(joker => {
        // Track seen jokers
        if (!gameState.seenJokers.includes(joker.id)) {
            gameState.seenJokers.push(joker.id);
            console.log("[boot_menu.js] Joker seen:", joker.name);
        }
        if (!joker.canHaveSubEffect) return joker;
        const rand = Math.random();
        let cumulativeProb = 0;
        for (const subEffect of subEffects) {
            cumulativeProb += subEffect.probability;
            if (rand <= cumulativeProb) {
                // Track seen sub-effects
                if (!gameState.seenSubEffects.includes(subEffect.id)) {
                    gameState.seenSubEffects.push(subEffect.id);
                    console.log("[boot_menu.js] Sub-effect seen:", subEffect.name);
                }
                console.log(`[boot_menu.js] Assigned sub-effect ${subEffect.name} to joker ${joker.name}`);
                return {
                    ...joker,
                    subEffect: subEffect,
                    cost: Math.ceil(joker.cost * subEffect.costMultiplier)
                };
            }
        }
        return joker; // No sub-effect assigned
    });
}


function getLiquidBg() {
    return document.querySelector('.liquid-bg');
}

// Función para establecer el fondo del juego
function setBg(bgClass) {
    const liquidBg = getLiquidBg();
    if (liquidBg) {
        // Remove all known background classes
        liquidBg.classList.remove('main', 'color1', 'color2', 'color3', 'color4', 'color6', 'color5');
        // Add the requested background class
        if (bgClass == "default") {
            return
        }
        liquidBg.classList.add(bgClass);
    }
    console.log(`[boot_menu.js] Setting background: ${bgClass}`);
}
// --- NUEVA FUNCIÓN PARA LA VISTA PREVIA ---
function previewJoker(jokerIndex) {
    const previewArea = document.getElementById('shop-preview-area');
    const jokerData = gameState.shopJokers[jokerIndex];

    if (!jokerData) {
        console.error("[boot_menu.js] No joker found at index:", jokerIndex);
        previewArea.innerHTML = `<p class="shop-preview-placeholder">Error al cargar el artículo.</p>`;
        return;
    }

    const isOwned = gameState.jokersOwned.some(j => j.name === jokerData.name && (!j.subEffect || !jokerData.subEffect || j.subEffect.id === jokerData.subEffect.id));
    const canAfford = gameState.money >= (isOwned ? Math.ceil(jokerData.cost / 2) : jokerData.cost);

    let buyButtonHTML = '';
    if (isOwned) {
        buyButtonHTML = `<button class="btn-confirm-purchase" disabled>Adquirido</button>`;
    } else {
        const cost = isOwned ? Math.ceil(jokerData.cost / 2) : jokerData.cost;
        buyButtonHTML = `
            <button class="btn-confirm-purchase" 
                    onclick="buyItem('joker_${jokerIndex}')" 
                    ${canAfford ? '' : 'disabled'}>
                ${canAfford ? `Comprar $${cost}` : 'Fondos insuficientes'}
            </button>
        `;
    }

    const subEffectText = jokerData.subEffect
        ? `<p class="rarity-text">Sub-Efecto: ${jokerData.subEffect.name} - ${jokerData.subEffect.description || 'Efecto especial'}</p>`
        : '';

    previewArea.innerHTML = `
        <div class="preview-content">
            <div class="preview-joker-card-container">
                <div class="preview-joker-card ${jokerData.subEffect ? jokerData.subEffect.visual : ''}" 
                     style="background-image: url('${jokerData.image}')"></div>
            </div>
            <div class="preview-joker-info">
                <div>
                    <h3>${jokerData.name}</h3>
                    <p>${jokerData.description}</p>
                    <p class="rarity-text">Rareza: ${jokerData.rarity}</p>
                    ${subEffectText}
                </div>
                ${buyButtonHTML}
            </div>
        </div>
    `;
    const jokerCards = document.querySelectorAll('.shop-joker-card');
    jokerCards.forEach(card => card.classList.remove('selected-joker'));
    const selectedCard = document.querySelector(`.shop-joker-card[data-joker-index="${jokerIndex}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected-joker');
        if (jokerData.subEffect) selectedCard.classList.add(jokerData.subEffect.visual);
    }
    console.log("[boot_menu.js] Preview updated for joker:", jokerData.name, "Sub-effect:", jokerData.subEffect?.name || 'None');
}

function loadJokerScripts() {
    availableJokers.forEach(joker => {
        const script = document.createElement('script');
        script.src = joker.script;
        script.type = 'text/javascript';
        script.async = false;
        document.body.appendChild(script);
    });
}

// Function to dynamically add boot_game.js and joker scripts to the DOM
function prepareGame() {
    gameState.deckType = document.getElementById('deck-type').value;
    gameState.difficulty = document.getElementById('difficulty').value;
    gameState.jokerCollection = document.getElementById('joker-collection').value;
    const speedValue = document.getElementById('animation-speed').value;
    gameState.animationSpeed = speedValue === 'instant' ? 0 : parseFloat(speedValue);

    console.log("[boot_menu.js] User selected options:");
    console.log("[boot_menu.js] Deck Type:", gameState.deckType);
    console.log("[boot_menu.js] Difficulty:", gameState.difficulty);
    console.log("[boot_menu.js] Joker Collection:", gameState.jokerCollection);
    console.log("[boot_menu.js] Animation Speed:", gameState.animationSpeed === 0 ? 'Instant' : `${1 / gameState.animationSpeed}x`);

    document.querySelector('.boot-menu').style.display = 'none';
    document.querySelector('.blind-selection-menu').style.display = 'flex';
    console.log("[boot_menu.js] Boot menu hidden, blind selection menu shown.");

    // Inject animation speed into CSS
    injectAnimationSpeedStyles();
}

// Function to inject animation speed as a CSS variable
function injectAnimationSpeedStyles() {
    let styleElement = document.getElementById('animation-speed-styles');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'animation-speed-styles';
        document.head.appendChild(styleElement);
    }
    const baseDuration = gameState.animationSpeed === 0 ? 0 : gameState.animationSpeed;
    styleElement.innerHTML = `
        .card-played-up, .card-played-down, .card-fade-out {
            transition: all ${0.4 * baseDuration}s ease !important;
        }
        .flying-card {
            transition: all ${0.6 * baseDuration}s ease-in-out !important;
        }
        .joker-card {
            transition: all ${0.3 * baseDuration}s ease;
        }
    `;
}

// Elegir ciega según nivel
function selectBlind(num) {
    const levels = {
        1: { difficulty: 'easy', targetScore: 300, reward: 10 },
        2: { difficulty: 'medium', targetScore: 500, reward: 15 },
        3: { difficulty: 'hard', targetScore: 800, reward: 20 }
    };

    let config = levels[num];
    gameState.difficulty = config.difficulty;
    gameState.targetScore = config.targetScore;
    gameState.nextBlindReward = config.reward;
    gameState.round = 1;

    resetGameForNewBlind();

    console.log(`[boot_menu.js] Blind selected: Level ${num}, Difficulty: ${config.difficulty}, Target Score: ${config.targetScore}, Reward: ${config.reward}`);

    document.querySelector('.blind-selection-menu').style.display = 'none';

    // El bucle de carga de jokers se ha eliminado de aquí

    const script = document.createElement('script');
    script.src = './boot_game.js';
    script.type = 'text/javascript';
    script.async = false;
    script.onload = () => {
        console.log("[boot_menu.js] boot_game.js loaded, calling startingGame()...");
        startingGame();
    };
    document.body.appendChild(script);
    console.log("[boot_menu.js] boot_game.js script appended to DOM.");
}
// Reset game state for a new blind
function resetGameForNewBlind() {
    gameState.score = 0;
    gameState.handsLeft = 4;
    gameState.discardsLeft = 3;
    gameState.deck = [];
    gameState.hand = [];
    gameState.selectedCards = [];
    gameState.organize = 'pairs';
    gameState.timeTwisterUsed = false; // Reset for new round
    console.log("[boot_menu.js] Game state reset for new blind:", gameState);
}
// Function to initialize game UI
function startingGame() {
    setBg("default"); // Vuelve al fondo del juego
    transitionToMusic('main'); // Si también vuelves a la música principal
    console.log("[boot_menu.js] Shop closed, setting game background.");
    console.log("[boot_menu.js] Initializing game UI with state:", gameState);

    // Hide boot menu and shop menu, show game elements
    document.querySelector('.boot-menu').style.display = 'none';
    document.querySelector('.shop-menu').style.display = 'none';
    document.querySelector('.play-area').style.display = 'flex';
    document.querySelector('.left-panel').style.display = 'flex';
    document.querySelector('.right-panel').style.display = 'flex';
    console.log("[boot_menu.js] Boot menu and shop menu hidden, game panels shown.");

    // Let boot_game.js handle game initialization
    if (typeof initGame === 'function') {
        initGame();
    }
}

// Function to update UI elements
function updateUI() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = gameState.score;
        console.log("[boot_menu.js] Score updated in UI:", gameState.score);
    }

    //saves the finded joker cards to the localstorage
    localStorage.setItem("collection", JSON.stringify(gameState.jokerCollection))
    localStorage.setItem("seenJokers", JSON.stringify(gameState.seenJokers))
    localStorage.setItem("seenSubEffects", JSON.stringify(gameState.seenSubEffects))
    localStorage.setItem("timesBooted", gameState.timesBooted);
    localStorage.setItem("startTime", gameState.startTime.getTime());
    localStorage.setItem("recovery", JSON.stringify(gameState));

    document.getElementById('target').textContent = gameState.targetScore;
    document.getElementById('hands').textContent = gameState.handsLeft;
    document.getElementById('discards').textContent = gameState.discardsLeft;
    document.getElementById('round').textContent = gameState.round;
    document.getElementById('money').textContent = `$${gameState.money}`;
    document.getElementById('money-store').textContent = `$${gameState.money}`;
    document.getElementById('blind-score').textContent = gameState.targetScore;
    document.getElementById('hand-name').textContent = 'Selecciona cartas';
    document.getElementById('hand-score').textContent = 'Puntos: 0 | Mult: 0';
    document.getElementById('hand-score-points').textContent = '0';
    document.getElementById('hand-score-mult').textContent = '0';

    // MEJORA: Se actualiza directamente el elemento #deck-count para no borrarlo.
    const deckCountElement = document.getElementById('deck-count');
    if (deckCountElement) {
        deckCountElement.textContent = `${gameState.deck.length}/52`;
        console.log("[boot_menu.js] Deck count updated in UI:", gameState.deck.length);
    }

    console.log("[boot_menu.js] UI updated with current game state.");
    renderJokers();
}
function renderJokers() {
    const jokerContainer = document.getElementById('joker-container');
    jokerContainer.innerHTML = '';
    gameState.jokersOwned.forEach((joker, index) => {
        const jokerElement = document.createElement('div');
        jokerElement.className = `joker-card ${joker.rarity} ${joker.subEffect ? joker.subEffect.visual : ''}`;
        jokerElement.style.backgroundImage = `url(${joker.image})`;
        jokerElement.dataset.index = index;
        jokerElement.title = `${joker.name}\n${joker.description}\nRarity: ${joker.rarity}${joker.subEffect ? `\nSub-Efecto: ${joker.subEffect.name}` : ''}`;
        jokerElement.addEventListener('click', () => {
            console.log("[boot_menu.js] In-game joker clicked:", joker.name);
            showJokerInfoModal(joker, index, false);
        });
        jokerContainer.appendChild(jokerElement);
    });
    console.log("[boot_menu.js] Jokers rendered:", gameState.jokersOwned.map(j => j.name));
}

function showJokerInfoModal(joker, index, isShop) {
    const modal = document.createElement('div');
    modal.className = 'modal joker-info-modal';
    const subEffectText = joker.subEffect
        ? `<p><strong>Sub-Efecto:</strong> ${joker.subEffect.name} - ${joker.subEffect.description || 'Efecto especial'}</p>`
        : '';
    const sellButton = isShop
        ? `<button class="btn-sell-joker" onclick="sellJoker(${index})">Vender $${Math.ceil(joker.cost / 2)}</button>`
        : '';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>${joker.name}</h2>
            <div class="joker-info-content">
                <div class="preview-joker-card-container">
                    <div class="preview-joker-card ${joker.rarity} ${joker.subEffect ? joker.subEffect.visual : ''}" 
                         style="background-image: url('${joker.image}')"></div>
                </div>
                <div class="joker-info-details">
                    <p><strong>Descripción:</strong> ${joker.description}</p>
                    <p><strong>Rareza:</strong> ${joker.rarity}</p>
                    ${subEffectText}
                    ${sellButton}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    console.log("[boot_menu.js] Joker info modal shown for:", joker.name, "In shop:", isShop);
}

function sellJoker(index) {
    const joker = gameState.jokersOwned[index];
    if (!joker) {
        console.error("[boot_menu.js] No joker found at index:", index);
        return;
    }
    const sellPrice = Math.ceil(joker.cost / 2);
    gameState.money += sellPrice;
    gameState.jokersOwned.splice(index, 1);
    updateUI();
    renderShopJokers(); // Refresh shop footer to update small jokers
    showNotification(`¡Vendiste ${joker.name} por $${sellPrice}!`, 1500 * gameState.animationSpeed);
    document.querySelector('.joker-info-modal').remove();
    console.log("[boot_menu.js] Joker sold:", joker.name, "Gained:", sellPrice, "New money:", gameState.money);
}
// Function to render jokers in the UI
function renderShopJokers() {
    const shopOptions = document.querySelector('.shop-options');
    shopOptions.innerHTML = '';
    gameState.shopJokers.forEach((joker, index) => {
        const jokerButton = document.createElement('div');
        jokerButton.className = `shop-joker-card ${joker.rarity} ${joker.subEffect ? joker.subEffect.visual : ''}`;
        jokerButton.style.backgroundImage = `url(${joker.image})`;
        jokerButton.dataset.jokerIndex = index;
        jokerButton.title = `${joker.name}\n${joker.description}\nRarity: ${joker.rarity}${joker.subEffect ? `\nSub-Efecto: ${joker.subEffect.name}` : ''}`;
        jokerButton.addEventListener('click', () => {
            console.log("[boot_menu.js] Shop joker clicked:", joker.name);
            previewJoker(index);
        });
        shopOptions.appendChild(jokerButton);
    });

    // Render small jokers in shop footer
    const shopFooter = document.querySelector('.shop-footer');
    const existingSmallJokers = shopFooter.querySelector('.small-jokers-container');
    if (existingSmallJokers) existingSmallJokers.remove();
    const smallJokersContainer = document.createElement('div');
    smallJokersContainer.className = 'small-jokers-container';
    gameState.jokersOwned.forEach((joker, index) => {
        const smallJoker = document.createElement('div');
        smallJoker.className = `small-joker-card ${joker.rarity} ${joker.subEffect ? joker.subEffect.visual : ''}`;
        smallJoker.style.backgroundImage = `url(${joker.image})`;
        smallJoker.dataset.jokerIndex = index;
        smallJoker.title = `${joker.name}\n${joker.description}\nRarity: ${joker.rarity}${joker.subEffect ? `\nSub-Efecto: ${joker.subEffect.name}` : ''}`;
        smallJoker.addEventListener('click', () => {
            console.log("[boot_menu.js] Small joker clicked in shop footer:", joker.name);
            showJokerInfoModal(joker, index, true);
        });
        smallJokersContainer.appendChild(smallJoker);
    });
    const moneyBox = shopFooter.querySelector('.money-box');
    shopFooter.insertBefore(smallJokersContainer, moneyBox.nextSibling);

    console.log("[boot_menu.js] Shop jokers rendered:", gameState.shopJokers.map(j => j.name));
    if (gameState.shopJokers.length > 0) {
        previewJoker(0);
    } else {
        document.getElementById('shop-preview-area').innerHTML = `<p class="shop-preview-placeholder">No hay jokers disponibles.</p>`;
    }
}
// Function to go back to the main boot menu
function goToMenu() {
    updateUI()
    document.querySelector('.boot-menu-main').style.display = 'block';
    document.querySelector('.boot-menu-start-game').style.display = 'none';
    document.querySelector('.shop-menu').style.display = 'none';
    document.querySelector('.play-area').style.display = 'none';
    document.querySelector('.left-panel').style.display = 'none';
    document.querySelector('.right-panel').style.display = 'none';
    console.log("[boot_menu.js] Returned to main boot menu. Game and shop panels hidden.");
}

// Function to show the next round shop menu
function nextRoundMenu() {
    gameState.score = 0
    gameState.money = + gameState.nextBlindReward
    //document.querySelector('.game-container').style.display = 'none'; ??? wtf
    document.querySelector('.boot-menu-start-game').style.display = 'none';
    document.querySelector('.shop-menu').style.display = 'none';
    document.querySelector('.play-area').style.display = 'none';
    document.querySelector('.left-panel').style.display = 'none';
    document.querySelector('.right-panel').style.display = 'none';

    document.querySelector('.shop-menu').style.display = 'flex';
    gameState.round++;
    gameState.recovery = true;
    let shuffledJokers = availableJokers.sort(() => Math.random() - 0.5);
    gameState.shopJokers = assignSubEffectsToShopJokers(shuffledJokers.slice(0, 2));
    const hasBlackCard = gameState.shopJokers.some(joker => joker.rarity === 'black card');
    const shopMenu = document.querySelector('.shop-menu');
    const celestialMusic = document.getElementById('music-celestial');
    if (hasBlackCard) {
        shopMenu.classList.add('black-card-background');
        transitionToMusic("celestial", duration = 500)
        console.log("[boot_menu.js] Black card detected in shop, playing celestial music and changing background");
    } else {
        shopMenu.classList.remove('black-card-background');
        transitionToMusic("shop", 2000)
    }
    updateUI();
    renderShopJokers()
    console.log("[boot_menu.js] Shop opened for round:", gameState.round);
}
// Function to buy items in the shop
function buyItem(itemType) {
    updateUI();
    renderShopJokers()
    let cost = 0;

    if (itemType.startsWith('joker_')) {
        const jokerIndex = parseInt(itemType.split('_')[1], 10);
        const jokerData = gameState.shopJokers[jokerIndex];

        if (!jokerData || gameState.jokersOwned.length >= 6) {
            console.error("[boot_menu.js] Invalid purchase or joker slots full for joker:", jokerData?.name);
            showNotification("No se puede completar la compra.", 1500 * gameState.animationSpeed);
            return;
        }

        const isOwned = gameState.jokersOwned.some(j => j.name === jokerData.name && (!j.subEffect || !jokerData.subEffect || j.subEffect.id === jokerData.subEffect.id));
        cost = isOwned ? Math.ceil(jokerData.cost / 2) : jokerData.cost;

        if (gameState.money < cost) {
            console.error("[boot_menu.js] Insufficient funds for joker:", jokerData.name);
            showNotification("No tienes suficiente dinero.", 1500 * gameState.animationSpeed);
            return;
        }

        const effectFunction = window[jokerData.id + '_effect'];

        if (typeof effectFunction === 'function') {
            gameState.money -= cost;
            if (isOwned) {
                // Replace existing joker with the new version
                gameState.jokersOwned = gameState.jokersOwned.filter(j => j.name !== jokerData.name);
            }
            gameState.jokersOwned.push({
                ...jokerData,
                effect: effectFunction,
                subEffect: jokerData.subEffect
            });
            if (jokerData.rarity === 'black card' && !gameState.ownedBlackCards.includes(jokerData.id)) {
                gameState.ownedBlackCards.push(jokerData.id);
                console.log("[boot_menu.js] Black card owned:", jokerData.name);
            }
            updateUI();
            updateUI();
            renderShopJokers()
            showNotification(`¡Compraste ${jokerData.name}${jokerData.subEffect ? ` (${jokerData.subEffect.name})` : ''}!`, 1500 * gameState.animationSpeed);
            previewJoker(jokerIndex); // Refresh preview to update button state
        } else {
            console.error(`[boot_menu.js] Error: Function '${jokerData.id}_effect' not found in script ${jokerData.script}.`);
        }
    }

    // Logic for other items (discard, hand)
    switch (itemType) {
        case 'discard':
            cost = 3;
            if (gameState.money >= cost) {
                gameState.money -= cost;
                gameState.discardsLeft++;
                showNotification("Mejoraste tus descartes!", 1500 * gameState.animationSpeed);
            }
            break;
        case 'hand':
            cost = 4;
            if (gameState.money >= cost) {
                gameState.money -= cost;
                gameState.handsLeft++;
                showNotification("Aumentaste tus manos!", 1500 * gameState.animationSpeed);
            }
            break;
        default: return;
    }

    if (gameState.money < cost && !itemType.startsWith('joker_')) {
        showNotification("No tienes suficiente dinero.", 1500 * gameState.animationSpeed);
    }

    updateUI();
    renderShopJokers()
}
// Function to continue game from shop
function continueGame() {
    transitionToMusic("main");
    console.log("[boot_menu.js] Continuing to next round...");

    // Increment round and set up next blind
    //gameState.round++;
    gameState.targetScore = Math.floor(gameState.targetScore * 1.6);
    gameState.handsLeft = 4;
    gameState.discardsLeft = 3;
    gameState.deck = [];
    gameState.hand = [];
    gameState.selectedCards = [];

    // Update blind target score and reward
    gameState.nextBlindTargetScore = gameState.targetScore;
    //gameState.money += gameState.nextBlindReward;

    // Hide the shop menu
    document.querySelector('.shop-menu').style.display = 'none';

    // Re-initialize game
    startingGame();
    console.log("[boot_menu.js] Shop menu hidden, game resumed for round:", gameState.round);
}

// Functions to show/hide combinations modal
function showCombinations() {
    document.getElementById('combinations-modal').style.display = 'flex';
    console.log("[boot_menu.js] Combinations modal shown.");
}

function closeCombinations() {
    document.getElementById('combinations-modal').style.display = 'none';
    console.log("[boot_menu.js] Combinations modal hidden.");
}

// Function to exit game
function exitGame() {
    showNotification("Saliendo del juego. ¡Gracias por jugar!", gameState.animationSpeed === 0 ? 0 : 1500 * gameState.animationSpeed);
    console.log("[boot_menu.js] Game exited by user.");
    setTimeout(() => {
        window.close();
    }, gameState.animationSpeed === 0 ? 0 : 1500 * gameState.animationSpeed);
}

// Function to show start game menu
function showStartGameMenu() {
    document.querySelector('.boot-menu-main').style.display = 'none';
    document.querySelector('.boot-menu-start-game').style.display = 'block';
    console.log("[boot_menu.js] Showing start game menu.");
}

// Function to restart game
function restartGame(data = null) {
    if (data === null) {
        const collection = gameState.jokerCollection;
        const seenJokers = gameState.seenJokers;
        const seenSubEffects = gameState.seenSubEffects;

        gameState = {
            score: 0,
            round: 0,
            handsLeft: 4,
            discardsLeft: 3,
            targetScore: 300,
            money: 4,
            deck: [],
            hand: [],
            selectedCards: [],
            deckType: 'standard',
            difficulty: 'easy',
            jokerCollection: collection,
            nextBlindTargetScore: 300,
            nextBlindReward: 10,
            animationSpeed: 1,
            jokersOwned: [],
            shopJokers: [],
            seenSubEffects: seenSubEffects, 
            seenJokers: seenJokers, 
            ownedBlackCards: [], 
            timesBooted: 0,
            startTime: new Date(),
            completionPercentage: 0,
            recovery: false
        };
        localStorage.removeItem('recovery');
        console.log("[boot_menu.js] --- Restarting Game ---");
    } else {
        console.log("[boot_menu.js] --- Starting new blind with provided data ---");
        gameState = { ...gameState, ...data };
    }

    document.getElementById('game-over').style.display = 'none';
    document.querySelector('.boot-menu').style.display = 'block';
    document.querySelector('.boot-menu-main').style.display = 'block';
    document.querySelector('.play-area').style.display = 'none';
    document.querySelector('.left-panel').style.display = 'none';
    document.querySelector('.right-panel').style.display = 'none';
    updateUI();
}

// Function to show collection
function showCollection() {
    showNotification("Aquí se mostraría tu colección. 😎 (Próximamente)", gameState.animationSpeed === 0 ? 0 : 1500 * gameState.animationSpeed);
}

// Initial setup: hide game elements and show only the main boot menu
document.querySelector(".play-area").style.display = "none";
document.querySelector(".left-panel").style.display = "none";
document.querySelector(".right-panel").style.display = "none";
document.querySelector(".boot-menu-start-game").style.display = "none";
document.querySelector(".shop-menu").style.display = "none";
document.querySelector(".boot-menu-main").style.display = "block";
console.log("[boot_menu.js] Initial UI setup complete. Only main boot menu visible.");

// Mostrar logo de entrada primero
document.querySelector(".play-area").style.display = "none";
document.querySelector(".left-panel").style.display = "none";
document.querySelector(".right-panel").style.display = "none";
document.querySelector(".boot-menu").style.display = "none";
document.querySelector(".shop-menu").style.display = "none";
document.getElementById("intro-logo").style.display = "flex";
console.log("[boot_menu.js] Intro logo displayed. Waiting for user to enter main menu.");

// Enviar en logs cuando todo esta cargado en dom!
window.addEventListener('load', () => {
    setTimeout(() => {
        console.log("[boot_menu.js] All resources finished loading (window 'load' event).");
    document.getElementsByClassName("loading-joker")[0].style.display = "none"
    }, 3000);
});

// Avanzar al menú principal tras click en logo
function enterMainMenu() {
    const introLogo = document.getElementById("intro-logo");
    const bootMenu = document.querySelector(".boot-menu");

    // Fade out intro-logo
    introLogo.classList.add("fade-out");
    const menu = document.querySelector('.boot-menu');
    setTimeout(() => {
        const menu = document.querySelector('.boot-menu');
        if (!menu.classList.contains('show')) {
            menu.classList.toggle('show');
            console.log("main menu!");
        }
    }, 3000);

    setTimeout(() => {
        introLogo.style.display = "none";
        bootMenu.style.display = "block";
        
        console.log("[boot_menu.js] Entered main menu from intro logo.");
        startMusicSystem();
        loadJokerScripts();

        try {
            // Get values from localStorage, fallback to '[]' if missing or invalid
            let collection = localStorage.getItem("collection");
            let seenJokers = localStorage.getItem("seenJokers");
            let seenSubEffects = localStorage.getItem("seenSubEffects");
            let timesBooted = localStorage.getItem("timesBooted");
            let startTime = localStorage.getItem("startTime");

            // Parse or fallback to empty array
            gameState.jokerCollection = (collection && collection !== 'null' && collection !== 'undefined')
                ? JSON.parse(collection)
                : [];
            if (!Array.isArray(gameState.jokerCollection)) gameState.jokerCollection = [];

            gameState.seenJokers = (seenJokers && seenJokers !== 'null' && seenJokers !== 'undefined')
                ? JSON.parse(seenJokers)
                : [];
            if (!Array.isArray(gameState.seenJokers)) gameState.seenJokers = [];

            gameState.seenSubEffects = (seenSubEffects && seenSubEffects !== 'null' && seenSubEffects !== 'undefined')
                ? JSON.parse(seenSubEffects)
                : [];
            if (!Array.isArray(gameState.seenSubEffects)) gameState.seenSubEffects = [];

            gameState.timesBooted = timesBooted ? parseInt(timesBooted, 10) : 0;
            gameState.startTime = (startTime && !isNaN(parseInt(startTime, 10))) ? new Date(parseInt(startTime, 10)) : new Date();

            // Check for recovery data
            let recoveryData = localStorage.getItem("recovery");
            if (recoveryData) {
                try {
                    let parsedRecovery = JSON.parse(recoveryData);
                    if (parsedRecovery && typeof parsedRecovery === 'object' && parsedRecovery.score !== undefined && parsedRecovery.score !== 0) {
                        gameState.recovery = true;
                        console.log(`[boot_menu.js] Valid recovery found! Score: ${parsedRecovery.score}, Round: ${parsedRecovery.round}.`);
                    } else {
                        gameState.recovery = false; // Invalid or score is 0
                        console.log("[boot_menu.js] Recovery data found but is invalid or score is 0. Not enabling recovery.");
                    }
                } catch (e) {
                    gameState.recovery = false; // Parsing error
                    console.error("[boot_menu.js] Error parsing recovery data from localStorage:", e);
                }
            } else {
                gameState.recovery = false; // No recovery data found
            }

            // Check for null/undefined after parsing
            if (
                gameState.jokerCollection == null ||
                gameState.seenJokers == null ||
                gameState.seenSubEffects == null
            ) {
                gameState.jokerCollection = [];
                gameState.seenJokers = [];
                gameState.seenSubEffects = [];
                console.warn("[boot_menu.js] WARNING: Some loaded data is null or corrupted. Data reset to empty arrays.");
            } else {
                console.log("[boot_menu.js] jokers encontrados cargados!");
            }
        } catch (error) {
            // On error, reset to empty arrays
            gameState.jokerCollection = [];
            gameState.seenJokers = [];
            gameState.seenSubEffects = [];
            gameState.timesBooted = 0;
            gameState.startTime = new Date();
            gameState.recovery = false; // Ensure recovery is false on error
            console.log("[boot_menu.js] ERROR: jokers encontrados no cargados!", error);
        }
        const menu = document.querySelector('.boot-menu');
            menu.classList.toggle('show');

        // Check for recovery state and redirect
        if (gameState.recovery) {
            document.querySelector('.boot-menu').style.display = 'none';
            document.getElementById('recovery-menu').style.display = 'flex';
            console.log("[boot_menu.js] Redirecting to recovery menu.");
            // Initialize recovery menu content
            const recoveryData = localStorage.getItem('recovery');
            const recoveryInfoElement = document.getElementById('recovery-info');
            const loadRecoveryBtn = document.getElementById('load-recovery-btn');

            if (recoveryData) {
                try {
                    const parsedData = JSON.parse(recoveryData);
                    if (parsedData && typeof parsedData === 'object' && parsedData.score !== undefined) {
                        recoveryInfoElement.textContent = 'Recovery data found. Score: ' + parsedData.score + ', Round: ' + parsedData.round;
                        loadRecoveryBtn.disabled = false;
                    } else {
                        recoveryInfoElement.textContent = 'Corrupted recovery data found. Starting new game is recommended.';
                    }
                } catch (e) {
                    recoveryInfoElement.textContent = 'Error parsing recovery data. Starting new game is recommended.';
                    console.error('Error parsing recovery data:', e);
                }
            } else {
                recoveryInfoElement.textContent = 'No recovery data found. Please start a new game.';
            }
        } else {
            document.querySelector('.boot-menu-main').style.display = 'block';
        }
    }, 1000); // Match CSS transition duration
}

function loadRecoveryGame() {
    const recoveryData = localStorage.getItem('recovery');
    if (recoveryData) {
        try {
            const parsedData = JSON.parse(recoveryData);
            Object.assign(gameState, parsedData);
            console.log('Game state loaded from recovery:', gameState);
            document.getElementById('recovery-menu').style.display = 'none';
            // Assuming we go to the shop after loading a game
            nextRoundMenu();
        } catch (e) {
            console.error('Failed to load recovery game:', e);
            alert('Failed to load recovery game. Starting a new game.');
            startNewGame();
        }
    }
}

function startNewGame() {
    localStorage.removeItem('recovery'); // Clear any existing recovery data
    document.getElementById('recovery-menu').style.display = 'none';
    // Reset gameState to default values for a new game
    restartGame(); // Call restartGame to re-initialize gameState and show main menu
}

document.addEventListener('DOMContentLoaded', () => {
    setBg("main")
    //startMusicSystem();
    // Play, Discard, and Sort buttons
    const playButton = document.getElementById('play-btn');
    if (playButton) {
        playButton.addEventListener('click', () => {
            console.log("[boot_menu.js] Play Hand button clicked");
            playHand();
        });
    }

    const discardButton = document.getElementById('discard-btn');
    if (discardButton) {
        discardButton.addEventListener('click', () => {
            console.log("[boot_menu.js] Discard button clicked");
            discardSelected();
        });
    }

    const sortTypesButton = document.getElementById('sort-types');
    if (sortTypesButton) {
        sortTypesButton.addEventListener('click', () => {
            console.log("[boot_menu.js] Sorting by suite type");
            gameState.organize = 'suits';
            sortBySuiteType();
        });
    }

    const sortPairsButton = document.getElementById('sort-pairs');
    if (sortPairsButton) {
        sortPairsButton.addEventListener('click', () => {
            console.log("[boot_menu.js] Sorting by pairs");
            gameState.organize = 'pairs';
            sortByPairs();
        });
    }

    console.log("[boot_menu.js] Core game event listeners attached.");

    // Add event listener for intro-logo click
    document.getElementById("intro-logo").addEventListener("click", enterMainMenu);
});