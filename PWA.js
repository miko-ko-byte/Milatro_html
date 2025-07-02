class PWA {
    constructor() {
        this.init();
    }

    init() {
        this.listenForAppInstalled();
        this.listenForBeforeInstallPrompt();
    }

    listenForAppInstalled() {
        window.addEventListener('appinstalled', (evt) => {
            console.log('App installed successfully');
        });
    }

    listenForBeforeInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            window.deferredPrompt = e;
        });
    }
}

const pwa = new PWA();
