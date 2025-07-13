function log(message) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${message}`);
}

log("[boot_menu.js] boot_menu.js loaded");
log("[boot_menu.js] Starting boot menu...");



// Initial game state (default values)
let gameState = {};

function initCoreSystems() {
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
        jokerCollection: 'none',
        nextBlindTargetScore: 300,
        nextBlindReward: 10,
        animationSpeed: 1,
        jokersOwned: [],
        shopJokers: [],
        seenSubEffects: [],
        seenJokers: [],
        ownedBlackCards: [],
        timesBooted: 0,
        startTime: null,
        completionPercentage: 0,
        recovery: false,
        enableXAnimation: true,
        settings: {
            deckType: 'blue',
            difficulty: 'normal',
            masterVolume: 100,
            musicEnabled: true,
            sfxEnabled: true,
            animationSpeed: 1,
            backgroundTheme: 'main',
            jokerCollection: 'none'
        }
    };
    log("[boot_menu.js] Core systems initialized.");
}
   
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
        id: 'damage',
        name: 'rota',
        description: 'Disminulle chips en -20.',
        effect: (points, mult) => ({ points: points - 20 }),
        probability: 0.20,
        costMultiplier: -1.5,
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
        probability: 0.05,
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
        probability: 0.02,
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
        probability: 0.03,
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
                log("[boot_menu.js] Glass sub-effect broke!");
                return null; // Card breaks, no effect
            }
            return { points: points * 4, mult: mult * 4 };
        },
        probability: 0.09,
        costMultiplier: 2.5,
        visual: 'glass-effect'
    }
];

const availableAddId = [
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
        id: 'jolly_joker',
        name: 'Joker Alegre',
        rarity: 'common',
        description: '+8 Mult si la mano jugada contiene un Par.',
        cost: 3,
        image: './images/jokers/joker.png',
        script: './jokers/jolly_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'zany_joker',
        name: 'Joker Chiflado',
        rarity: 'common',
        description: '+12 Mult si la mano jugada contiene un Trío.',
        cost: 4,
        image: './images/jokers/joker.png',
        script: './jokers/zany_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'mad_joker',
        name: 'Joker Loco',
        rarity: 'common',
        description: '+10 Mult si la mano jugada contiene un Doble Par.',
        cost: 4,
        image: './images/jokers/joker.png',
        script: './jokers/mad_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'crazy_joker',
        name: 'Joker Demente',
        rarity: 'common',
        description: '+12 Mult si la mano jugada contiene una Escalera.',
        cost: 4,
        image: './images/jokers/joker.png',
        script: './jokers/crazy_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'droll_joker',
        name: 'Joker Gracioso',
        rarity: 'common',
        description: '+10 Mult si la mano jugada contiene un Color.',
        cost: 4,
        image: './images/jokers/joker.png',
        script: './jokers/droll_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'sly_joker',
        name: 'Joker Astuto',
        rarity: 'common',
        description: '+50 Fichas si la mano jugada contiene un Par.',
        cost: 3,
        image: './images/jokers/joker.png',
        script: './jokers/sly_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'wily_joker',
        name: 'Joker Artero',
        rarity: 'common',
        description: '+100 Fichas si la mano jugada contiene un Trío.',
        cost: 4,
        image: './images/jokers/joker.png',
        script: './jokers/wily_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'clever_joker',
        name: 'Joker Ingenioso',
        rarity: 'common',
        description: '+80 Fichas si la mano jugada contiene un Doble Par.',
        cost: 4,
        image: './images/jokers/joker.png',
        script: './jokers/clever_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'devious_joker',
        name: 'Joker Retorcido',
        rarity: 'common',
        description: '+100 Fichas si la mano jugada contiene una Escalera.',
        cost: 4,
        image: './images/jokers/joker.png',
        script: './jokers/devious_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'crafty_joker',
        name: 'Joker Hábil',
        rarity: 'common',
        description: '+80 Fichas si la mano jugada contiene un Color.',
        cost: 4,
        image: './images/jokers/joker.png',
        script: './jokers/crafty_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'half_joker',
        name: 'Medio Joker',
        rarity: 'common',
        description: '+20 Mult si la mano jugada contiene 3 o menos cartas.',
        cost: 5,
        image: './images/jokers/joker.png',
        script: './jokers/half_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'scary_face',
        name: 'Cara de Miedo',
        rarity: 'common',
        description: 'Las figuras jugadas otorgan +30 Fichas al puntuar.',
        cost: 4,
        image: './images/jokers/joker.png',
        script: './jokers/scary_face.js',
        canHaveSubEffect: true
    },
    {
        id: 'even_steven',
        name: 'Steven el Par',
        rarity: 'common',
        description: 'Las cartas con rango par jugadas otorgan +4 Mult al puntuar.',
        cost: 4,
        image: './images/jokers/joker.png',
        script: './jokers/even_steven.js',
        canHaveSubEffect: true
    },
    {
        id: 'odd_todd',
        name: 'Todd el Impar',
        rarity: 'common',
        description: 'Las cartas con rango impar jugadas otorgan +31 Fichas al puntuar.',
        cost: 4,
        image: './images/jokers/joker.png',
        script: './jokers/odd_todd.js',
        canHaveSubEffect: true
    },
    {
        id: 'scholar',
        name: 'Erudito',
        rarity: 'common',
        description: 'Los Ases jugados otorgan +20 Fichas y +4 Mult al puntuar.',
        cost: 4,
        image: './images/jokers/joker.png',
        script: './jokers/scholar.js',
        canHaveSubEffect: true
    },
    {
        id: 'smiley_face',
        name: 'Cara Sonriente',
        rarity: 'common',
        description: 'Las figuras jugadas otorgan +5 Mult al puntuar.',
        cost: 4,
        image: './images/jokers/happy_face.png',
        script: './jokers/smiley_face.js',
        canHaveSubEffect: true
    },
    {
        id: 'walkie_talkie',
        name: 'Walkie Talkie',
        rarity: 'common',
        description: 'Cada 10 o 4 jugado otorga +10 Fichas y +4 Mult al puntuar.',
        cost: 4,
        image: './images/jokers/joker.png',
        script: './jokers/walkie_talkie.js',
        canHaveSubEffect: true
    },
    {
        id: 'abstract_joker',
        name: 'Joker Abstracto',
        rarity: 'common',
        description: '+3 Mult por cada carta de Joker.',
        cost: 4,
        image: './images/jokers/joker.png',
        script: './jokers/abstract_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'fibonacci',
        name: 'Fibonacci',
        rarity: 'uncommon',
        description: 'Cada As, 2, 3, 5 u 8 jugado otorga +8 Mult al puntuar.',
        cost: 8,
        image: './images/jokers/joker.png',
        script: './jokers/fibonacci.js',
        canHaveSubEffect: true
    },
    {
        id: 'steel_joker',
        name: 'Joker de Acero',
        rarity: 'uncommon',
        description: 'Otorga X0.2 Mult por cada Carta de Acero en tu mazo completo.',
        cost: 7,
        image: './images/jokers/joker.png',
        script: './jokers/steel_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'gros_michel',
        name: 'Gros Michel',
        rarity: 'common',
        description: '+15 Mult. 1 de cada 6 posibilidades de que se destruya al final de la ronda.',
        cost: 5,
        image: './images/jokers/joker.png',
        script: './jokers/gros_michel.js',
        canHaveSubEffect: true
    },
    {
        id: 'business_card',
        name: 'Tarjeta de Visita',
        rarity: 'common',
        description: 'Las figuras jugadas tienen 1 de 2 posibilidades de dar $2 al puntuar.',
        cost: 4,
        image: './images/jokers/joker.png',
        script: './jokers/business_card.js',
        canHaveSubEffect: true
    },
    {
        id: 'supernova',
        name: 'Supernova',
        rarity: 'common',
        description: 'Añade al Mult el número de veces que se ha jugado la mano de póquer en esta ronda.',
        cost: 5,
        image: './images/jokers/supernoba.png',
        script: './jokers/supernova.js',
        canHaveSubEffect: true
    },
    {
        id: 'ride_the_bus',
        name: 'Sube al Autobús',
        rarity: 'common',
        description: 'Este Joker gana +1 Mult por cada mano consecutiva jugada sin una figura puntuable.',
        cost: 6,
        image: './images/jokers/joker.png',
        script: './jokers/ride_the_bus.js',
        canHaveSubEffect: true
    },
    {
        id: 'blackboard',
        name: 'Pizarra',
        rarity: 'uncommon',
        description: 'X3 Mult si todas las cartas en la mano son Picas o Tréboles.',
        cost: 6,
        image: './images/jokers/joker.png',
        script: './jokers/blackboard.js',
        canHaveSubEffect: true
    },
    {
        id: 'runner',
        name: 'Corredor',
        rarity: 'common',
        description: 'Gana +15 Fichas si la mano jugada contiene una Escalera.',
        cost: 5,
        image: './images/jokers/joker.png',
        script: './jokers/runner.js',
        canHaveSubEffect: true
    },
    {
        id: 'ice_cream',
        name: 'Helado',
        rarity: 'common',
        description: '+100 Fichas. -5 Fichas por cada mano jugada.',
        cost: 5,
        image: './images/jokers/ice_cream.png',
        script: './jokers/ice_cream.js',
        canHaveSubEffect: true
    },
    {
        id: 'blue_joker',
        name: 'Joker Azul',
        rarity: 'common',
        description: '+2 Fichas por cada carta restante en el mazo.',
        cost: 5,
        image: './images/jokers/Blue_Deck.png',
        script: './jokers/blue_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'constellation',
        name: 'Constelación',
        rarity: 'uncommon',
        description: 'Este Joker gana X0.1 Mult cada vez que se usa una carta de Planeta.',
        cost: 6,
        image: './images/jokers/joker.png',
        script: './jokers/constellation.js',
        canHaveSubEffect: true
    },
    {
        id: 'hiker',
        name: 'Excursionista',
        rarity: 'uncommon',
        description: 'Cada carta jugada gana permanentemente +5 Fichas al puntuar.',
        cost: 5,
        image: './images/jokers/joker.png',
        script: './jokers/hiker.js',
        canHaveSubEffect: true
    },
    {
        id: 'faceless_joker',
        name: 'Joker sin Cara',
        rarity: 'common',
        description: 'Gana $5 si se descartan 3 o más figuras al mismo tiempo.',
        cost: 4,
        image: './images/jokers/joker.png',
        script: './jokers/faceless_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'green_joker',
        name: 'Joker Verde',
        rarity: 'common',
        description: '+1 Mult por mano jugada. -1 Mult por descarte.',
        cost: 4,
        image: './images/jokers/joker.png',
        script: './jokers/green_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'cavendish',
        name: 'Cavendish',
        rarity: 'common',
        description: 'X3 Mult. 1 de cada 1000 posibilidades de que esta carta se destruya al final de la ronda.',
        cost: 4,
        image: './images/jokers/joker.png',
        script: './jokers/cavendish.js',
        canHaveSubEffect: true
    },
    {
        id: 'card_sharp',
        name: 'Tiburón de las Cartas',
        rarity: 'uncommon',
        description: 'X3 Mult si la mano de póquer jugada ya se ha jugado en esta ronda.',
        cost: 6,
        image: './images/jokers/joker.png',
        script: './jokers/card_sharp.js',
        canHaveSubEffect: true
    },
    {
        id: 'red_card',
        name: 'Tarjeta Roja',
        rarity: 'common',
        description: 'Este Joker gana +3 Mult cuando se salta cualquier Paquete de Refuerzo.',
        cost: 5,
        image: './images/jokers/joker.png',
        script: './jokers/red_card.js',
        canHaveSubEffect: true
    },
    {
        id: 'madness',
        name: 'Locura',
        rarity: 'uncommon',
        description: 'Cuando se selecciona Ciega Pequeña o Ciega Grande, gana X0.5 Mult y destruye un Joker al azar.',
        cost: 7,
        image: './images/jokers/joker.png',
        script: './jokers/madness.js',
        canHaveSubEffect: true
    },
    {
        id: 'square_joker',
        name: 'Joker Cuadrado',
        rarity: 'common',
        description: 'Este Joker gana +4 Fichas si la mano jugada tiene exactamente 4 cartas.',
        cost: 4,
        image: './images/jokers/joker.png',
        script: './jokers/square_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'seance',
        name: 'Sesión de Espiritismo',
        rarity: 'uncommon',
        description: 'Si la mano de póquer es una Escalera de Color, crea una carta Espectral al azar.',
        cost: 6,
        image: './images/jokers/joker.png',
        script: './jokers/seance.js',
        canHaveSubEffect: true
    },
    {
        id: 'vampire',
        name: 'Vampiro',
        rarity: 'uncommon',
        description: 'Este Joker gana X0.1 Mult por cada carta Mejorada puntuable jugada, elimina la Mejora de la carta.',
        cost: 7,
        image: './images/jokers/joker.png',
        script: './jokers/vampire.js',
        canHaveSubEffect: true
    },
    {
        id: 'hologram',
        name: 'Holograma',
        rarity: 'uncommon',
        description: 'Este Joker gana X0.25 Mult cada vez que se añade una carta de juego a tu mazo.',
        cost: 7,
        image: './images/jokers/joker.png',
        script: './jokers/hologram.js',
        canHaveSubEffect: true
    },
    {
        id: 'baron',
        name: 'Barón',
        rarity: 'rare',
        description: 'Cada Rey en la mano da X1.5 Mult.',
        cost: 8,
        image: './images/jokers/joker.png',
        script: './jokers/baron.js',
        canHaveSubEffect: true
    },
    {
        id: 'obelisk',
        name: 'Obelisco',
        rarity: 'rare',
        description: 'Este Joker gana X0.2 Mult por cada mano consecutiva jugada sin jugar tu mano de póquer más jugada.',
        cost: 8,
        image: './images/jokers/joker.png',
        script: './jokers/obelisk.js',
        canHaveSubEffect: true
    },
    {
        id: 'photograph',
        name: 'Fotografía',
        rarity: 'common',
        description: 'La primera figura jugada da X2 Mult al puntuar.',
        cost: 5,
        image: './images/jokers/joker.png',
        script: './jokers/photograph.js',
        canHaveSubEffect: true
    },
    {
        id: 'erosion',
        name: 'Erosión',
        rarity: 'uncommon',
        description: '+4 Mult por cada carta por debajo del tamaño inicial de tu mazo.',
        cost: 6,
        image: './images/jokers/joker.png',
        script: './jokers/erosion.js',
        canHaveSubEffect: true
    },
    {
        id: 'fortune_teller',
        name: 'Adivino',
        rarity: 'common',
        description: '+1 Mult por cada carta de Tarot usada en esta ronda.',
        cost: 6,
        image: './images/jokers/joker.png',
        script: './jokers/fortune_teller.js',
        canHaveSubEffect: true
    },
    {
        id: 'stone_joker',
        name: 'Joker de Piedra',
        rarity: 'uncommon',
        description: 'Otorga +25 Fichas por cada Carta de Piedra en tu mazo completo.',
        cost: 6,
        image: './images/jokers/joker.png',
        script: './jokers/stone_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'lucky_cat',
        name: 'Gato de la Suerte',
        rarity: 'uncommon',
        description: 'Este Joker gana X0.25 Mult cada vez que una carta de la Suerte se activa con éxito.',
        cost: 6,
        image: './images/jokers/joker.png',
        script: './jokers/lucky_cat.js',
        canHaveSubEffect: true
    },
    {
        id: 'baseball_card',
        name: 'Cromo de Béisbol',
        rarity: 'rare',
        description: 'Los Jokers Poco Comunes dan cada uno X1.5 Mult.',
        cost: 8,
        image: './images/jokers/joker.png',
        script: './jokers/baseball_card.js',
        canHaveSubEffect: true
    },
    {
        id: 'bull',
        name: 'Toro',
        rarity: 'uncommon',
        description: '+2 Fichas por cada $1 que tengas.',
        cost: 6,
        image: './images/jokers/joker.png',
        script: './jokers/bull.js',
        canHaveSubEffect: true
    },
    {
        id: 'flash_card',
        name: 'Tarjeta Flash',
        rarity: 'uncommon',
        description: 'Este Joker gana +2 Mult por cada reroll en la tienda.',
        cost: 5,
        image: './images/jokers/joker.png',
        script: './jokers/flash_card.js',
        canHaveSubEffect: true
    },
    {
        id: 'popcorn',
        name: 'Palomitas',
        rarity: 'common',
        description: '+20 Mult. -4 Mult por ronda jugada.',
        cost: 5,
        image: './images/jokers/joker.png',
        script: './jokers/popcorn.js',
        canHaveSubEffect: true
    },
    {
        id: 'spare_trousers',
        name: 'Pantalones de Repuesto',
        rarity: 'uncommon',
        description: 'Este Joker gana +2 Mult si la mano jugada contiene un Doble Par.',
        cost: 6,
        image: './images/jokers/joker.png',
        script: './jokers/spare_trousers.js',
        canHaveSubEffect: true
    },
    {
        id: 'ancient_joker',
        name: 'Joker Antiguo',
        rarity: 'rare',
        description: 'Cada carta jugada con [palo] da X1.5 Mult al puntuar, el palo cambia al final de la ronda.',
        cost: 8,
        image: './images/jokers/joker.png',
        script: './jokers/ancient_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'ramen',
        name: 'Ramen',
        rarity: 'uncommon',
        description: 'X2 Mult, pierde X0.01 Mult por carta descartada.',
        cost: 6,
        image: './images/jokers/joker.png',
        script: './jokers/ramen.js',
        canHaveSubEffect: true
    },
    {
        id: 'seltzer',
        name: 'Seltzer',
        rarity: 'uncommon',
        description: 'Re-activa todas las cartas jugadas durante las próximas 10 manos.',
        cost: 6,
        image: './images/jokers/joker.png',
        script: './jokers/seltzer.js',
        canHaveSubEffect: true
    },
    {
        id: 'castle',
        name: 'Castillo',
        rarity: 'uncommon',
        description: 'Este Joker gana +3 Fichas por cada carta de [palo] descartada, el palo cambia cada ronda.',
        cost: 6,
        image: './images/jokers/joker.png',
        script: './jokers/castle.js',
        canHaveSubEffect: true
    },
    {
        id: 'campfire',
        name: 'Hoguera',
        rarity: 'rare',
        description: 'Este Joker gana X0.25 Mult por cada carta vendida, se reinicia cuando se derrota a la Ciega Jefe.',
        cost: 9,
        image: './images/jokers/joker.png',
        script: './jokers/campfire.js',
        canHaveSubEffect: true
    },
    {
        id: 'golden_ticket',
        name: 'Boleto Dorado',
        rarity: 'common',
        description: 'Las cartas de Oro jugadas ganan $4 al puntuar.',
        cost: 5,
        image: './images/jokers/joker.png',
        script: './jokers/golden_ticket.js',
        canHaveSubEffect: true
    },
    {
        id: 'acrobat',
        name: 'Acróbata',
        rarity: 'uncommon',
        description: 'X3 Mult en la última mano de la ronda.',
        cost: 6,
        image: './images/jokers/joker.png',
        script: './jokers/acrobat.js',
        canHaveSubEffect: true
    },
    {
        id: 'swashbuckler',
        name: 'Espadachín',
        rarity: 'common',
        description: 'Añade el valor de venta de todos los demás Jokers poseídos al Mult.',
        cost: 4,
        image: './images/jokers/joker.png',
        script: './jokers/swashbuckler.js',
        canHaveSubEffect: true
    },
    {
        id: 'throwback',
        name: 'Retroceso',
        rarity: 'uncommon',
        description: 'X0.25 Mult por cada Ciega saltada en esta ronda.',
        cost: 6,
        image: './images/jokers/joker.png',
        script: './jokers/throwback.js',
        canHaveSubEffect: true
    },
    {
        id: 'rough_gem',
        name: 'Gema en Bruto',
        rarity: 'uncommon',
        description: 'Las cartas jugadas con el palo ♦ ganan $1 al puntuar.',
        cost: 7,
        image: './images/jokers/joker.png',
        script: './jokers/rough_gem.js',
        canHaveSubEffect: true
    },
    {
        id: 'bloodstone',
        name: 'Piedra de Sangre',
        rarity: 'uncommon',
        description: '1 de 2 posibilidades de que las cartas jugadas con el palo ♥ den X1.5 Mult al puntuar.',
        cost: 7,
        image: './images/jokers/joker.png',
        script: './jokers/bloodstone.js',
        canHaveSubEffect: true
    },
    {
        id: 'arrowhead',
        name: 'Punta de Flecha',
        rarity: 'uncommon',
        description: 'Las cartas jugadas con el palo ♠ otorgan +50 Fichas al puntuar.',
        cost: 7,
        image: './images/jokers/joker.png',
        script: './jokers/arrowhead.js',
        canHaveSubEffect: true
    },
    {
        id: 'onyx_agate',
        name: 'Ágata Ónix',
        rarity: 'uncommon',
        description: 'Las cartas jugadas con el palo ♣ otorgan +7 Mult al puntuar.',
        cost: 7,
        image: './images/jokers/joker.png',
        script: './jokers/onyx_agate.js',
        canHaveSubEffect: true
    },
    {
        id: 'glass_joker',
        name: 'Joker de Cristal',
        rarity: 'uncommon',
        description: 'Este Joker gana X0.75 Mult por cada Carta de Cristal que se destruye.',
        cost: 6,
        image: './images/jokers/joker.png',
        script: './jokers/glass_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'flower_pot',
        name: 'Maceta',
        rarity: 'uncommon',
        description: 'X3 Mult si la mano de póquer contiene una carta de ♦, ♣, ♥ y ♠.',
        cost: 6,
        image: './images/jokers/joker.png',
        script: './jokers/flower_pot.js',
        canHaveSubEffect: true
    },
    {
        id: 'wee_joker',
        name: 'Joker Pequeñín',
        rarity: 'rare',
        description: 'Este Joker gana +8 Fichas cuando se puntúa cada 2 jugado.',
        cost: 8,
        image: './images/jokers/joker.png',
        script: './jokers/wee_joker.js',
        canHaveSubEffect: true
    },
    {
        id: 'the_idol',
        name: 'El Ídolo',
        rarity: 'uncommon',
        description: 'Cada [rango] de [palo] jugado da X2 Mult al puntuar. La carta cambia cada ronda.',
        cost: 6,
        image: './images/jokers/joker.png',
        script: './jokers/the_idol.js',
        canHaveSubEffect: true
    },
    {
        id: 'seeing_double',
        name: 'Viendo Doble',
        rarity: 'uncommon',
        description: 'X2 Mult si la mano jugada tiene una carta de ♣ puntuable y una carta puntuable de cualquier otro palo.',
        cost: 6,
        image: './images/jokers/joker.png',
        script: './jokers/seeing_double.js',
        canHaveSubEffect: true
    },
    {
        id: 'hit_the_road',
        name: 'Ponte en Marcha',
        rarity: 'rare',
        description: 'Este Joker gana X0.5 Mult por cada Jack descartado en esta ronda.',
        cost: 8,
        image: './images/jokers/joker.png',
        script: './jokers/hit_the_road.js',
        canHaveSubEffect: true
    },
    {
        id: 'the_duo',
        name: 'El Dúo',
        rarity: 'rare',
        description: 'X2 Mult si la mano jugada contiene un Par.',
        cost: 8,
        image: './images/jokers/joker.png',
        script: './jokers/the_duo.js',
        canHaveSubEffect: true
    },
    {
        id: 'the_trio',
        name: 'El Trío',
        rarity: 'rare',
        description: 'X3 Mult si la mano jugada contiene un Trío.',
        cost: 8,
        image: './images/jokers/joker.png',
        script: './jokers/the_trio.js',
        canHaveSubEffect: true
    },
    {
        id: 'the_family',
        name: 'La Familia',
        rarity: 'rare',
        description: 'X4 Mult si la mano jugada contiene un Cuarteto.',
        cost: 8,
        image: './images/jokers/joker.png',
        script: './jokers/the_family.js',
        canHaveSubEffect: true
    },
    {
        id: 'the_order',
        name: 'La Orden',
        rarity: 'rare',
        description: 'X3 Mult si la mano jugada contiene una Escalera.',
        cost: 8,
        image: './images/jokers/joker.png',
        script: './jokers/the_order.js',
        canHaveSubEffect: true
    },
    {
        id: 'the_tribe',
        name: 'La Tribu',
        rarity: 'rare',
        description: 'X2 Mult si la mano jugada contiene un Color.',
        cost: 8,
        image: './images/jokers/joker.png',
        script: './jokers/the_tribe.js',
        canHaveSubEffect: true
    },
    {
        id: 'stuntman',
        name: 'Doble de Acción',
        rarity: 'rare',
        description: '+250 Fichas, -2 tamaño de mano.',
        cost: 7,
        image: './images/jokers/joker.png',
        script: './jokers/stuntman.js',
        canHaveSubEffect: true
    },
    {
        id: 'shoot_the_moon',
        name: 'Disparar a la Luna',
        rarity: 'common',
        description: 'Cada Reina en la mano da +13 Mult.',
        cost: 5,
        image: './images/jokers/joker.png',
        script: './jokers/shoot_the_moon.js',
        canHaveSubEffect: true
    },
    {
        id: 'drivers_license',
        name: 'Carnet de Conducir',
        rarity: 'rare',
        description: 'X3 Mult si tienes al menos 16 cartas Mejoradas en tu mazo completo.',
        cost: 7,
        image: './images/jokers/joker.png',
        script: './jokers/drivers_license.js',
        canHaveSubEffect: true
    },
    {
        id: 'bootstraps',
        name: 'Tirantes',
        rarity: 'uncommon',
        description: '+2 Mult por cada $5 que tengas.',
        cost: 7,
        image: './images/jokers/joker.png',
        script: './jokers/bootstraps.js',
        canHaveSubEffect: true
    },
    {
        id: 'triboulet',
        name: 'Triboulet',
        rarity: 'legendary',
        description: 'Los Reyes y Reinas jugados dan cada uno X2 Mult al puntuar.',
        cost: 0,
        image: './images/jokers/joker.png',
        script: './jokers/triboulet.js',
        canHaveSubEffect: false
    },
    {
        id: 'yorick',
        name: 'Yorick',
        rarity: 'legendary',
        description: 'Este Joker gana X1 Mult cada 23 cartas descartadas.',
        cost: 0,
        image: './images/jokers/joker.png',
        script: './jokers/yorick.js',
        canHaveSubEffect: false
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
        image: './images/jokers/triple.png',
        script: './jokers/pair.js',
        canHaveSubEffect: true
    },
    {
        id: 'phantom_trio',
        name: 'Penelopeada',
        rarity: 'rare',
        description: 'x2 de multiplicador si la mano jugada contiene doble par.',
        cost: 4,
        image: './images/jokers/tripleA.png',
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
var availableJokers = [];
// Function to add all non-duplicated jokers from availableAddId to availableJokers
function populateAvailableJokers() {
    availableAddId.forEach(joker => {
        if (!availableJokers.some(j => j.id === joker.id)) {
            availableJokers.push(joker);
        } else {
            log('[WARNING] FOUND DUPLICARED, CHECK availableAddId');

        }
    });
}

// Populate availableJokers at startup
populateAvailableJokers();
function assignSubEffectsToShopJokers(jokers) {
    return jokers.map(joker => {
        // Track seen jokers
        if (!gameState.seenJokers.includes(joker.id)) {
            gameState.seenJokers.push(joker.id);
            log(`[boot_menu.js] Joker seen: ${joker.name}`);
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
                    log(`[boot_menu.js] Sub-effect seen: ${subEffect.name}`);
                }
                log(`[boot_menu.js] Assigned sub-effect ${subEffect.name} to joker ${joker.name}`);
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


function animateTransition(outgoingElement, incomingElement, incomingDisplay = 'flex') {
    if (outgoingElement) {
        outgoingElement.classList.add('slide-down-out');
        setTimeout(() => {
            outgoingElement.style.display = 'none';
            outgoingElement.classList.remove('slide-down-out');
        }, 500);
    }

    setTimeout(() => {
        if (incomingElement) {
            incomingElement.style.display = incomingDisplay;
            incomingElement.classList.add('slide-up-in');
            setTimeout(() => {
                incomingElement.classList.remove('slide-up-in');
            }, 500);
        }
    }, outgoingElement ? 500 : 0);
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
    log(`[boot_menu.js] Setting background: ${bgClass}`);
}
// --- NUEVA FUNCIÓN PARA LA VISTA PREVIA ---
function previewJoker(jokerIndex) {
    const previewArea = document.getElementById('shop-preview-area');
    const jokerData = gameState.shopJokers[jokerIndex];

    if (!jokerData) {
        log(`[boot_menu.js] No joker found at index: ${jokerIndex}`);
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
    log(`[boot_menu.js] Preview updated for joker: ${jokerData.name}, Sub-effect: ${jokerData.subEffect?.name || 'None'}`);
}



async function loadJokerScripts(jokers) {
    const loadedScripts = new Set(
        Array.from(document.querySelectorAll('script[src]')).map(s => s.getAttribute('src'))
    );

    const jokerList = Array.isArray(jokers) ? jokers : [jokers];
    const scriptsToLoad = jokerList.filter(j => j.script && !loadedScripts.has(j.script));

    const batchSize = 10;
    for (let i = 0; i < scriptsToLoad.length; i += batchSize) {
        const batch = scriptsToLoad.slice(i, i + batchSize);
        const promises = batch.map(joker => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = joker.script;
                script.type = 'text/javascript';
                //script.async = true;
                script.onload = () => {
                    loadedScripts.add(joker.script);
                    resolve();
                };
                script.onerror = () => {
                    console.warn(`[error] no se pudo cargar: ${joker.script}`);
                    reject(new Error(`Failed to load script: ${joker.script}`));
                };
                document.body.appendChild(script);
            });
        });
        await Promise.all(promises);
        console.log(`[boot_menu.js] Loaded batch of ${batch.length} joker scripts.`);
    }
}



// Function to dynamically add boot_game.js and joker scripts to the DOM
function prepareGame() {
    
     gameState.settings = {
           deckType: 'blue',
           difficulty: 'normal',
           masterVolume: 100,
           musicEnabled: true,
           sfxEnabled: true,
           animationSpeed: 1,
           backgroundTheme: 'main',
           jokerCollection: 'none'
       },
   

    gameState.deckType = gameState.settings.deckType;
    gameState.difficulty = gameState.settings.difficulty;
    gameState.jokerCollection = gameState.settings.jokerCollection;



    const speedValue = gameState.settings.animationSpeed;
    gameState.animationSpeed = speedValue === 'instant' ? 0 : parseFloat(speedValue);

    console.log("[boot_menu.js] User selected options:");
    console.log("[boot_menu.js] Deck Type:", gameState.deckType);
    console.log("[boot_menu.js] Difficulty:", gameState.difficulty);
    console.log("[boot_menu.js] Joker Collection:", gameState.jokerCollection);
    console.log("[boot_menu.js] Animation Speed:", gameState.animationSpeed === 0 ? 'Instant' : `${1 / gameState.animationSpeed}x`);

    const bootMenu = document.querySelector('.boot-menu-start-game');
    const blindSelectionMenu = document.querySelector('.blind-selection-menu');
    animateTransition(bootMenu, blindSelectionMenu);

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

    const blindSelectionMenu = document.querySelector('.blind-selection-menu');
    animateTransition(blindSelectionMenu, null);

    setTimeout(() => {
        startingGame();
    }, 500);
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
    const scoreElement = document.getElementById('score-final');
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
    document.querySelector('.boot-menu').style.display = 'block';
    document.querySelector('.boot-menu-main').style.display = 'block';
    document.querySelector('.boot-menu-start-game').style.display = 'none';
    document.querySelector('.shop-menu').style.display = 'none';
    document.querySelector('.play-area').style.display = 'none';
    document.querySelector('.left-panel').style.display = 'none';
    document.querySelector('.right-panel').style.display = 'none';
    console.log("[boot_menu.js] Returned to main boot menu. Game and shop panels hidden.");
}

// Function to show the next round shop menu
function showCashOutAnimation() {
    console.log("[boot_menu.js] Starting cash out animation.");

    const handElement = document.getElementById('hand');
    const controlsElement = document.querySelector('.controls');
    const cashOutMenu = document.getElementById('cash-out-menu');

    // Animate hand and controls down
    handElement.classList.add('hand-and-controls-down');
    controlsElement.classList.add('hand-and-controls-down');

    // Update cash out menu info
    document.getElementById('cash-out-deck-count').textContent = `${gameState.deck.length}/52`;
    document.getElementById('cash-out-discards-left').textContent = gameState.discardsLeft;
    document.getElementById('cash-out-money').textContent = `+$${gameState.nextBlindReward}`;

    // Show cash out menu after a delay
    setTimeout(() => {
        cashOutMenu.classList.add('visible');
    }, 300); // Delay to sync with the other animation

    // Add event listener to cash out button
    const cashOutBtn = document.getElementById('cash-out-btn');
    cashOutBtn.onclick = () => {
        sfx('button');
        cashOutMenu.classList.remove('visible');
        // After menu is hidden, proceed to shop
        setTimeout(() => {
            proceedToShop();
        }, 500);
            cashOutMenu.classList.remove('cash-out-menu-down');
    handElement.classList.remove('hand-lower');
    const Controls = document.getElementsByClassName('controls')[0];
    Controls.classList.remove('hand-and-controls-down');
        const hand = document.getElementsByClassName('hand')[0];
    hand.classList.remove('hand-and-controls-down');
    };
}

function proceedToShop() {
    // Restablecer el estado para la nueva ronda
    gameState.score = 0;
    gameState.handsLeft = 4; // Reset handsLeft
    gameState.discardsLeft = 2; // Reset discards
    gameState.money += gameState.nextBlindReward; // Añadir la recompensa de la ciega
    gameState.round += 1; // Incrementar ronda solo una vez
    gameState.targetScore = Math.round(gameState.targetScore * 1.5); // Aumentar el objetivo en 50%
    gameState.recovery = true;

    // Ocultar elementos del juego
    const playArea = document.querySelector('.play-area');
    const leftPanel = document.querySelector('.left-panel');
    const rightPanel = document.querySelector('.right-panel');
    const shopMenu = document.querySelector('.shop-menu');

    animateTransition(playArea, shopMenu);
    animateTransition(leftPanel, null);
    animateTransition(rightPanel, null);
    
    document.querySelector('.boot-menu-start-game').style.display = 'none';

    // Configurar la tienda
    let shuffledJokers = availableJokers.sort(() => Math.random() - 0.5);
    gameState.shopJokers = assignSubEffectsToShopJokers(shuffledJokers.slice(0, 2));
    const hasBlackCard = gameState.shopJokers.some(joker => joker.rarity === 'black card');

    // Configurar música y fondo
    if (hasBlackCard) {
        shopMenu.classList.add('black-card-background');
        transitionToMusic("blackCard", 500);
        console.log("[boot_menu.js] Black card detected in shop, playing celestial music and changing background");
    } else {
        shopMenu.classList.remove('black-card-background');
        transitionToMusic("shop", 2000);
    }

    // Restablecer mano y baraja
    gameState.hand = [];
    gameState.selectedCards = [];
    createDeck();
    shuffleDeck();
    dealHand(true); // Repartir nueva mano
    renderShopJokers();

    console.log("[boot_menu.js] Shop opened for round:", gameState.round, "Target Score:", gameState.targetScore);
    updateUI(); // Actualizar la UI
}

function nextRoundMenu() {
    // Evitar múltiples ejecuciones de nextRoundMenu
    if (document.querySelector('.shop-menu').style.display === 'flex') {
        console.log("[boot_menu.js] nextRoundMenu aborted: Shop menu already open");
        return;
    }
    showCashOutAnimation();
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

        let effectFunction = window[jokerData.id];
        if (typeof effectFunction !== 'function') {
            const effectName = jokerData.id.replace(/ /g, '_') + '_effect';
            effectFunction = window[effectName];
        }

        if (typeof effectFunction === 'function') {
            gameState.money -= cost;
            if (isOwned) {
                // Replace existing joker with the new version
                gameState.jokersOwned = gameState.jokersOwned.filter(j => j.name !== jokerData.name);
            }
            const newJoker = {
                ...jokerData,
                effect: effectFunction,
                subEffect: jokerData.subEffect
            };
            gameState.jokersOwned.push(newJoker);
            console.log("[boot_menu.js] Joker purchased and effect applied:", newJoker);

            if (jokerData.rarity === 'black card' && !gameState.ownedBlackCards.includes(jokerData.id)) {
                gameState.ownedBlackCards.push(jokerData.id);
                console.log("[boot_menu.js] Black card owned:", jokerData.name);
            }
            // Play a random coin sound effect (coin1, coin2, or coin3)
            const coinNumber = Math.floor(Math.random() * 3) + 1;
            sfx(`coin${coinNumber}`);
            updateUI();
            renderShopJokers();
            showNotification(`¡Compraste ${jokerData.name}${jokerData.subEffect ? ` (${jokerData.subEffect.name})` : ''}!`, 1500 * gameState.animationSpeed);
            previewJoker(jokerIndex); // Refresh preview to update button state
        } else {
            loadJokerScripts([jokerData]).then(() => {
                const effectFunction = window[jokerData.id] || window[jokerData.id.replace(/ /g, '_') + '_effect'];
                if (typeof effectFunction === 'function') {
                    gameState.money -= cost;
                    if (isOwned) {
                        // Replace existing joker with the new version
                        gameState.jokersOwned = gameState.jokersOwned.filter(j => j.name !== jokerData.name);
                    }
                    const newJoker = {
                        ...jokerData,
                        effect: effectFunction,
                        subEffect: jokerData.subEffect
                    };
                    gameState.jokersOwned.push(newJoker);
                    console.log("[boot_menu.js] Joker purchased and effect applied:", newJoker);

                    if (jokerData.rarity === 'black card' && !gameState.ownedBlackCards.includes(jokerData.id)) {
                        gameState.ownedBlackCards.push(jokerData.id);
                        console.log("[boot_menu.js] Black card owned:", jokerData.name);
                    }
                    // Play a random coin sound effect (coin1, coin2, or coin3)
                    const coinNumber = Math.floor(Math.random() * 3) + 1;
                    sfx(`coin${coinNumber}`);
                    updateUI();
                    renderShopJokers();
                    showNotification(`¡Compraste ${jokerData.name}${jokerData.subEffect ? ` (${jokerData.subEffect.name})` : ''}!`, 1500 * gameState.animationSpeed);
                    previewJoker(jokerIndex); // Refresh preview to update button state
                } else {
                    console.error(`[boot_menu.js] Error: Function '${jokerData.id}' or '${jokerData.id}_effect' not found in script ${jokerData.script}.`);
                }
            });
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
    const shopMenu = document.querySelector('.shop-menu');
    const playArea = document.querySelector('.play-area');
    const leftPanel = document.querySelector('.left-panel');
    const rightPanel = document.querySelector('.right-panel');

    animateTransition(shopMenu, playArea);
    setTimeout(() => {
        leftPanel.style.display = 'flex';
        rightPanel.style.display = 'flex';
        leftPanel.classList.add('slide-up-in');
        rightPanel.classList.add('slide-up-in');
        
        // Animate hand and controls back up
        const handElement = document.getElementById('hand');
        const controlsElement = document.querySelector('.controls');
        handElement.classList.remove('hand-and-controls-down');
        controlsElement.classList.remove('hand-and-controls-down');

    }, 500);


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
    if (gameState.recovery) {
        showRecoveryMenu();
    } else {
        const mainMenu = document.querySelector('.boot-menu-main');
        const startGameMenu = document.querySelector('.boot-menu-start-game');
        animateTransition(mainMenu, startGameMenu);
    }
}

// Function to restart game
function restartGame(data = null) {
    gameState.score = 0
    updateUI()
    gameState.recovery = false
    if (data === null) {

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

function setDefaults() {
    gameState.settings = {
        deckType: 'blue',
        difficulty: 'normal',
        masterVolume: 45,
        musicEnabled: true,
        sfxEnabled: true,
        animationSpeed: 1,
        backgroundTheme: 'main',
        jokerCollection: 'none'
    };
    saveGameState();
    console.log("[boot_menu.js] Default settings applied.");
}
let bootedup = false;
// Avanzar al menú principal tras click en logo
function enterMainMenu() {

    if (bootedup) {
        return;
    }
    
    bootedup = true;
    const introLogo = document.getElementById("intro-logo");
    const bootMenu = document.querySelector(".boot-menu");

    // Fade out intro-logo
    introLogo.classList.add("fade-out");
    const menu = document.querySelector('.boot-menu');

    setTimeout(async () => {
        document.querySelector('.boot-menu-main').style.display = 'block';
        console.log("hello there!");

        console.log("[boot_menu.js] Entered main menu from intro logo.");
        startMusicSystem();
        fadeToTrack("main", 900);

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
        introLogo.style.display = "none";
        bootMenu.style.display = "block";
        menu.classList.toggle('show');
    }, 100); // Match CSS transition duration

}

function startNewGame() {
    localStorage.removeItem('recovery'); // Clear any existing recovery data
    document.getElementById('recovery-menu').style.display = 'none';
    // Reset gameState to default values for a new game
    restartGame(); // Call restartGame to re-initialize gameState and show main menu
}

function initApp() {
    initCoreSystems();
    setBg("main");
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
}












// Deck and difficulty arrays
const decks = [
    { id: 'blue', name: 'Baraja Azul', image: './images/decks/blue_deck.png' },
    { id: 'green', name: 'Baraja Verde', image: './images/decks/green_deck.png' },
    { id: 'black', name: 'Baraja Negra', image: './images/decks/black_deck.png' }
];

const difficulties = [
    { id: 'easy', name: 'Fácil' },
    { id: 'normal', name: 'Normal' },
    { id: 'hard', name: 'Difícil' }
];

let currentDeckIndex = gameState.settings?.deckType ? decks.findIndex(d => d.id === gameState.settings.deckType) : 0;
let currentDifficultyIndex = gameState.settings?.difficulty ? difficulties.findIndex(d => d.id === gameState.settings.difficulty) : 1;

function changeDeck(direction) {
    if (direction === 'prev') {
        currentDeckIndex = (currentDeckIndex - 1 + decks.length) % decks.length;
    } else if (direction === 'next') {
        currentDeckIndex = (currentDeckIndex + 1) % decks.length;
    }
    updateDeckDisplay();
    gameState.settings.deckType = decks[currentDeckIndex].id;
    saveGameState();
    console.log("[boot_menu.js] Deck changed to:", decks[currentDeckIndex].id);
}

function changeDifficulty(direction) {
    if (direction === 'prev') {
        currentDifficultyIndex = (currentDifficultyIndex - 1 + difficulties.length) % difficulties.length;
    } else if (direction === 'next') {
        currentDifficultyIndex = (currentDifficultyIndex + 1) % difficulties.length;
    }
    updateDifficultyDisplay();
    gameState.settings.difficulty = difficulties[currentDifficultyIndex].id;
    saveGameState();
    console.log("[boot_menu.js] Difficulty changed to:", difficulties[currentDifficultyIndex].id);
}

function updateDeckDisplay() {
    const deckImage = document.getElementById('deck-image');
    const deckName = document.getElementById('deck-name');
    if (deckImage && deckName) {
        deckImage.src = decks[currentDeckIndex].image;
        deckImage.alt = decks[currentDeckIndex].name;
        deckName.textContent = decks[currentDeckIndex].name;
    } else {
        console.error("[boot_menu.js] Error: Deck image or name element not found");
    }
}

function updateDifficultyDisplay() {
    const difficultyName = document.getElementById('difficulty-name');
    if (difficultyName) {
        difficultyName.textContent = difficulties[currentDifficultyIndex].name;
    } else {
        console.error("[boot_menu.js] Error: Difficulty name element not found");
    }
}

function startGame() {
    console.log("[boot_menu.js] Starting game with deck:", decks[currentDeckIndex].id, "and difficulty:", difficulties[currentDifficultyIndex].id);
    const startGameMenu = document.querySelector('.boot-menu-start-game');
    
    animateTransition(startGameMenu, null);
    setTimeout(prepareGame, 500);
}

function backToIntro() {
    console.log("[boot_menu.js] Returning to main menu");
    const startGameMenu = document.querySelector('.boot-menu-start-game');
    const mainMenu = document.querySelector('.boot-menu-main');

    animateTransition(startGameMenu, mainMenu, 'block');
    saveGameState();
}

function saveGameState() {
    try {
        localStorage.setItem('gameState', JSON.stringify(gameState));
        console.log("[boot_menu.js] Game state saved");
    } catch (e) {
        console.error("[boot_menu.js] Error saving game state:", e);
    }
}

