class Updater {
    constructor() {
        this.currentVersion = null;
        this.latestVersion = null;
        this.updateLog = null;
    }

    async checkForUpdates() {
        try {
            const response = await fetch('/version.json');
            const data = await response.json();
            this.latestVersion = data.version;
            this.compareVersions();
        } catch (error) {
            console.error('Error checking for updates:', error);
        }
    }

    async loadCurrentVersion() {
        try {
            const response = await fetch('/version.json');
            const data = await response.json();
            this.currentVersion = data.version;
        } catch (error) {
            console.error('Error loading current version:', error);
        }
    }

    compareVersions() {
        if (this.currentVersion && this.latestVersion && this.currentVersion !== this.latestVersion) {
            this.showUpdateNotification();
        }
    }

    async showUpdateNotification() {
        try {
            const response = await fetch('/update_log.json');
            const data = await response.json();
            this.updateLog = data.versions;
            const latestChanges = this.updateLog.find(v => v.version === this.latestVersion);
            if (latestChanges) {
                const notification = document.getElementById('notification');
                notification.innerHTML = `
                    <h3>New version available: ${this.latestVersion}</h3>
                    <ul>
                        ${latestChanges.changes.map(change => `<li>${change}</li>`).join('')}
                    </ul>
                    <button onclick="updater.update()">Update now</button>
                `;
                notification.style.display = 'block';
            }
        } catch (error) {
            console.error('Error showing update notification:', error);
        }
    }

    update() {
        window.location.reload();
    }
}

const updater = new Updater();
updater.loadCurrentVersion();
updater.checkForUpdates();
