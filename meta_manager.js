class MetaManager {
    constructor() {
        this.metaTags = {};
    }

    createMetaTag(name, content) {
        const meta = document.createElement('meta');
        meta.setAttribute(name, content);
        document.head.appendChild(meta);
        this.metaTags[name] = meta;
    }

    updateMetaTag(name, content) {
        if (this.metaTags[name]) {
            this.metaTags[name].setAttribute('content', content);
        } else {
            this.createMetaTag(name, content);
        }
    }

    setMetaTags(tags) {
        for (const name in tags) {
            if (Object.hasOwnProperty.call(tags, name)) {
                this.updateMetaTag(name, tags[name]);
            }
        }
    }
}

const metaManager = new MetaManager();

// Default meta tags
metaManager.setMetaTags({
    'description': 'Milatro is a web-based card game.',
    'keywords': 'milatro, card game, web game, balatro, by miko',
    'author': 'miko',
    'og:title': 'Milatro - by miko',
    'og:description': 'Milatro is a web-based card game.',
    'og:image': 'https://www.mikogallerie.com/images/logo.png',
    'og:url': 'https://www.mikogallerie.com/milatro',
    'og:type': 'website',
    'twitter:card': 'summary_large_image',
    'twitter:title': 'Milatro - by miko',
    'twitter:description': 'Milatro is a web-based card game.',
    'twitter:image': 'https://www.mikogallerie.com/images/logo.png'
});
