class Share {
    constructor() {
        this.init();
    }

    init() {
        if (navigator.share) {
            console.log('Share API supported.');
        }
    }

    share(data) {
        if (navigator.share) {
            navigator.share(data)
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
        }
    }
}

const share = new Share();
