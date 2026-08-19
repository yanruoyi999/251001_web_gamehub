import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { normalizeEnglishStaticHtml } from './static-locale-html';

const appDir = path.join(process.cwd(), '.next', 'server', 'app');
const enHtmlFiles: string[] = [];

function collectEnHtmlFiles(dir: string) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectEnHtmlFiles(fullPath);
      continue;
    }

    if (
      entry.isFile() &&
      entry.name.endsWith('.html') &&
      (fullPath === path.join(appDir, 'en.html') ||
        fullPath.includes(`${path.sep}en${path.sep}`))
    ) {
      enHtmlFiles.push(fullPath);
    }
  }
}

if (existsSync(appDir)) {
  collectEnHtmlFiles(appDir);
}

let patched = 0;
let alreadyCorrect = 0;
let redirectShells = 0;

for (const file of enHtmlFiles) {
  const current = readFileSync(file, 'utf8');
  const result = normalizeEnglishStaticHtml(
    current,
    path.relative(process.cwd(), file),
  );

  if (result.status === 'patched') {
    writeFileSync(file, result.html);
    patched += 1;
    continue;
  }

  if (result.status === 'already-correct') {
    alreadyCorrect += 1;
    continue;
  }

  redirectShells += 1;
}

const verified = patched + alreadyCorrect;
const localizedCandidates = enHtmlFiles.length - redirectShells;

console.log(
  `Verified ${verified}/${localizedCandidates} English localized static HTML files (${patched} patched, ${alreadyCorrect} already correct); classified ${redirectShells} Next redirect/error shell(s) separately.`,
);
