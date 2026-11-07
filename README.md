# ERA PVP — FiveM Loading Screen

A custom, dark-blue cinematic loading screen for the ERA PVP FiveM server. The first implementation is deliberately dependency-free: HTML, CSS, vanilla JavaScript and a small server-side Lua handover script.

> **Current release:** 0.2.0 — motion-graphics visual pass with layered HUD treatment, animated orbital linework, cinematic light sweeps and a restrained interference accent. Real ERA founder names/photos, the final soundtrack and Discord invite remain configurable because they have not yet been supplied or approved.

## Features

- ERA-branded, dark navy / electric-blue PVP interface.
- Original vector city-at-night backdrop with an independent animated motion-graphics overlay.
- Orbital HUD linework, diagonal light beams, a slow blue-white flash sweep and rare low-intensity signal interference.
- Connecting player's name from FiveM handover data.
- Real FiveM loadProgress event handling (0–100%; no fabricated live progress).
- Founder/staff cards configured in one file, with safe text rendering and avatar fallbacks.
- Local soundtrack player with play/pause, mute, volume persistence and Web Audio visualizer.
- Graceful missing-audio, missing-avatar and missing-Discord-link states.
- Optional Discord invite configured without hardcoded external dependencies.
- Browser-only design preview with an explicit preview label; preview progress never runs in FiveM.
- Reduced-motion support, responsive layout and no runtime framework/CDN dependencies.

## Quick installation

1. Copy this repository folder into your server's resources/[local]/ directory.
2. Add ensure era_loading (or the actual folder name you choose) to server.cfg.
3. Replace the example team entries and Discord URL in html/js/config.js.
4. Add your soundtrack at html/assets/audio/era-theme.mp3, or disable audio in the config.
5. Restart the resource/server and test with a real FiveM client.

See docs/INSTALLATION.md, docs/CONFIGURATION.md, docs/ART_DIRECTION.md and docs/TESTING.md.

## Project structure

```text
fxmanifest.lua
server.lua
html/
  index.html
  css/                 # design tokens, layout, components, motion
  js/                  # configuration and interface logic
  assets/images/       # local visual assets
  assets/audio/        # add the soundtrack here
docs/
```

## FiveM integration notes

- fxmanifest.lua registers html/index.html as the resource loading screen and enables the loading-screen cursor for its controls.
- server.lua passes the connecting player's name through deferrals.handover() during playerConnecting.
- The interface listens for FiveM's documented loadProgress message and initialization lifecycle events.
- The first release intentionally does not enable manual loading-screen shutdown. FiveM retains control of the normal loading-screen lifecycle, avoiding an extra failure mode where a player could be held on a custom screen.

## Developer checks

Node.js 18 or newer is sufficient; no dependencies need to be installed. Run:

```bash
npm run check
```

This checks JavaScript syntax, required project files, HTML ID uniqueness, local asset references and required FiveM integration hooks. It is a static check, not a substitute for a live FiveM client test.

## Browser preview

From the repository root, run a local static server:

```bash
python -m http.server 8080
```

Open http://localhost:8080/html/. The page identifies itself as LOCAL DESIGN PREVIEW and shows a clearly labelled demo progress animation. This is only a design preview; actual FiveM progress is used in-game.

## Release status

This is a first functional implementation, not a claim of final production sign-off. A real FiveM client/server test is required before live deployment. The custom 3D cinematic, owner/founder information, portrait assets, final music and community links remain content-integration items.
