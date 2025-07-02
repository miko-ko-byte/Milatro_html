class Shortcuts {
    constructor() {
        this.init();
    }

    init() {
        if ('shortcuts' in navigator) {
            console.log('Shortcuts API supported.');
        }
    }

    setShortcuts(shortcuts) {
        if ('shortcuts' in navigator) {
            navigator.shortcuts.set(shortcuts);
        }
    }
}

const shortcuts = new Shortcuts();
