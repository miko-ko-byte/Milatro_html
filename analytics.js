class Analytics {
    constructor(trackingId) {
        this.trackingId = trackingId;
        this.init();
    }

    init() {
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
        script.async = true;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', this.trackingId);
    }

    trackEvent(category, action, label, value) {
        gtag('event', action, {
            'event_category': category,
            'event_label': label,
            'value': value
        });
    }
}

const analytics = new Analytics('G-XXXXXXXXXX'); // Replace with your tracking ID
