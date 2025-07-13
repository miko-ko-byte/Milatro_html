const musicTracks = {
    main: document.getElementById("music-main"),
    shop: document.getElementById("music-shop"),
    boss: document.getElementById("music-boss"),
    arcana: document.getElementById("music-arcana"),
    celestial: document.getElementById("music-celestial"),
    blackCard: document.getElementById("music-blackcard"),
    miku: document.getElementById("music-miku")
};

const AudioEngine = {
    currentTrack: null,
    isInitialized: false,
    maxVolume: 1.0,
    syncedTracks: new Set(), // Tracks que están sincronizados
    
    startMusicSystem() {
        if (this.isInitialized) return;
        
        // Configurar propiedades iniciales
        Object.values(musicTracks).forEach(track => {
            console.log("Configurando track:", track.id);
            track.volume = 0;
            track.currentTime = 0;
            track.loop = true;
            track.preload = "auto";
            
            // Manejar errores de carga
            track.addEventListener('error', (e) => {
                console.error(`Error cargando track ${track.id}:`, e);
            });
        });
        
        this.isInitialized = true;
        console.log("Sistema de audio inicializado");
    },

    // Método para sincronizar todos los tracks con el actual
    async syncAllTracks() {
        if (!this.currentTrack) return;
        
        const currentTime = this.currentTrack.currentTime;
        const trackPromises = [];
        
        Object.values(musicTracks).forEach(track => {
            if (track !== this.currentTrack && (!this.syncedTracks.has(track) || track.paused)) {
                console.log(`Syncing ${track.id} (paused: ${track.paused}, not synced: ${!this.syncedTracks.has(track)}). Current time: ${currentTime}`);
                track.currentTime = currentTime;
                track.volume = 0;
                
                // Reproducir silenciosamente para sincronizar
                const playPromise = this.playWithTimeout(track).then(() => {
                    console.log(`Syncing ${track.id}: currentTime is now ${track.currentTime} after playWithTimeout`);
                }).catch(error => {
                    console.error(`Error sincronizando track ${track.id}:`, error);
                });
                trackPromises.push(playPromise);
                this.syncedTracks.add(track);
            }
        });
        
        await Promise.all(trackPromises);
        console.log("Tracks sincronizados");
    },

    async transitionToMusic(targetKey, duration = 2000) {
        if (!this.isInitialized || !musicTracks[targetKey]) return;

        const targetTrack = musicTracks[targetKey];
        if (this.currentTrack === targetTrack) return;

        try {
            if (this.currentTrack) {
                // Sincronizar todos los tracks si aún no están sincronizados
                await this.syncAllTracks();
                
                // El track objetivo ya debería estar sincronizado
                // Solo hacer el crossfade
                this._fadeOut(this.currentTrack, duration);
                this._fadeIn(targetTrack, duration);
            } else {
                // Primer track a reproducir
                await this.playWithTimeout(targetTrack);
                this._fadeIn(targetTrack, duration);
                
                // Después de iniciar el primer track, sincronizar los demás
                setTimeout(() => {
                    this.syncAllTracks();
                }, 1000); // Dar tiempo a que se estabilice
            }
            
            this.currentTrack = targetTrack;
            console.log(`Transición a ${targetKey} completada`);
            
        } catch (error) {
            console.error(`Error en transición a ${targetKey}:`, error);
        }
    },

    _fadeOut(track, duration) {
        console.log(`Fading out track: ${track.id}`);
        const initialVolume = track.volume;
        const startTime = performance.now();

        const fade = () => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            track.volume = initialVolume * (1 - progress);
           // console.log(`Fading out ${track.id}, progress: ${progress}, volume: ${track.volume}`);

            if (progress < 1) {
                requestAnimationFrame(fade);
            } else {
                track.volume = 0;
                // Pausar el track cuando termine el fade out
                track.pause();
                console.log(`Faded out and paused track: ${track.id}`);
            }
        };

        requestAnimationFrame(fade);
    },

    _fadeIn(track, duration) {
        console.log(`Fading in track: ${track.id}`);
        const targetVolume = this.getMasterVolume();
        track.volume = 0;
        const startTime = performance.now();

        const fade = () => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            track.volume = targetVolume * progress;
           // console.log(`Fading in ${track.id}, progress: ${progress}, volume: ${track.volume}`);

            if (progress < 1) {
                requestAnimationFrame(fade);
            } else {
                track.volume = targetVolume;
                console.log(`Faded in track: ${track.id}`);
            }
        };

        requestAnimationFrame(fade);
    },

    // Método para iniciar el primer track
    async startMainTrack() {
        if (!this.isInitialized) {
            console.error("Sistema de audio no inicializado");
            return;
        }

        try {
            const mainTrack = musicTracks.main;
            await this.playWithTimeout(mainTrack);
            mainTrack.volume = this.getMasterVolume();
            this.currentTrack = mainTrack;
            console.log("Track principal iniciado");
        } catch (error) {
            console.error("Error iniciando track principal:", error);
        }
    },

    // Método para pausar toda la música
    pauseAll() {
        Object.values(musicTracks).forEach(track => {
            track.pause();
        });
        this.currentTrack = null;
    },

    sfx(name) {
        const audio = new Audio(`./sfx/${name}.ogg`);
        audio.volume = this.getMasterVolume();
        audio.play().catch(error => {
            console.error(`Error playing SFX ${name}:`, error);
        });
    },

    updateVolume() {
        if (this.currentTrack) {
            this.currentTrack.volume = this.getMasterVolume();
        }
    },

    getMasterVolume() {
        return (gameState.settings.masterVolume / 100) * this.maxVolume;
    },

    async playWithTimeout(track) {
        try {
            // No llamar a load(), simplemente intentar reproducir.
            // El navegador manejará el estado de carga.
            await track.play();
        } catch (error) {
            console.error(`Error playing track ${track.id}:`, error);
            // No volver a intentar ni lanzar error para no interrumpir el flujo.
        }
    }
};

// Funciones de mapeo
function sfx(params) {
    AudioEngine.sfx(params);
}

function fadeToTrack(params, t) {
    console.log("Fade to track:", params);
    AudioEngine.transitionToMusic(params, t);
}

function transitionToMusic(params, t) {
    console.log("Transition to music:", params);
    AudioEngine.transitionToMusic(params, t);
}

function updateVolume() {
    console.log("Update volume");
    AudioEngine.updateVolume();
}

var started = true;

async function startMusicSystem() {
    console.log("Iniciando sistema de música");
    if (started) {
        // Manejar AudioContext
        if (window.AudioContext || window.webkitAudioContext) {
            const ctx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
            window.audioCtx = ctx;
            if (ctx.state === "suspended") {
                await ctx.resume();
                console.log("AudioContext resumed");
            }
        }
        
        // Solo inicializar el sistema, NO reproducir música aún
        AudioEngine.startMusicSystem();
        started = false;
        
        // Opcionalmente, iniciar el track principal después de un breve delay
        // setTimeout(() => {
        //     AudioEngine.startMainTrack();
        // }, 1000);
    }
}