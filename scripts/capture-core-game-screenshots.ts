/* eslint-disable no-console */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium, type Browser } from '@playwright/test';

import { buildAuditRows } from '@/scripts/audit-game-quality';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'game-screenshots');
const VIEWPORT = { width: 960, height: 720 };
const CAPTURE_CONCURRENCY = 3;

interface CaptureTarget {
  slug: string;
  title: string;
  iframeUrl: string;
}

interface CaptureOptions {
  waitMs: number;
  clickCount: number;
  clickX: number;
  clickY: number;
}

async function captureTarget(browser: Browser, target: CaptureTarget, options: CaptureOptions) {
  const page = await browser.newPage({
    viewport: VIEWPORT,
    colorScheme: 'dark',
    reducedMotion: 'reduce',
  });

  try {
    page.on('dialog', (dialog) => void dialog.dismiss());
    await page.goto(target.iframeUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    await page.waitForTimeout(Math.max(1_000, options.waitMs - 2_000));
    for (let clickIndex = 0; clickIndex < options.clickCount; clickIndex += 1) {
      await page.mouse.click(options.clickX, options.clickY);
      await page.waitForTimeout(2_000);
    }
    await page.screenshot({
      path: path.join(OUTPUT_DIR, `${target.slug}.png`),
      type: 'png',
      fullPage: false,
      animations: 'disabled',
    });
    console.log(`captured ${target.slug} from ${new URL(target.iframeUrl).hostname}`);
  } finally {
    await page.close();
  }
}

async function run() {
  const requestedSlugs = new Set(process.argv.slice(2).filter((value) => !value.startsWith('--')));
  const force = process.argv.includes('--force');
  const waitArgument = process.argv.find((value) => value.startsWith('--wait='));
  const parsedWaitMs = Number(waitArgument?.split('=')[1]);
  const waitMs = Number.isFinite(parsedWaitMs) && parsedWaitMs >= 3_000
    ? parsedWaitMs
    : 6_000;
  const clicksArgument = process.argv.find((value) => value.startsWith('--clicks='));
  const parsedClickCount = Number(clicksArgument?.split('=')[1]);
  const clickCount = Number.isInteger(parsedClickCount) && parsedClickCount > 0
    ? parsedClickCount
    : 1;
  const clickArgument = process.argv.find((value) => value.startsWith('--click='));
  const [parsedClickX, parsedClickY] = (clickArgument?.split('=')[1] ?? '')
    .split(',')
    .map(Number);
  const clickX = Number.isFinite(parsedClickX) ? parsedClickX : VIEWPORT.width / 2;
  const clickY = Number.isFinite(parsedClickY) ? parsedClickY : VIEWPORT.height / 2;
  const targets = buildAuditRows()
    .filter(
      (row) =>
        row.tier === 'core-indexed' &&
        (force || row.reasons.includes('placeholder thumbnail')) &&
        (requestedSlugs.size === 0 || requestedSlugs.has(row.game.slug)),
    )
    .map((row) => ({
      slug: row.game.slug,
      title: row.game.titleEn || row.game.title,
      iframeUrl: row.game.iframeUrl,
    }));

  if (targets.length === 0) {
    console.log('No placeholder screenshots matched the requested core games.');
    return;
  }

  await mkdir(OUTPUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const failures: Array<{ slug: string; error: string }> = [];

  try {
    let cursor = 0;
    const workers = Array.from(
      { length: Math.min(CAPTURE_CONCURRENCY, targets.length) },
      async () => {
        while (cursor < targets.length) {
          const target = targets[cursor];
          cursor += 1;

          try {
            await captureTarget(browser, target, {
              waitMs,
              clickCount,
              clickX,
              clickY,
            });
          } catch (error) {
            failures.push({
              slug: target.slug,
              error: error instanceof Error ? error.message : String(error),
            });
            console.error(`failed ${target.slug}`);
          }
        }
      },
    );
    await Promise.all(workers);
  } finally {
    await browser.close();
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`${failure.slug}: ${failure.error}`);
    }
    process.exitCode = 1;
  }

  console.log(`Captured ${targets.length - failures.length}/${targets.length} core game screenshots.`);
}

void run();
