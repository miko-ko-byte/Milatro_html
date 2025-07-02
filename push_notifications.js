class PushNotifications {
    constructor() {
        this.init();
    }

    init() {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification permission granted.');
                }
            });
        }
    }

    showNotification(title, options) {
        if (Notification.permission === 'granted') {
            navigator.serviceWorker.getRegistration().then(registration => {
                registration.showNotification(title, options);
            });
        }
    }
}

const pushNotifications = new PushNotifications();
