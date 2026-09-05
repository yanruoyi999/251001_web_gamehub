import { cp, mkdtemp, readFile, rm, stat, symlink, utimes } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { normalizeEnglishStaticHtml, verifyChineseStaticHtml } from './static-locale-html';

const root = process.cwd();
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const routes = [
  { url: '/en', cache: 'en', locale: 'en' },
  { url: '/en/games/stacker-game', cache: 'en/games/stacker-game', locale: 'en' },
  { url: '/en/guides/google-snake-mods', cache: 'en/guides/google-snake-mods', locale: 'en' },
  { url: '/', cache: 'zh', locale: 'zh' },
  { url: '/games/stacker-game', cache: 'zh/games/stacker-game', locale: 'zh' },
  { url: '/guides/google-snake-mods', cache: 'zh/guides/google-snake-mods', locale: 'zh' },
] as const;

async function freePort() {
  const server = createServer();
  await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const port = (server.address() as { port: number }).port;
  await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  return port;
}

async function main() {
  await stat(path.join(root, '.next/BUILD_ID'));
  const directory = await mkdtemp(path.join(os.tmpdir(), 'luma-isr-locale-'));
  let child: ReturnType<typeof spawn> | undefined;
  let serverLog = '';
  try {
    // Never alter the working build or production. Expire only this throwaway copy.
    for (const file of ['.next', 'next.config.js', 'package.json', 'i18n', 'public']) {
      await cp(path.join(root, file), path.join(directory, file), { recursive: true, preserveTimestamps: true });
    }
    await symlink(path.join(root, 'node_modules'), path.join(directory, 'node_modules'), 'dir');
    const old = new Date(Date.now() - 3 * 86_400_000);
    for (const route of routes) {
      const file = path.join(directory, '.next/server/app', `${route.cache}.html`);
      await utimes(file, old, old);
    }
    const port = await freePort();
    const base = `http://localhost:${port}`;
    child = spawn(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'start', '--hostname', 'localhost', '-p', String(port)], {
      cwd: directory,
      // Whitelist instead of inheriting any developer/production credentials.
      env: { PATH: process.env.PATH, HOME: os.homedir(), NODE_ENV: 'production', GAME_CATALOG_MODE: 'local', CACHE_MODE: 'local', NEXT_TELEMETRY_DISABLED: '1' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    child.stdout?.on('data', chunk => { serverLog += String(chunk); });
    child.stderr?.on('data', chunk => { serverLog += String(chunk); });
    let available = false;
    for (let attempt = 0; attempt < 60; attempt += 1) {
      try { available = (await fetch(`${base}/api/health`, { signal: AbortSignal.timeout(1000) })).ok; } catch { /* booting */ }
      if (available) break;
      if (child.exitCode !== null) throw new Error('Isolated Next server exited before readiness');
      await delay(250);
    }
    if (!available) throw new Error('Isolated server readiness timeout');
    for (const route of routes) {
      const verify = (html: string) => route.locale === 'en' ? normalizeEnglishStaticHtml(html, `${route.cache}.html`) : verifyChineseStaticHtml(html, `${route.cache}.html`);
      const first = await fetch(`${base}${route.url}`, { signal: AbortSignal.timeout(20_000), redirect: 'manual' });
      if (!first.ok || first.headers.get('x-nextjs-cache') !== 'STALE') throw new Error(`Expected stale cached HTML: ${route.url} / ${first.status} / ${first.headers.get('x-nextjs-cache')} / location=${first.headers.get('location')}`);
      verify(await first.text());
      const file = path.join(directory, '.next/server/app', `${route.cache}.html`);
      let regenerated = false;
      for (let attempt = 0; attempt < 80; attempt += 1) {
        await delay(250);
        if ((await stat(file)).mtimeMs > old.getTime() + 1000) { regenerated = true; break; }
      }
      if (!regenerated) throw new Error(`ISR did not rewrite the expired isolated cache: ${route.url}`);
      verify(await readFile(file, 'utf8'));
      const fresh = await fetch(`${base}${route.url}`, { signal: AbortSignal.timeout(20_000), redirect: 'manual' });
      if (!fresh.ok || fresh.headers.get('x-nextjs-cache') !== 'HIT') throw new Error(`Expected regenerated cache hit: ${route.url}`);
      verify(await fresh.text());
      console.log(`PASS ${route.url}: STALE -> regenerated HTML -> HIT; document locale=${route.locale}`);
    }
  } catch (error) {
    console.error(serverLog.slice(-4000));
    throw error;
  } finally {
    if (child && child.exitCode === null) {
      child.kill('SIGTERM');
      await new Promise<void>(resolve => { child!.once('close', () => resolve()); setTimeout(resolve, 3000).unref(); });
      if (child.exitCode === null) child.kill('SIGKILL');
    }
    await rm(directory, { recursive: true, force: true });
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
