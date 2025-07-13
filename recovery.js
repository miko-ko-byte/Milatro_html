
function showRecoveryMenu() {
    const recoveryMenu = document.querySelector('.recovery-menu');
    if (recoveryMenu) {
        recoveryMenu.style.display = 'flex';
        document.querySelector('.boot-menu').style.display = 'none';
    }
}

function continueGame() {
    const recoveryData = localStorage.getItem('recovery');
    if (recoveryData) {
        try {
            const parsedData = JSON.parse(recoveryData);
            if (parsedData.startTime) {
                parsedData.startTime = new Date(parsedData.startTime);
            }
            // Re-assign joker effects
            if (parsedData.jokersOwned && Array.isArray(parsedData.jokersOwned)) {
                parsedData.jokersOwned.forEach(joker => {
                    let effectFunction = window[joker.id];
                    if (typeof effectFunction !== 'function') {
                        const effectName = joker.id.replace(/ /g, '_') + '_effect';
                        effectFunction = window[effectName];
                    }
                    if (typeof effectFunction === 'function') {
                        joker.effect = effectFunction;
                    }
                });
            }

            Object.assign(gameState, parsedData);
            console.log('Game state loaded from recovery:', gameState);
            document.querySelector('.recovery-menu').style.display = 'none';
            document.getElementsByClassName("loading-joker")[0].style.display = "block"
            const script = document.createElement('script');
            script.src = './boot.js';
            script.type = 'text/javascript';
            script.async = false;
            script.onload = () => {
                console.log("[recovery.js] boot_game.js loaded, calling startingGame()...");
                startingGame();
            document.getElementsByClassName("loading-joker")[0].style.display = "none"
            };
            document.body.appendChild(script);


        } catch (e) {
            console.error('Failed to load recovery game:', e);
            alert('Failed to load recovery game. Returning to main menu.');
            goToMenu(); // Go back to the main menu
        }
    }
}

function newGame() {
    localStorage.removeItem('recovery');
    gameState.recovery = false;
    document.querySelector('.recovery-menu').style.display = 'none';
    goToMenu(); // Go back to the main menu
    showStartGameMenu(); // Show the new game menu
}
