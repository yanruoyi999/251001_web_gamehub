import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

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

for (const file of enHtmlFiles) {
  const current = readFileSync(file, 'utf8');
  const next = current.replace(
    /<html lang="zh" data-locale="zh"/,
    '<html lang="en" data-locale="en"',
  );

  if (next !== current) {
    writeFileSync(file, next);
    patched += 1;
  }
}

console.log(`Patched ${patched}/${enHtmlFiles.length} English static HTML files.`);
