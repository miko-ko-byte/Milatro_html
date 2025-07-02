class Debug {
    constructor() {
        this.debugMode = false;
        this.debugPanel = null;
    }

    init() {
        this.createDebugPanel();
        this.listenForDebugKeys();
    }

    createDebugPanel() {
        this.debugPanel = document.createElement('div');
        this.debugPanel.id = 'debug-panel';
        this.debugPanel.style.display = 'none';
        this.debugPanel.innerHTML = `
            <h3>Debug Panel</h3>
            <button onclick="debug.toggleDebugMode()">Toggle Debug Mode</button>
            <button onclick="debug.logGameState()">Log Game State</button>
            <button onclick="debug.logPlayer()">Log Player</button>
            <button onclick="debug.logJokers()">Log Jokers</button>
            <button onclick="debug.logDeck()">Log Deck</button>
        `;
        document.body.appendChild(this.debugPanel);
    }

    listenForDebugKeys() {
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                this.toggleDebugPanel();
            }
        });
    }

    toggleDebugPanel() {
        this.debugPanel.style.display = this.debugPanel.style.display === 'none' ? 'block' : 'none';
    }

    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        console.log(`Debug mode ${this.debugMode ? 'enabled' : 'disabled'}`);
    }

    logGameState() {
        if (this.debugMode) {
            console.log('Game State:', window.game);
        }
    }

    logPlayer() {
        if (this.debugMode) {
            console.log('Player:', window.game.player);
        }
    }

    logJokers() {
        if (this.debugMode) {
            console.log('Jokers:', window.game.jokers);
        }
    }

    logDeck() {
        if (this.debugMode) {
            console.log('Deck:', window.game.deck);
        }
    }
}

const debug = new Debug();
debug.init();
