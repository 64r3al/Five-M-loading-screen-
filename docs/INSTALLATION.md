# Installation

## Requirements

- A working FiveM FXServer.
- A resource folder on the server.
- Access to server.cfg.

The loading screen is a normal FiveM resource. It does not require Node.js, npm, a build step, a database, a framework or a CDN.

## Install

1. Copy the resource into a server resource directory, for example:

   ```text
   resources/[local]/era_loading/
   ```

2. Open server.cfg and add the resource after your resource folders are available:

   ```cfg
   ensure era_loading
   ```

   The resource folder must be named era_loading for this exact command. If you use a different folder name, update the command to match it.

3. Restart FXServer or run refresh followed by ensure era_loading in the server console.
4. Join with a FiveM client and confirm the loading screen appears.

## Optional: hide the default busy spinner

If you prefer ERA's own progress presentation without FiveM's separate bottom-right spinner, add this to server.cfg:

```cfg
setr sv_showBusySpinnerOnLoadingScreen false
```

This is optional and is a server-wide loading-screen presentation setting. Remove it to restore the default spinner behavior.

## Important lifecycle choice

The resource does not set loadscreen_manual_shutdown. It relies on FiveM's standard loading-screen lifecycle. Do not add a manual shutdown native unless a later, separately tested feature requires it.

## Troubleshooting

- **Default loading screen still appears:** confirm the resource is ensured, fxmanifest.lua is at the resource root, and no other loading-screen resource is being used instead.
- **Player name is shown as PLAYER:** check the server console for [ERA Loading] messages and verify the server resource's playerConnecting handler is running.
- **Cursor is hidden:** confirm loadscreen_cursor 'yes' is present in fxmanifest.lua.
- **Music says ADD TRACK:** add a playable MP3 at html/assets/audio/era-theme.mp3 and check the filename/path in html/js/config.js.
- **A team image is missing:** verify its configured path is relative to html/, and that the file is included by the manifest.
