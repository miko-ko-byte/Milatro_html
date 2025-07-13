let currentSettingsSection = 'gameplay';

function showSettings() {
    // Ensure gameState and gameState.settings are initialized
    if (typeof gameState === 'undefined') {
        console.warn("[settings.js] gameState is not defined. Initializing with default values.");
        window.gameState = {
            settings: {
                masterVolume: 100,
                musicEnabled: true,
                sfxEnabled: true,
                animationSpeed: 1,
                backgroundTheme: 'main',
                deckType: 'standard',
                difficulty: 'normal',
                jokerCollection: 'none'
            }
        };
    } else if (typeof gameState.settings === 'undefined') {
        console.warn("[settings.js] gameState.settings is not defined. Initializing with default values.");
        gameState.settings = {
            masterVolume: 100,
            musicEnabled: true,
            sfxEnabled: true,
            animationSpeed: 1,
            backgroundTheme: 'main',
            deckType: 'standard',
            difficulty: 'normal',
            jokerCollection: 'none'
        };
    }

    document.querySelector('.boot-menu-main').style.display = 'none';
    document.querySelector('.settings-menu').style.display = 'flex';
    switchSettingsSection('gameplay');
    setupSoundSettings(); // Mover la configuración de sonido aquí
    console.log("[settings.js] Settings menu shown");
}

function hideSettings() {
    document.querySelector('.settings-menu').style.display = 'none';
    document.querySelector('.boot-menu-main').style.display = 'block';
    saveSettings();
    console.log("[settings.js] Settings menu hidden and settings saved");
}

function switchSettingsSection(section) {
    currentSettingsSection = section;
    const settingsContent = document.getElementById('settings-content');
    settingsContent.innerHTML = '';

    const buttons = document.querySelectorAll('.settings-nav-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.settings-nav-button[data-section="${section}"]`).classList.add('active');

    if (section === 'sound') {
        settingsContent.innerHTML = `
            <h3>Configuración de Sonido</h3>
            <div class="settings-option">
                <label for="master-volume">Volumen Máximo:</label>
                <input type="range" id="master-volume" min="0" max="100" value="${gameState.settings.masterVolume || 100}">
                <span id="volume-value">${gameState.settings.masterVolume || 100}%</span>
            </div>
            <div class="settings-option">
                <label for="music-toggle">Música:</label>
                <input type="checkbox" id="music-toggle" ${gameState.settings.musicEnabled ? 'checked' : ''}>
            </div>
            <div class="settings-option">
                <label for="sfx-toggle">Efectos de Sonido:</label>
                <input type="checkbox" id="sfx-toggle" ${gameState.settings.sfxEnabled ? 'checked' : ''}>
            </div>
        `;
        setupSoundSettings(); // Configurar controles de sonido cuando se muestra la sección de sonido
    } else if (section === 'graphics') {
        settingsContent.innerHTML = `
            <h3>Configuración Gráfica</h3>
            <div class="settings-option">
                <label for="animation-speed">Velocidad de Animación:</label>
                <select id="animation-speed">
                    <option value="1" ${gameState.settings.animationSpeed === 1.0 ? 'selected' : ''}>Normal (1x)</option>
                    <option value="0.5" ${gameState.settings.animationSpeed === 0.5 ? 'selected' : ''}>Doble (2x)</option>
                    <option value="0.25" ${gameState.settings.animationSpeed === 0.25 ? 'selected' : ''}>Cuádruple (4x)</option>
                    <option value="0" ${gameState.settings.animationSpeed === 0 ? 'selected' : ''}>Instantánea (Sin animaciones)</option>
                </select>
            </div>
            <div class="settings-option">
                <label for="background-theme">Tema de Fondo:</label>
                <select id="background-theme">
                    <option value="main" ${gameState.settings.backgroundTheme === 'main' ? 'selected' : ''}>Predeterminado</option>
                    <option value="color0" ${gameState.settings.backgroundTheme === 'color0' ? 'selected' : ''}>Espacio Profundo</option>
                    <option value="color1" ${gameState.settings.backgroundTheme === 'color1' ? 'selected' : ''}>Infierno Carmesí</option>
                    <option value="color2" ${gameState.settings.backgroundTheme === 'color2' ? 'selected' : ''}>Amatista Real</option>
                    <option value="color3" ${gameState.settings.backgroundTheme === 'color3' ? 'selected' : ''}>Aurora Boreal</option>
                    <option value="color4" ${gameState.settings.backgroundTheme === 'color4' ? 'selected' : ''}>Espejismo al Atardecer</option>
                    <option value="color5" ${gameState.settings.backgroundTheme === 'color5' ? 'selected' : ''}>Neón Ciberpunk</option>
                    <option value="color6" ${gameState.settings.backgroundTheme === 'color6' ? 'selected' : ''}>Sueño Esmeralda</option>
                    <option value="color7" ${gameState.settings.backgroundTheme === 'color7' ? 'selected' : ''}>Llamarada Solar</option>
                    <option value="color8" ${gameState.settings.backgroundTheme === 'color8' ? 'selected' : ''}>Profundidades Oceánicas</option>
                    <option value="color9" ${gameState.settings.backgroundTheme === 'color9' ? 'selected' : ''}>Estallido de Caramelo</option>
                </select>
            </div>
        `;
        setupGraphicsSettings();
    } else if (section === 'gameplay') {
        settingsContent.innerHTML = `
            <h3>Configuración de Juego</h3>
            <div class="settings-option">
                <label for="deck-type">Tipo de Baraja:</label>
                <select id="deck-type">
                    <option value="standard" ${gameState.settings.deckType === 'standard' ? 'selected' : ''}>Estándar</option>
                    <option value="expanded" ${gameState.settings.deckType === 'expanded' ? 'selected' : ''}>Expandida</option>
                    <option value="themed" ${gameState.settings.deckType === 'themed' ? 'selected' : ''}>Temática</option>
                </select>
            </div>
            <div class="settings-option">
                <label for="difficulty">Dificultad:</label>
                <select id="difficulty">
                    <option value="easy" ${gameState.settings.difficulty === 'easy' ? 'selected' : ''}>Fácil</option>
                    <option value="normal" ${gameState.settings.difficulty === 'normal' ? 'selected' : ''}>Normal</option>
                    <option value="hard" ${gameState.settings.difficulty === 'hard' ? 'selected' : ''}>Difícil</option>
                </select>
            </div>
            <div class="settings-option">
                <label for="joker-collection">Colección de Comodines:</label>
                <select id="joker-collection">
                    <option value="none" ${gameState.settings.jokerCollection === 'none' ? 'selected' : ''}>Ninguno</option>
                    <option value="basic" ${gameState.settings.jokerCollection === 'basic' ? 'selected' : ''}>Básica</option>
                    <option value="complete" ${gameState.settings.jokerCollection === 'complete' ? 'selected' : ''}>Completa</option>
                </select>
            </div>
            <div class="settings-option">
                <button id="reset-data" class="btn-reset">Borrar Todos los Datos</button>
            </div>
        `;
        setupGameplaySettings();
    }
    console.log("[settings.js] Switched to section:", section);
}

function setupSoundSettings() {
    const volumeSlider = document.getElementById('master-volume');
    const volumeValue = document.getElementById('volume-value');
    const musicToggle = document.getElementById('music-toggle');
    const sfxToggle = document.getElementById('sfx-toggle');

    // Verificar que los elementos existen antes de configurar
    if (!volumeSlider || !volumeValue || !musicToggle || !sfxToggle) {
        console.warn("[settings.js] One or more sound control elements not found in DOM");
        return;
    }

    // Cargar configuraciones iniciales y actualizar la UI
    loadSettings();
    volumeSlider.value = gameState.settings.masterVolume;
    volumeValue.textContent = `${gameState.settings.masterVolume}%`;
    musicToggle.checked = gameState.settings.musicEnabled;
    sfxToggle.checked = gameState.settings.sfxEnabled;

    // Configurar evento para el control deslizante de volumen
    volumeSlider.addEventListener('input', () => {
        const volume = parseFloat(volumeSlider.value); // Valor en escala 0-100
        volumeValue.textContent = `${volume}%`;
        gameState.settings.masterVolume = volume; // Almacenar en escala 0-100
        saveSettings(); // Guardar cambios en localStorage
        console.log("[settings.js] Master volume set to:", volume / 100);
    });

    // Configurar evento para el toggle de música
    musicToggle.addEventListener('change', () => {
        gameState.settings.musicEnabled = musicToggle.checked;
        saveSettings(); // Guardar cambios en localStorage
        //updateVolume(); // Actualizar volumen para reflejar el estado de musicEnabled
        console.log("[settings.js] Music enabled:", musicToggle.checked);
    });

    // Configurar evento para el toggle de efectos de sonido
    sfxToggle.addEventListener('change', () => {
        gameState.settings.sfxEnabled = sfxToggle.checked;
        saveSettings(); // Guardar cambios en localStorage
        console.log("[settings.js] SFX enabled:", sfxToggle.checked);
    });
}

function setupGraphicsSettings() {
    const animationSpeedSelect = document.getElementById('animation-speed');
    const backgroundThemeSelect = document.getElementById('background-theme');

    animationSpeedSelect.addEventListener('change', () => {
        gameState.settings.animationSpeed = parseFloat(animationSpeedSelect.value);
        updateAnimationSpeeds();
        console.log("[settings.js] Animation speed set to:", gameState.settings.animationSpeed);
    });

    backgroundThemeSelect.addEventListener('change', () => {
        gameState.settings.backgroundTheme = backgroundThemeSelect.value;
        updateBackgroundTheme();
        console.log("[settings.js] Background theme set to:", gameState.settings.backgroundTheme);
    });
}

function setupGameplaySettings() {
    const deckTypeSelect = document.getElementById('deck-type');
    const difficultySelect = document.getElementById('difficulty');
    const jokerCollectionSelect = document.getElementById('joker-collection');
    const resetDataButton = document.getElementById('reset-data');

    deckTypeSelect.addEventListener('change', () => {
        gameState.settings.deckType = deckTypeSelect.value;
        console.log("[settings.js] Deck type set to:", gameState.settings.deckType);
    });

    difficultySelect.addEventListener('change', () => {
        gameState.settings.difficulty = difficultySelect.value;
        console.log("[settings.js] Difficulty set to:", gameState.settings.difficulty);
    });

    jokerCollectionSelect.addEventListener('change', () => {
        gameState.settings.jokerCollection = jokerCollectionSelect.value;
        console.log("[settings.js] Joker collection set to:", gameState.settings.jokerCollection);
    });

    resetDataButton.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres borrar todos los datos guardados? Esta acción no se puede deshacer.')) {
            gameState = {
                settings: {
                    masterVolume: 100,
                    musicEnabled: true,
                    sfxEnabled: true,
                    animationSpeed: 1,
                    backgroundTheme: 'main',
                    deckType: 'standard',
                    difficulty: 'normal',
                    jokerCollection: 'none'
                },
                seenJokers: [],
                ownedBlackCards: [],
                seenSubEffects: [],
                timesBooted: 0,
                startTime: null,
                completionPercentage: 0
            };
            localStorage.setItem('gameState', JSON.stringify(gameState));
            console.log("[settings.js] All game data reset");
            alert('Datos borrados. El juego se reiniciará.');
            location.reload();
        }
    });
}

function updateAnimationSpeeds() {
    const speed = gameState.settings.animationSpeed;
    const styleSheet = document.styleSheets[0];
    const animations = [
        { selector: '.card', property: 'transition', value: `all ${0.4 / speed}s ease` },
        { selector: '.card:hover', property: 'transition', value: `all ${0.4 / speed}s ease` },
        { selector: '.card.selected', property: 'transition', value: `all ${0.4 / speed}s ease` },
        { selector: '.card-played-up', property: 'transition', value: `all ${0.6 / speed}s ease-in-out` },
        { selector: '.card-played-down', property: 'transition', value: `all ${0.6 / speed}s ease-in-out` },
        { selector: '.card-fade-out', property: 'transition', value: `all ${0.6 / speed}s ease-in-out` },
        { selector: '.flying-card', property: 'transition', value: `all ${0.6 / speed}s ease-in-out` },
        { selector: '.joker-card', property: 'transition', value: `all ${0.4 / speed}s ease` },
        { selector: '.joker-card:hover', property: 'transition', value: `all ${0.4 / speed}s ease` }
    ];

    animations.forEach(anim => {
        try {
            styleSheet.insertRule(`${anim.selector} { ${anim.property}: ${anim.value}; }`, styleSheet.cssRules.length);
        } catch (e) {
            console.warn("[settings.js] Error updating animation speed for", anim.selector, e);
        }
    });

    if (speed === 0) {
        document.querySelectorAll('.card, .joker-card').forEach(el => {
            el.style.animation = 'none';
        });
    } else {
        document.querySelectorAll('.card').forEach(el => {
            el.style.animation = `subtle-dance ${5 / speed}s ease-in-out infinite`;
        });
        document.querySelectorAll('.joker-card').forEach(el => {
            el.style.animation = `subtle-dance ${5 / speed}s ease-in-out infinite`;
        });
    }
}

function updateBackgroundTheme() {
    const body = document.body;
    body.classList.remove('main', 'color0', 'color1', 'color2', 'color3', 'color4', 'color5', 'color6', 'color7', 'color8', 'color9');
    body.classList.add(gameState.settings.backgroundTheme);
    console.log("[settings.js] Updated background theme to:", gameState.settings.backgroundTheme);
}

function saveSettings() {
    try {
        localStorage.setItem('gameSettings', JSON.stringify(gameState.settings));
        console.log("[settings.js] Settings saved:", gameState.settings);
    } catch (e) {
        console.warn("[settings.js] Error saving settings to localStorage:", e);
    }
}

function loadSettings() {
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
        try {
            const parsedSettings = JSON.parse(savedSettings);
            gameState.settings = {
                ...gameState.settings,
                ...parsedSettings,
                masterVolume: Math.min(100, Math.max(0, parsedSettings.masterVolume || gameState.settings.masterVolume))
            };
            console.log("[settings.js] Settings loaded:", gameState.settings);
        } catch (e) {
            console.warn("[settings.js] Error loading settings from localStorage:", e);
        }
    } else {
        console.log("[settings.js] No saved settings found, using defaults:", gameState.settings);
    }
    updateVolume();
}

// Inicializar configuraciones al cargar el DOM
function initializeAllSettings() {
    // Cargar configuraciones guardadas
    loadSettings();

    // Actualizar UI y aplicar configuraciones
    updateVolume();
    updateAnimationSpeeds();
    updateBackgroundTheme();

    // Si los elementos existen en el DOM inicial, actualiza sus valores
    if (document.getElementById('master-volume')) setupSoundSettings();
    if (document.getElementById('animation-speed')) setupGraphicsSettings();
    if (document.getElementById('deck-type')) setupGameplaySettings();
}

// Llama a esta función al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    if (typeof initCoreSystems === 'function') {
        console.log("[settings.js] DOMContentLoaded event fired, initializing settings");
        initializeAllSettings();
    } else {
        console.error("[settings.js] initCoreSystems() not found. Make sure boot_menu.js is loaded first.");
    }
});
document.addEventListener('DOMContentLoaded', () => {
    console.log("[settings.js] DOMContentLoaded event fired, initializing settings");
    // No llamar a setupSoundSettings aquí, ya que se llamará en showSettings
});