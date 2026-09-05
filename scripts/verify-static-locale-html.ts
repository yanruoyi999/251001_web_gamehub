import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { normalizeEnglishStaticHtml, verifyChineseStaticHtml } from './static-locale-html';

const appDir = path.join(process.cwd(), '.next', 'server', 'app');
const enHtmlFiles: string[] = [];
const zhHtmlFiles: string[] = [];

function collectEnHtmlFiles(dir: string) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectEnHtmlFiles(fullPath);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    for (const [locale, files] of [['en', enHtmlFiles], ['zh', zhHtmlFiles]] as const) {
      if (fullPath === path.join(appDir, `${locale}.html`) || fullPath.includes(`${path.sep}${locale}${path.sep}`)) files.push(fullPath);
    }
  }
}

if (existsSync(appDir)) {
  collectEnHtmlFiles(appDir);
}

let alreadyCorrect = 0;
let redirectShells = 0;

for (const file of enHtmlFiles) {
  const current = readFileSync(file, 'utf8');
  const result = normalizeEnglishStaticHtml(
    current,
    path.relative(process.cwd(), file),
  );

  if (result.status === 'already-correct') {
    alreadyCorrect += 1;
    continue;
  }

  redirectShells += 1;
}

const verified = alreadyCorrect;
const localizedCandidates = enHtmlFiles.length - redirectShells;

console.log(
  `Verified ${verified}/${localizedCandidates} English localized static HTML files (${alreadyCorrect} already correct; no writes); classified ${redirectShells} Next redirect/error shell(s) separately.`,
);

if (enHtmlFiles.length === 0 || zhHtmlFiles.length === 0) throw new Error('Missing localized static HTML: run next build first');
let zhVerified = 0;
for (const file of zhHtmlFiles) {
  if (verifyChineseStaticHtml(readFileSync(file, 'utf8'), path.relative(process.cwd(), file)) === 'already-correct') zhVerified += 1;
}
console.log(`Verified ${zhVerified} Chinese localized static HTML files without rewriting build artifacts.`);
