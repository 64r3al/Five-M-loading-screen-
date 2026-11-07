/*
 * ERA PVP loading-screen configuration.
 * Replace the clearly marked placeholders with your real server/team details.
 * Keep asset paths relative to this file's parent (html/).
 */
window.ERA_CONFIG = {
    server: {
        name: 'ERA PVP',
        tagline: 'ENTER THE ARENA',
        discordUrl: '', // Example: https://discord.gg/your-invite
    },
    team: [
        { role: 'OWNER', name: 'NAME TO BE ADDED', initials: 'ER', avatar: '', placeholder: true },
        { role: 'FOUNDER', name: 'NAME TO BE ADDED', initials: 'ER', avatar: '', placeholder: true },
        { role: 'FOUNDER', name: 'NAME TO BE ADDED', initials: 'ER', avatar: '', placeholder: true },
    ],
    audio: {
        enabled: true,
        source: 'assets/audio/era-theme.mp3',
        title: 'ERA ORIGINAL SOUNDTRACK',
        artist: 'ERA PVP',
        defaultVolume: 0.35,
    },
    tips: [
        'WELCOME TO ERA PVP. PLAY SMART. PLAY FAIR.',
        'CHECK THE SERVER RULES BEFORE ENTERING COMBAT.',
        'RESPECT THE COMMUNITY. LET YOUR SKILL SPEAK.',
    ],
};
