/* eslint-disable no-console */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'guide-screenshots');
const VERIFIED_CAPTURE_FLAG = 'ALLOW_VERIFIED_TELEMOUNT_SCREENSHOT_CAPTURE';

async function run() {
  if (process.env[VERIFIED_CAPTURE_FLAG] !== 'true') {
    throw new Error(
      `Screenshot capture is fail-closed. Set ${VERIFIED_CAPTURE_FLAG}=true only after TeleMount screenshot/media rights have been independently verified and recorded.`,
    );
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
    colorScheme: 'dark',
    reducedMotion: 'reduce',
  });

  try {
    await mkdir(OUTPUT_DIR, { recursive: true });
    page.on('dialog', dialog => void dialog.dismiss());
    await page.goto('https://flyingkoala.itch.io/telemount', {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    await page.waitForTimeout(3_000);

    const embedFrame = page.locator('iframe').first();
    const src = await embedFrame.getAttribute('src');
    if (!src) {
      throw new Error('TeleMount iframe source was not found');
    }

    const frameUrl = new URL(src, page.url()).toString();
    await page.goto(frameUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    await page.waitForTimeout(4_000);

    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'telemount-title-and-controls.png'),
      type: 'png',
      fullPage: false,
      animations: 'disabled',
    });

    await page.mouse.click(640, 360);
    await page.waitForTimeout(2_500);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'telemount-level-1.png'),
      type: 'png',
      fullPage: false,
      animations: 'disabled',
    });

    await page.keyboard.press('KeyD');
    await page.waitForTimeout(1_500);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'telemount-level-2.png'),
      type: 'png',
      fullPage: false,
      animations: 'disabled',
    });
  } finally {
    await page.close();
    await browser.close();
  }
}

void run();
