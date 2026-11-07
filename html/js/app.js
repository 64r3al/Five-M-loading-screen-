(() => {
    'use strict';

    const DEFAULT_CONFIG = {
        server: { name: 'ERA PVP', tagline: 'ENTER THE ARENA', discordUrl: '' },
        team: [],
        audio: { enabled: false, source: '', title: 'ERA ORIGINAL SOUNDTRACK', artist: 'ERA PVP', defaultVolume: 0.35 },
        tips: [],
    };

    const config = window.ERA_CONFIG || DEFAULT_CONFIG;
    const byId = (id) => document.getElementById(id);
    const elements = {
        playerName: byId('player-name'),
        connectionLabel: byId('connection-label'),
        crewList: byId('crew-list'),
        loadingState: byId('loading-state'),
        loadingMessage: byId('loading-message'),
        loadingSubtext: byId('loading-subtext'),
        loadingTip: byId('loading-tip'),
        loadingPercent: byId('loading-percent'),
        progressTrack: byId('progress-track'),
        progressFill: byId('progress-fill'),
        previewBadge: byId('preview-badge'),
        announcer: byId('announcer'),
        audio: byId('background-audio'),
        playButton: byId('play-button'),
        muteButton: byId('mute-button'),
        volumeSlider: byId('volume-slider'),
        audioStatus: byId('audio-status'),
        trackTitle: byId('track-title'),
        trackArtist: byId('track-artist'),
        visualizer: byId('visualizer'),
        discordLink: byId('discord-link'),
    };

    // Only run demo progress on an explicitly local browser preview. Never fabricate progress in unknown/NUI contexts.
    const isLocalPreview = window.location.protocol === 'file:' ||
        ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
    const state = {
        progress: 0,
        hasReceivedProgress: false,
        currentMessage: 'INITIALIZING YOUR SESSION',
        audioReady: false,
        isMuted: false,
        audioContext: null,
        analyser: null,
        sourceNode: null,
        animationFrame: 0,
    };

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const safeText = (value, fallback) => {
        if (typeof value !== 'string') return fallback;
        const normalized = value.trim();
        return normalized.length ? normalized.slice(0, 48) : fallback;
    };

    function setProgress(fraction) {
        if (!Number.isFinite(fraction)) return;
        const normalized = clamp(fraction, 0, 1);
        state.progress = Math.max(state.progress, normalized);
        state.hasReceivedProgress = true;
        const percent = Math.round(state.progress * 100);
        elements.progressFill.style.width = `${state.progress * 100}%`;
        elements.progressTrack.setAttribute('aria-valuenow', String(percent));
        const percentText = elements.loadingPercent.firstChild;
        if (percentText && percentText.nodeType === 3) percentText.textContent = String(percent);
        else elements.loadingPercent.textContent = `${percent}%`;
        elements.loadingState.textContent = percent >= 100 ? 'GAME DATA LOADED' : 'LIVE CONNECTION PROGRESS';
        elements.connectionLabel.textContent = percent >= 100 ? 'DATA READY' : 'ESTABLISHING LINK';
        if (percent >= 100) {
            elements.loadingMessage.textContent = 'FINALIZING YOUR SESSION';
            elements.loadingSubtext.textContent = 'ALMOST THERE';
        }
    }

    function setStage(label, supportingText) {
        elements.loadingMessage.textContent = label;
        if (supportingText) elements.loadingSubtext.textContent = supportingText;
        state.currentMessage = label;
    }

    function renderPlayer() {
        const handover = window.nuiHandoverData && typeof window.nuiHandoverData === 'object'
            ? window.nuiHandoverData
            : {};
        elements.playerName.textContent = safeText(handover.name, 'PLAYER');
    }

    function createCrewCard(member) {
        const card = document.createElement('article');
        card.className = 'crew-card';

        const avatar = document.createElement('div');
        avatar.className = 'crew-card__avatar';
        avatar.setAttribute('aria-hidden', 'true');
        const name = safeText(member.name, 'NAME TO BE ADDED');
        const initials = safeText(member.initials, 'ER').slice(0, 2).toUpperCase();

        if (typeof member.avatar === 'string' && member.avatar.trim()) {
            const image = document.createElement('img');
            image.src = member.avatar;
            image.alt = '';
            image.loading = 'lazy';
            image.addEventListener('error', () => {
                avatar.textContent = initials;
                avatar.classList.add('crew-card__avatar--fallback');
            }, { once: true });
            avatar.appendChild(image);
        } else {
            avatar.textContent = initials;
            avatar.classList.add('crew-card__avatar--fallback');
        }

        const info = document.createElement('div');
        info.className = 'crew-card__info';
        const role = document.createElement('span');
        role.textContent = safeText(member.role, 'TEAM');
        const displayName = document.createElement('strong');
        displayName.textContent = name;
        info.append(role, displayName);

        const marker = document.createElement('span');
        marker.className = 'crew-card__arrow';
        marker.setAttribute('aria-hidden', 'true');
        marker.textContent = member.placeholder ? '—' : '↗';

        card.append(avatar, info, marker);
        return card;
    }

    function renderCrew() {
        const team = Array.isArray(config.team) ? config.team.slice(0, 5) : [];
        elements.crewList.replaceChildren();

        if (!team.length) {
            const empty = document.createElement('div');
            empty.className = 'crew-empty';
            empty.textContent = 'TEAM PROFILES WILL APPEAR HERE';
            elements.crewList.appendChild(empty);
            return;
        }
        team.forEach((member) => elements.crewList.appendChild(createCrewCard(member || {})));
    }

    function configureIdentity() {
        const server = config.server || DEFAULT_CONFIG.server;
        const serverName = safeText(server.name, 'ERA PVP');
        const tagline = safeText(server.tagline, 'ENTER THE ARENA');
        document.title = `${serverName} — Enter the Arena`;
        const taglineNode = document.querySelector('.intro__subline span:nth-child(2)');
        if (taglineNode) taglineNode.textContent = tagline;
    }

    function configureDiscord() {
        const raw = config.server && config.server.discordUrl;
        if (typeof raw !== 'string' || !/^https:\/\/(discord\.gg|discord\.com)\//i.test(raw.trim())) {
            elements.discordLink.removeAttribute('href');
            elements.discordLink.setAttribute('aria-disabled', 'true');
            elements.discordLink.setAttribute('tabindex', '-1');
            return;
        }
        elements.discordLink.href = raw.trim();
        elements.discordLink.target = '_blank';
        elements.discordLink.rel = 'noopener noreferrer';
        elements.discordLink.removeAttribute('aria-disabled');
        elements.discordLink.removeAttribute('tabindex');
    }

    function storageGet(key) {
        try { return window.localStorage.getItem(key); } catch (_) { return null; }
    }

    function storageSet(key, value) {
        try { window.localStorage.setItem(key, value); } catch (_) { /* Storage is optional in CEF. */ }
    }

    function setAudioStatus(message, ready = false) {
        elements.audioStatus.textContent = message;
        elements.audioStatus.classList.toggle('music-player__status--ready', ready);
    }

    function setPlaying(isPlaying) {
        elements.playButton.classList.toggle('is-playing', isPlaying);
        elements.playButton.setAttribute('aria-label', isPlaying ? 'Pause music' : 'Play music');
        elements.playButton.title = isPlaying ? 'Pause music' : 'Play music';
        elements.visualizer.classList.toggle('is-active', isPlaying);
    }

    function configureAudio() {
        const audioConfig = config.audio || DEFAULT_CONFIG.audio;
        elements.trackTitle.textContent = safeText(audioConfig.title, 'ERA ORIGINAL SOUNDTRACK');
        elements.trackArtist.textContent = safeText(audioConfig.artist, 'ERA PVP');

        const configuredVolume = Number.isFinite(Number(audioConfig.defaultVolume))
            ? clamp(Number(audioConfig.defaultVolume), 0, 1)
            : 0.35;
        const storedVolume = Number(storageGet('era-audio-volume'));
        const initialVolume = Number.isFinite(storedVolume) && storedVolume >= 0 && storedVolume <= 1
            ? storedVolume
            : configuredVolume;
        elements.audio.volume = initialVolume;
        elements.volumeSlider.value = String(Math.round(initialVolume * 100));

        const source = typeof audioConfig.source === 'string' ? audioConfig.source.trim() : '';
        if (!audioConfig.enabled || !source) {
            setAudioStatus('MUSIC OFF');
            elements.trackArtist.textContent = 'SOUNDTRACK NOT CONFIGURED';
            disableAudioControls();
            return;
        }

        elements.audio.src = source;
        elements.audio.addEventListener('canplaythrough', () => {
            state.audioReady = true;
            elements.playButton.disabled = false;
            elements.volumeSlider.disabled = false;
            elements.muteButton.disabled = false;
            setAudioStatus('READY', true);
        }, { once: true });
        elements.audio.addEventListener('error', () => {
            state.audioReady = false;
            setPlaying(false);
            setAudioStatus('ADD TRACK');
            elements.trackArtist.textContent = 'PLACE era-theme.mp3 IN /audio';
            disableAudioControls();
        }, { once: true });
        elements.audio.load();
        disableAudioControls();
        setAudioStatus('LOADING');
    }

    function disableAudioControls() {
        elements.playButton.disabled = true;
        elements.volumeSlider.disabled = true;
        elements.muteButton.disabled = true;
    }

    async function startMusic() {
        if (!state.audioReady) return;
        try {
            if (!state.audioContext && window.AudioContext) {
                state.audioContext = new window.AudioContext();
                state.analyser = state.audioContext.createAnalyser();
                state.analyser.fftSize = 64;
                state.sourceNode = state.audioContext.createMediaElementSource(elements.audio);
                state.sourceNode.connect(state.analyser);
                state.analyser.connect(state.audioContext.destination);
            }
            if (state.audioContext && state.audioContext.state === 'suspended') {
                await state.audioContext.resume();
            }
            await elements.audio.play();
            setPlaying(true);
            setAudioStatus('PLAYING', true);
            startVisualizer();
        } catch (error) {
            setPlaying(false);
            setAudioStatus('TAP TO PLAY');
            console.warn('[ERA Loading] Audio playback could not start:', error);
        }
    }

    function stopMusic() {
        elements.audio.pause();
        setPlaying(false);
        setAudioStatus('PAUSED', state.audioReady);
        if (state.animationFrame) cancelAnimationFrame(state.animationFrame);
        state.animationFrame = 0;
        elements.visualizer.style.setProperty('--level', '0.2');
    }

    function startVisualizer() {
        if (!state.analyser || state.animationFrame) return;
        const bins = new Uint8Array(state.analyser.frequencyBinCount);
        const bars = Array.from(elements.visualizer.children);
        const draw = () => {
            state.analyser.getByteFrequencyData(bins);
            bars.forEach((bar, index) => {
                const value = bins[index % bins.length] / 255;
                bar.style.transform = `scaleY(${0.18 + value * 0.95})`;
            });
            state.animationFrame = requestAnimationFrame(draw);
        };
        state.animationFrame = requestAnimationFrame(draw);
    }

    function bindAudioControls() {
        elements.playButton.addEventListener('click', () => {
            if (elements.audio.paused) startMusic();
            else stopMusic();
        });

        elements.muteButton.addEventListener('click', () => {
            state.isMuted = !state.isMuted;
            elements.audio.muted = state.isMuted;
            elements.muteButton.setAttribute('aria-label', state.isMuted ? 'Unmute music' : 'Mute music');
            elements.muteButton.title = state.isMuted ? 'Unmute music' : 'Mute music';
            setAudioStatus(state.isMuted ? 'MUTED' : (elements.audio.paused ? 'PAUSED' : 'PLAYING'), state.audioReady);
        });

        elements.volumeSlider.addEventListener('input', (event) => {
            const volume = clamp(Number(event.target.value) / 100, 0, 1);
            elements.audio.volume = volume;
            storageSet('era-audio-volume', String(volume));
            if (volume > 0 && state.isMuted) {
                state.isMuted = false;
                elements.audio.muted = false;
                elements.muteButton.setAttribute('aria-label', 'Mute music');
            }
        });
    }

    function handleFiveMMessage(event) {
        const data = event && event.data;
        if (!data || typeof data !== 'object' || typeof data.eventName !== 'string') return;

        switch (data.eventName) {
            case 'loadProgress':
                if (typeof data.loadFraction === 'number') setProgress(data.loadFraction);
                break;
            case 'startDataFileEntries':
                setStage('PREPARING GAME ASSETS', 'LOADING SERVER CONTENT');
                break;
            case 'endDataFileEntries':
                setStage('VERIFYING GAME DATA', 'CHECKING LOADED CONTENT');
                break;
            case 'startInitFunction':
                setStage('INITIALIZING GAME SYSTEMS', 'SETTING UP YOUR SESSION');
                break;
            case 'endInitFunction':
                setStage('FINALIZING CONNECTION', 'WAITING FOR GAME HANDOFF');
                break;
            case 'startInitFunctionOrder':
                setStage('PREPARING GAME SYSTEMS', 'SETTING UP YOUR SESSION');
                break;
            case 'initFunctionInvoking':
                if (typeof data.name === 'string' && data.name.trim()) {
                    setStage(`INITIALIZING ${data.name.trim().slice(0, 42).toUpperCase()}`, 'SETTING UP YOUR SESSION');
                }
                break;
            case 'initFunctionInvoked':
                setStage('GAME SYSTEM INITIALIZED', 'PREPARING THE NEXT STAGE');
                break;
            case 'onLogLine':
                if (typeof data.message === 'string' && data.message.trim()) {
                    const line = data.message.replace(/\\s+/g, ' ').trim().slice(0, 72);
                    setStage(line.toUpperCase(), 'FIVE M CONNECTION UPDATE');
                }
                break;
            default:
                break;
        }
    }

    function startTipRotation() {
        const tips = Array.isArray(config.tips)
            ? config.tips.filter((tip) => typeof tip === 'string' && tip.trim()).slice(0, 12)
            : [];
        if (!tips.length) return;
        let index = 0;
        elements.loadingTip.textContent = tips[index].trim().slice(0, 110);
        if (tips.length < 2) return;
        window.setInterval(() => {
            index = (index + 1) % tips.length;
            elements.loadingTip.classList.add('is-changing');
            window.setTimeout(() => {
                elements.loadingTip.textContent = tips[index].trim().slice(0, 110);
                elements.loadingTip.classList.remove('is-changing');
            }, 180);
        }, 8500);
    }

    function startBrowserPreview() {
        elements.previewBadge.hidden = false;
        elements.loadingState.textContent = 'BROWSER PREVIEW — NOT LIVE GAME DATA';
        elements.connectionLabel.textContent = 'DESIGN PREVIEW';
        elements.playerName.textContent = 'YOUR PLAYER NAME';
        setStage('PREVIEWING THE ERA EXPERIENCE', 'LIVE PROGRESS APPEARS IN FIVE M');

        // This demonstration runs only in a normal browser. FiveM always uses real loadProgress events.
        let previewValue = 0;
        const previewTimer = window.setInterval(() => {
            if (previewValue >= 0.91) {
                window.clearInterval(previewTimer);
                return;
            }
            previewValue += 0.012 + Math.random() * 0.025;
            setProgress(Math.min(previewValue, 0.91));
            if (previewValue > 0.48) setStage('LOADING SERVER CONTENT', 'PREVIEW ONLY — WAITING FOR FIVE M');
        }, 520);
    }

    function init() {
        renderPlayer();
        renderCrew();
        configureIdentity();
        configureDiscord();
        configureAudio();
        bindAudioControls();
        startTipRotation();
        window.addEventListener('message', handleFiveMMessage);

        if (isLocalPreview) startBrowserPreview();

        window.addEventListener('pagehide', () => {
            if (state.animationFrame) cancelAnimationFrame(state.animationFrame);
            elements.audio.pause();
            if (state.audioContext && state.audioContext.state !== 'closed') state.audioContext.close().catch(() => {});
        }, { once: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
