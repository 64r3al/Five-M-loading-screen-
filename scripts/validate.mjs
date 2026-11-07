import { readFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'fxmanifest.lua', 'server.lua', 'html/index.html',
  'html/css/tokens.css', 'html/css/layout.css', 'html/css/components.css', 'html/css/motion.css',
  'html/js/config.js', 'html/js/app.js', 'html/assets/images/era-cityscape.svg',
  'html/assets/audio/ADD-MUSIC-HERE.txt',
  'README.md', 'docs/INSTALLATION.md', 'docs/CONFIGURATION.md', 'docs/ART_DIRECTION.md', 'docs/TESTING.md',
];

for (const file of requiredFiles) {
  await access(path.join(root, file), constants.R_OK);
}

const html = await readFile(path.join(root, 'html/index.html'), 'utf8');
const app = await readFile(path.join(root, 'html/js/app.js'), 'utf8');
const manifest = await readFile(path.join(root, 'fxmanifest.lua'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicateIds.length) throw new Error(`Duplicate HTML IDs: ${[...new Set(duplicateIds)].join(', ')}`);

const idSet = new Set(ids);
const appIds = [...app.matchAll(/byId\('([^']+)'\)/g)].map((match) => match[1]);
const missingIds = [...new Set(appIds.filter((id) => !idSet.has(id)))];
if (missingIds.length) throw new Error(`JavaScript references missing DOM IDs: ${missingIds.join(', ')}`);

for (const match of html.matchAll(/(?:src|href)="(?!https?:|#|data:)([^"?]+)"/g)) {
  const relative = match[1];
  await access(path.join(root, 'html', relative), constants.R_OK);
}

for (const expected of ["loadscreen 'html/index.html'", "loadscreen_cursor 'yes'", "server_script 'server.lua'"]) {
  if (!manifest.includes(expected)) throw new Error(`fxmanifest.lua is missing: ${expected}`);
}
if (!app.includes("data.eventName !== 'loadProgress'") && !app.includes("case 'loadProgress'")) {
  throw new Error('The UI does not handle FiveM loadProgress messages.');
}
if (!app.includes('window.nuiHandoverData')) throw new Error('The UI does not read FiveM handover data.');

console.log(`ERA Loading validation passed (${requiredFiles.length} required files, ${ids.length} unique DOM IDs).`);
