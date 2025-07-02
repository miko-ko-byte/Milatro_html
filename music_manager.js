const musicTracks = {
    main: document.getElementById("music-main"),
    shop: document.getElementById("music-shop"),
    boss: document.getElementById("music-boss"),
    arcana: document.getElementById("music-arcana"),
    celestial: document.getElementById("music-celestial")
};

// Iniciar todas las músicas y silenciarlas (excepto main)
function startMusicSystem() {
    for (const track in musicTracks) {
        let audio = musicTracks[track];
        if (track === "main") {
            audio.volume = 0;
            audio.play().then(() => {
                // Fade in main music
                let progress = 0;
                const duration = 5000; // 2 seconds fade-in
                const step = 1 / (duration / 50);
                const fadeIn = setInterval(() => {
                    progress += 50;
                    audio.volume = Math.min(1, audio.volume + step);
                    if (progress >= duration) {
                        audio.volume = 1;
                        clearInterval(fadeIn);
                    }
                }, 50);
            }).catch(e => console.warn(`No se pudo iniciar main:`, e));
        } else {
            audio.volume = 0;
            audio.play().catch(e => console.warn(`No se pudo iniciar ${track}:`, e));
        }
    }
}

function transitionToMusic(targetKey, duration = 2000) {
    for (const key in musicTracks) {
        const audio = musicTracks[key];
        const startVolume = audio.volume;
        const endVolume = (key === targetKey) ? 1 : 0;
        const step = (endVolume - startVolume) / (duration / 50);

        let progress = 0;
        const fadeInterval = setInterval(() => {
            progress += 50;
            audio.volume = Math.min(1, Math.max(0, audio.volume + step));
            if (progress >= duration) {
                audio.volume = endVolume;
                clearInterval(fadeInterval);
            }
        }, 50);
    }
}