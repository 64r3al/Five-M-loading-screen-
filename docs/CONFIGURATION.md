# Configuration

All player-facing content is centralized in html/js/config.js.

## Server identity and Discord

```js
server: {
    name: 'ERA PVP',
    tagline: 'ENTER THE ARENA',
    discordUrl: 'https://discord.gg/your-invite',
}
```

The Discord button remains inactive until a valid HTTPS Discord invite is provided. Only use an invite controlled by the ERA team.

## Owner, founders and staff

Edit the team array. Example:

```js
team: [
    {
        role: 'OWNER',
        name: 'Actual owner name',
        initials: 'AB',
        avatar: 'assets/images/owner.webp',
        placeholder: false,
    },
]
```

- role: visible role label (OWNER, FOUNDER, MANAGEMENT, DEVELOPMENT, etc.).
- name: display name.
- initials: two-character fallback if there is no portrait or an image fails to load.
- avatar: local path relative to html/; use an empty string for initials only.
- placeholder: use true for an entry that still needs real details; the card shows a neutral dash instead of an external-link marker.

The UI displays up to five profiles. Use real names and images only after the people involved have approved them.

## Music

1. Place your soundtrack at html/assets/audio/era-theme.mp3.
2. Configure:

```js
audio: {
    enabled: true,
    source: 'assets/audio/era-theme.mp3',
    title: 'YOUR TRACK TITLE',
    artist: 'ERA PVP',
    defaultVolume: 0.35,
}
```

3. Set enabled: false to hide the unavailable state and leave the audio controls inactive.

The first user interaction starts playback because embedded Chromium may restrict autoplay. The player's volume is stored locally when storage is available. No remote audio source is required.

## Loading tips

Edit the tips array to add server-approved hints. The interface rotates through these tips in the loading footer. Keep each tip short, server-approved and useful; empty strings are ignored.

## Player name and progress

Do not hardcode either value. The player's name is supplied by server.lua through FiveM's handover object. The progress bar listens to FiveM's actual loadProgress event. The page's simulated progress is strictly limited to ordinary browser preview mode.
