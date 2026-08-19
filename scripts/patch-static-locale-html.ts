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
let verified = 0;

for (const file of enHtmlFiles) {
  const current = readFileSync(file, 'utf8');
  const result = normalizeEnglishStaticHtml(current, path.relative(process.cwd(), file));

  if (result.status === 'patched') {
    writeFileSync(file, result.html);
    patched += 1;
  } else {
    alreadyCorrect += 1;
  }

  verified += 1;
}

console.log(
  `Verified ${verified}/${enHtmlFiles.length} English static HTML files (${patched} patched, ${alreadyCorrect} already correct).`,
);
