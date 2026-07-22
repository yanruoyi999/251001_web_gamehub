import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const TELEMOUNT_PLAYER_URL =
  'https://html-classic.itch.zone/html/18353394/index.html?v=1784182371';

async function main() {
  const outputDirectory = path.join(process.cwd(), 'public', 'guide-screenshots');
  await fs.mkdir(outputDirectory, { recursive: true });

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({
      viewport: { width: 960, height: 960 },
      ignoreHTTPSErrors: true,
    });
    await page.goto(TELEMOUNT_PLAYER_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    await page.waitForTimeout(3_000);

    await page.screenshot({
      path: path.join(outputDirectory, 'telemount-title-and-controls.png'),
      type: 'png',
    });

    await page.locator('#MMFCanvas').click({ position: { x: 320, y: 320 } });
    await page.keyboard.down('Control');
    await page.keyboard.down('q');
    await page.waitForTimeout(150);
    await page.keyboard.up('q');
    await page.keyboard.up('Control');
    await page.waitForTimeout(2_000);
    await page.screenshot({
      path: path.join(outputDirectory, 'telemount-level-1.png'),
      type: 'png',
    });

    await page.keyboard.down('Control');
    await page.keyboard.down('q');
    await page.waitForTimeout(150);
    await page.keyboard.up('q');
    await page.keyboard.up('Control');
    await page.waitForTimeout(2_000);
    await page.screenshot({
      path: path.join(outputDirectory, 'telemount-level-2.png'),
      type: 'png',
    });
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
