/* eslint-disable no-console */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium, devices, type Browser, type Page } from '@playwright/test';

type SampleType = 'static' | 'guide' | 'game';

interface RuntimeSample {
  path: string;
  type: SampleType;
  requiresPlayableIframe?: boolean;
}

interface RuntimeResult extends RuntimeSample {
  url: string;
  status: number | null;
  score: number;
  responseStartMs: number;
  loadMs: number;
  domContentLoadedMs: number;
  firstContentfulPaintMs: number | null;
  totalTransferKb: number;
  requestCount: number;
  consoleErrors: number;
  hasCanonical: boolean;
  robotsMeta: string;
  hasHorizontalOverflow: boolean;
  playButtonVisible: boolean;
  iframeVisibleAfterPlay: boolean | null;
  fullscreenButtonVisible: boolean | null;
  reason: string;
}

const DEFAULT_BASE_URL = 'http://localhost:3000';
const DEFAULT_WRITE_TARGET = 'docs/page-runtime-sampling.md';
const DEFAULT_FAIL_UNDER = 80;

const DEFAULT_SAMPLES: RuntimeSample[] = [
  { path: '/en', type: 'static' },
  { path: '/en/games', type: 'static' },
  { path: '/en/guides/games-like-ovo', type: 'guide' },
  { path: '/en/guides/google-snake-mods', type: 'guide' },
  { path: '/en/guides/big-tower-tiny-square-2-walkthrough', type: 'guide' },
  { path: '/en/guides/obby-parkour-with-ragdoll-guide', type: 'guide' },
  { path: '/en/guides/rail-cart-buddies-guide', type: 'guide' },
  { path: '/en/guides/telemount-walkthrough', type: 'guide' },
  { path: '/en/games/drive-mad', type: 'game', requiresPlayableIframe: true },
  { path: '/en/games/duo-vikings', type: 'game', requiresPlayableIframe: true },
];

function argValue(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function normalizeBaseUrl(value: string) {
  return value.replace(/\/$/, '');
}

function buildUrl(baseUrl: string, samplePath: string) {
  return `${normalizeBaseUrl(baseUrl)}${samplePath.startsWith('/') ? samplePath : `/${samplePath}`}`;
}

function formatMs(value: number | null) {
  if (value === null) return 'n/a';
  return `${Math.round(value)}ms`;
}

function markdownEscape(value: string) {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function scoreRuntime(result: Omit<RuntimeResult, 'score' | 'reason'>) {
  let score = 100;
  const reasons: string[] = [];

  if (result.status !== 200) {
    score -= 35;
    reasons.push(`HTTP ${result.status ?? 'missing'}`);
  }
  if (!result.hasCanonical) {
    score -= 12;
    reasons.push('missing canonical');
  }
  if (result.domContentLoadedMs > 2500) {
    score -= 8;
    reasons.push(`slow DOMContentLoaded ${Math.round(result.domContentLoadedMs)}ms`);
  }
  if (result.loadMs > 5000) {
    score -= 10;
    reasons.push(`slow load ${Math.round(result.loadMs)}ms`);
  }
  if (result.firstContentfulPaintMs !== null && result.firstContentfulPaintMs > 2200) {
    score -= 8;
    reasons.push(`slow FCP ${Math.round(result.firstContentfulPaintMs)}ms`);
  }
  if (result.totalTransferKb > 2500) {
    score -= 8;
    reasons.push(`heavy transfer ${Math.round(result.totalTransferKb)}KB`);
  }
  if (result.requestCount > 95) {
    score -= 6;
    reasons.push(`many requests ${result.requestCount}`);
  }
  if (result.consoleErrors > 0) {
    score -= Math.min(12, result.consoleErrors * 4);
    reasons.push(`${result.consoleErrors} console errors`);
  }
  if (result.hasHorizontalOverflow) {
    score -= 12;
    reasons.push('mobile horizontal overflow');
  }
  if (result.requiresPlayableIframe && !result.playButtonVisible) {
    score -= 15;
    reasons.push('play button not visible on mobile');
  }
  if (result.requiresPlayableIframe && result.iframeVisibleAfterPlay === false) {
    score -= 18;
    reasons.push('iframe not visible after Play now');
  }
  if (result.requiresPlayableIframe && result.fullscreenButtonVisible === false) {
    score -= 8;
    reasons.push('fullscreen control not visible after play');
  }

  return {
    score: Math.max(0, score),
    reason: reasons.join('; ') || 'Mobile runtime sample passed the current performance and playability thresholds.',
  };
}

async function collectPerformance(page: Page) {
  return page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const fcp = performance
      .getEntriesByType('paint')
      .find((entry) => entry.name === 'first-contentful-paint');
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const responseStartMs = navigation?.responseStart ?? 0;
    const loadEventEnd = navigation?.loadEventEnd ?? 0;
    const domContentLoadedEventEnd = navigation?.domContentLoadedEventEnd ?? 0;
    const fcpStart = fcp?.startTime ?? null;

    return {
      responseStartMs,
      loadMs: navigation && loadEventEnd > 0 ? Math.max(0, loadEventEnd - responseStartMs) : 0,
      domContentLoadedMs: navigation && domContentLoadedEventEnd > 0
        ? Math.max(0, domContentLoadedEventEnd - responseStartMs)
        : 0,
      firstContentfulPaintMs: fcpStart === null ? null : Math.max(0, fcpStart - responseStartMs),
      totalTransferKb: resources.reduce((sum, entry) => sum + (entry.transferSize || 0), 0) / 1024,
      requestCount: resources.length,
    };
  });
}

async function samplePage(browser: Browser, baseUrl: string, sample: RuntimeSample): Promise<RuntimeResult> {
  const context = await browser.newContext({
    ...devices['iPhone 12'],
    locale: 'en-US',
  });
  const baseOrigin = new URL(baseUrl).origin;
  await context.route('**/*', async (route) => {
    const request = route.request();
    const resourceType = request.resourceType();
    const requestOrigin = new URL(request.url()).origin;

    if (
      sample.requiresPlayableIframe &&
      requestOrigin !== baseOrigin &&
      ['document', 'iframe'].includes(resourceType)
    ) {
      await route.abort();
      return;
    }

    await route.continue();
  });
  const page = await context.newPage();
  page.setDefaultTimeout(3_000);
  let consoleErrors = 0;
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors += 1;
  });
  page.on('pageerror', () => {
    consoleErrors += 1;
  });

  const url = buildUrl(baseUrl, sample.path);
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15_000 });
  await page.waitForTimeout(sample.requiresPlayableIframe ? 2_000 : 600);
  const playButton = page.locator('button').filter({ hasText: /play now|开始游戏/i }).first();

  const [
    performanceData,
    hasCanonical,
    robotsMeta,
    hasHorizontalOverflow,
    playButtonVisible,
  ] = await Promise.all([
    collectPerformance(page),
    page.evaluate(() => Boolean(document.querySelector('link[rel="canonical"]'))),
    page.evaluate(() => document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? ''),
    page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1),
    playButton.isVisible().catch(() => false),
  ]);

  let iframeVisibleAfterPlay: boolean | null = null;
  let fullscreenButtonVisible: boolean | null = null;

  if (sample.requiresPlayableIframe) {
    if (playButtonVisible) {
      await playButton.click();
      await page.locator('iframe').first().waitFor({ state: 'visible', timeout: 4_000 }).catch(() => undefined);
      await page.waitForTimeout(400);
    }

    iframeVisibleAfterPlay = await page.locator('iframe').first().isVisible().catch(() => false);
    fullscreenButtonVisible = await page
      .getByRole('button', { name: /play fullscreen|全屏游玩|exit fullscreen|退出全屏/i })
      .first()
      .isVisible()
      .catch(() => false);
  }

  const resultWithoutScore = {
    ...sample,
    url,
    status: response?.status() ?? null,
    responseStartMs: performanceData.responseStartMs,
    loadMs: performanceData.loadMs,
    domContentLoadedMs: performanceData.domContentLoadedMs,
    firstContentfulPaintMs: performanceData.firstContentfulPaintMs,
    totalTransferKb: performanceData.totalTransferKb,
    requestCount: performanceData.requestCount,
    consoleErrors,
    hasCanonical,
    robotsMeta,
    hasHorizontalOverflow,
    playButtonVisible,
    iframeVisibleAfterPlay,
    fullscreenButtonVisible,
  };
  const { score, reason } = scoreRuntime(resultWithoutScore);

  return {
    ...resultWithoutScore,
    score,
    reason,
  };
}

function buildReport(results: RuntimeResult[], baseUrl: string, generatedAt = new Date().toISOString()) {
  const underThreshold = results.filter((result) => result.score < DEFAULT_FAIL_UNDER);
  const lines = [
    '# Luma Runtime Quality Sampling',
    '',
    `Generated: ${generatedAt}`,
    `Base URL: ${baseUrl}`,
    '',
    'Scope: mobile Playwright sampling for high-value indexable pages. This is a companion gate for `docs/page-quality-scorecard.md`, adding runtime performance, mobile layout, and actual playable-iframe checks that static scoring cannot prove. TTFB/transport is reported separately; page timing scores use response-relative DCL/FCP/load so one noisy network route does not downgrade every page equally.',
    '',
    '## Thresholds',
    '',
    '- Sampled pages must score 80 or higher before being treated as hardened index targets.',
    '- Game pages must expose the Play button on mobile, load an iframe after the click, and keep the Luma fullscreen control visible.',
    '- Pages are penalized for missing canonical tags, mobile horizontal overflow, slow load/FCP, excessive transfer size, many requests, and console/page errors.',
    '',
    '## Summary',
    '',
    `- Sampled pages: ${results.length}`,
    `- Under 80: ${underThreshold.length}`,
    `- Minimum score: ${Math.min(...results.map((result) => result.score))}`,
    '',
    '## Samples',
    '',
    '| Path | Type | Score | Status | TTFB | DCL after response | Load after response | FCP after response | Transfer | Requests | Canonical | Robots | Mobile overflow | Playable | Fullscreen | Reason |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- | --- |',
    ...results.map((result) => `| ${[
      markdownEscape(result.path),
      result.type,
      result.score,
      result.status ?? 'n/a',
      formatMs(result.responseStartMs),
      formatMs(result.domContentLoadedMs),
      formatMs(result.loadMs),
      formatMs(result.firstContentfulPaintMs),
      `${Math.round(result.totalTransferKb)}KB`,
      result.requestCount,
      result.hasCanonical ? 'yes' : 'no',
      result.robotsMeta || 'index',
      result.hasHorizontalOverflow ? 'yes' : 'no',
      result.iframeVisibleAfterPlay === null ? 'n/a' : result.iframeVisibleAfterPlay ? 'yes' : 'no',
      result.fullscreenButtonVisible === null ? 'n/a' : result.fullscreenButtonVisible ? 'yes' : 'no',
      markdownEscape(result.reason),
    ].join(' | ')} |`),
    '',
  ];

  return `${lines.join('\n')}\n`;
}

async function runCli() {
  const baseUrl = normalizeBaseUrl(argValue('--base-url') ?? DEFAULT_BASE_URL);
  const writeTarget = argValue('--write') ?? DEFAULT_WRITE_TARGET;
  const failUnder = Number(argValue('--fail-under') ?? DEFAULT_FAIL_UNDER);
  const browser = await chromium.launch({ headless: true });

  try {
    const results: RuntimeResult[] = [];
    for (const sample of DEFAULT_SAMPLES) {
      console.log(`Sampling ${sample.path}`);
      results.push(await samplePage(browser, baseUrl, sample));
    }

    const report = buildReport(results, baseUrl);
    const targetPath = path.resolve(process.cwd(), writeTarget);
    writeFileSync(targetPath, report, 'utf8');
    console.log(`Wrote ${targetPath}`);

    const failures = results.filter((result) => result.score < failUnder);
    if (failures.length > 0) {
      console.error(`Runtime quality failed for ${failures.length} sample(s): ${failures.map((failure) => `${failure.path}=${failure.score}`).join(', ')}`);
      process.exitCode = 1;
    }
  } finally {
    await Promise.race([
      browser.close(),
      new Promise<void>((resolve) => setTimeout(resolve, 3_000)),
    ]).catch(() => undefined);
    const browserProcess = (browser as Browser & {
      process?: () => { kill: (signal?: NodeJS.Signals) => boolean } | null;
    }).process?.();
    browserProcess?.kill('SIGTERM');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCli().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
