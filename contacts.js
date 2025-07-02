class Contacts {
    constructor() {
        this.init();
    }

    init() {
        if ('contacts' in navigator) {
            console.log('Contacts API supported.');
        }
    }

    getContacts(properties, options) {
        if ('contacts' in navigator) {
            return navigator.contacts.select(properties, options);
        }
    }
}

const contacts = new Contacts();
