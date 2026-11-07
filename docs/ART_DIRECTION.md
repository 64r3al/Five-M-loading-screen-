# ERA PVP — Art direction and motion-production brief

## Visual identity

- **Mood:** premium competitive PVP, cinematic, controlled, confident.
- **Palette:** midnight black #050B14, deep navy #0A1727, tactical blue #17324D, electric blue #2F80FF, ice cyan #7DD8FF, frost white #EAF3FF.
- **Contrast:** dark environment with restrained electric-blue accents. Avoid filling the screen with neon, glow or decorative noise.
- **Typography:** bold condensed display treatment for ERA; neutral system sans-serif for information; tracked uppercase micro-labels for the HUD.
- **Motion:** deliberate ease-out reveals, slow environment drift, restrained light sweeps and a thin progress indicator. Avoid constant high-frequency motion.

## Current visual foundation

html/assets/images/era-cityscape.svg is an original, locally bundled vector night-city composition. CSS supplies the slow camera drift, atmospheric glow, grain, scanline texture and vignette. This keeps the screen self-contained and avoids remote image dependencies.

## Later cinematic replacement (planned, not included in this release)

Create a 10–12 second seamless 1920×1080 cinematic loop in Blender and After Effects:

1. Build an original urban / industrial PVP environment. Do not use unlicensed server artwork or ripped third-party assets.
2. Establish blue-hour lighting, restrained volumetric haze and strong silhouette separation.
3. Use a slow, stable camera move. Keep the left-center and right HUD zones low-detail enough for text legibility.
4. Add restrained particles, light streaks and environment movement. Avoid aggressive strobing or bright flashes.
5. Composite ERA identity as a separate interface layer rather than baking text into the background footage.
6. Match the opening and closing frames and motion so the loop has no visible jump.

### Export guidance

- MP4 container, H.264 video, no audio track.
- 1920×1080, 24 or 30 fps, 10–12 seconds.
- Target approximately 5–12 MB; verify playback and decode behavior in the FiveM Chromium loading screen.
- Keep the SVG poster as the fallback image.
- The soundtrack stays in its separate audio element so users can control it independently.

Before enabling the cinematic in production, compare its decode cost with the current SVG backdrop on a lower-spec test PC. If it causes stutter, use the SVG fallback.

## Brand assets still required from ERA

- Approved ERA logo / wordmark if a final vector identity already exists.
- Owner and founder display names, exact role titles and approved portraits.
- Staff names and role titles if they should appear.
- Final server Discord invitation.
- Final soundtrack file and display metadata.
- Server-approved taglines and tips.
