let currentCollectionSection = 'sub-effects';

function showCollectionsMenu() {
    document.querySelector('.boot-menu-main').style.display = 'none';
    document.querySelector('.collections-menu').style.display = 'flex';
    renderCollections();
    switchCollectionSection('sub-effects');
    console.log("[collections_menu.js] Collections menu shown");
}

function hideCollectionsMenu() {
    document.querySelector('.collections-menu').style.display = 'none';
    document.querySelector('.boot-menu-main').style.display = 'block';
    console.log("[collections_menu.js] Collections menu hidden");
}

function switchCollectionSection(section) {
    currentCollectionSection = section;
    const collectionContent = document.getElementById('collection-content');
    const statsContent = document.getElementById('stats-content');

    if (section === 'stats') {
        collectionContent.style.display = 'none';
        statsContent.style.display = 'block';
    } else {
        collectionContent.style.display = 'grid';
        statsContent.style.display = 'none';
    }

    renderCollections();
    const buttons = document.querySelectorAll('.collection-nav-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.collection-nav-button[data-section="${section}"]`).classList.add('active');
    console.log("[collections_menu.js] Switched to section:", section);
}

function renderCollections() {
    const collectionContent = document.getElementById('collection-content');
    collectionContent.innerHTML = '';

    if (currentCollectionSection === 'sub-effects') {
        subEffects.forEach(effect => {
            const isSeen = gameState.seenSubEffects.includes(effect.id);
            const item = document.createElement('div');
            item.className = 'collection-item';
            item.innerHTML = `
                <div class="collection-item-card ${isSeen ? effect.visual : 'unknown'}" ${isSeen ? 'style="background-image: url(./images/jokers/joker.png)"' : ''}>
                    ${isSeen ? '' : '<span class="unknown-text">?</span>'}
                </div>
                <div class="collection-item-info">
                    <h3>${isSeen ? effect.name : '???'}</h3>
                    <p>${isSeen ? effect.description : 'No has descubierto este sub-efecto.'}</p>
                </div>
            `;
            collectionContent.appendChild(item);
        });
    } else if (currentCollectionSection === 'jokers') {
        availableJokers.forEach(joker => {
            const isSeen = gameState.seenJokers.includes(joker.id);
            const item = document.createElement('div');
            item.className = 'collection-item';
            item.innerHTML = `
                <div class="collection-item-card ${isSeen ? joker.rarity : 'unknown'}" style="${isSeen ? `background-image: url(${joker.image})` : ''}">
                    ${isSeen ? '' : '<span class="unknown-text">?</span>'}
                </div>
                <div class="collection-item-info">
                    <h3>${isSeen ? joker.name : '???'}</h3>
                    <p>${isSeen ? joker.description : 'No has descubierto este joker.'}</p>
                    <p>${isSeen ? `Rareza: ${joker.rarity}` : ''}</p>
                </div>
            `;
            collectionContent.appendChild(item);
        });
    } else if (currentCollectionSection === 'black-cards') {
        availableJokers.filter(joker => joker.rarity === 'black card').forEach(joker => {
            const isOwned = gameState.ownedBlackCards.includes(joker.id);
            const item = document.createElement('div');
            item.className = 'collection-item';
            item.innerHTML = `
                <div class="collection-item-card ${isOwned ? joker.rarity : 'unowned'}" style="${isOwned ? `background-image: url(${joker.image})` : ''}">
                    ${isOwned ? '' : '<span class="unowned-text">×</span>'}
                </div>
                <div class="collection-item-info">
                    <h3>${isOwned ? joker.name : '???'}</h3>
                    <p>${isOwned ? joker.description : 'No has adquirido esta carta negra.'}</p>
                    <p>${isOwned ? `Rareza: ${joker.rarity}` : ''}</p>
                </div>
            `;
            collectionContent.appendChild(item);
        });
    } else if (currentCollectionSection === 'stats') {
        const statsContent = document.getElementById('stats-content');
        collectionContent.style.display = 'none';
        statsContent.style.display = 'block';

        const hoursPlayed = gameState.startTime ? ((new Date() - new Date(gameState.startTime)) / 3600000).toFixed(2) : 0;
        const totalJokers = availableJokers.length;
        const totalSubEffects = subEffects.length;
        const totalBlackCards = availableJokers.filter(j => j.rarity === 'black card').length;

        const seenJokersCount = gameState.seenJokers.length;
        const seenSubEffectsCount = gameState.seenSubEffects.length;
        const ownedBlackCardsCount = gameState.ownedBlackCards.length;

        const totalItems = totalJokers + totalSubEffects + totalBlackCards;
        const collectedItems = seenJokersCount + seenSubEffectsCount + ownedBlackCardsCount;

        gameState.completionPercentage = totalItems > 0 ? (collectedItems / totalItems) * 100 : 0;

        document.getElementById('stats-boots').textContent = gameState.timesBooted;
        document.getElementById('stats-hours').textContent = hoursPlayed;
        document.getElementById('progress-bar').style.width = `${gameState.completionPercentage.toFixed(2)}%`;
        document.getElementById('completion-percentage').textContent = `${gameState.completionPercentage.toFixed(2)}%`;
    }
    console.log("[collections_menu.js] Rendered collection section:", currentCollectionSection);
}