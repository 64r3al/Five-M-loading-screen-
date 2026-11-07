# QA and release checklist

## Static checks

Run npm run check from the repository root first. It verifies JavaScript syntax, required project files, duplicate DOM IDs, local HTML assets and the core FiveM integration hooks.

- [ ] fxmanifest.lua is at the resource root and references existing files.
- [ ] html/index.html loads all local CSS and JavaScript files.
- [ ] No external runtime scripts, fonts, images or CDN calls are required.
- [ ] JavaScript parses without syntax errors.
- [ ] Lua syntax is accepted by the FXServer runtime.
- [ ] All configured image/audio paths exist or fail gracefully.

## Browser preview

- [ ] Open the local preview at http://localhost:8080/html/.
- [ ] Confirm LOCAL DESIGN PREVIEW is visible.
- [ ] Confirm preview progress is identified as demo-only and never reports 100%.
- [ ] Confirm the ERA layout is readable at 1920×1080, 1600×900, 1366×768 and 1280×720.
- [ ] Confirm a narrow viewport collapses the crew panel without overlapping the progress and music controls.
- [ ] Confirm keyboard focus rings are visible.
- [ ] Confirm reduced-motion preference disables nonessential animation.
- [ ] Confirm there are no uncaught JavaScript errors or missing asset requests.

## FiveM integration (must be tested with a real client)

- [ ] Ensure the resource on a test FXServer.
- [ ] Confirm the loading screen appears during a fresh connection.
- [ ] Confirm the actual connecting player's name is displayed.
- [ ] Confirm special characters in player names are rendered as text, not HTML.
- [ ] Confirm the progress bar changes only when FiveM sends loadProgress.
- [ ] Confirm progress never moves backwards and never fabricates completion.
- [ ] Confirm FiveM closes the screen through its normal lifecycle.
- [ ] Reconnect and verify the loading screen initializes again.
- [ ] Check the FiveM client console and FXServer console for errors.

## Optional assets and controls

- [ ] Add the final soundtrack and test play, pause, mute and volume.
- [ ] Confirm missing audio leaves the rest of the screen functional.
- [ ] Confirm volume preference persists when browser storage is available.
- [ ] Add owner/founder images; verify fallback initials when an image is missing.
- [ ] Add the approved Discord invite and verify the link opens correctly in the target FiveM client.
- [ ] Confirm no external link is clickable while unconfigured.

## Performance and release gate

- [ ] Test on at least one lower-spec PC and one higher-spec PC.
- [ ] Check CPU/GPU usage and memory while the loading screen is displayed.
- [ ] Check for video decode stutter after the future cinematic is added.
- [ ] No known blocking defect remains open.
- [ ] Record the tested FXServer artifact and client build with the release notes.
- [ ] Do not call a release FiveM-verified until the real-client checks above have been run.
