import { expect, test } from './fixtures';

const guides = [
  { slug: 'google-snake-mods', action: 'mod_web', destination: 'https://googlesnakemods.com/', counterpart: 'google-snake-level-editor' },
  { slug: 'google-snake-level-editor', action: 'source_status', destination: 'https://github.com/DarkSnakeGang/GoogleSnakeLevelEditor', counterpart: 'google-snake-mods' },
];

test('Snake guides expose the real task and existing counterpart before unrelated content', async ({ page }, info) => {
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    for (const guide of guides) {
      await page.goto(`/en/guides/${guide.slug}`);
      const primary = page.locator(`[data-guide-intent-action="${guide.action}"]`);
      await expect(primary).toBeVisible();
      await expect(primary).toHaveAttribute('href', guide.destination);
      await expect(primary).toHaveAttribute('target', '_blank');
      const box = await primary.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.y + box!.height).toBeLessThanOrEqual(844);
      await expect(page.locator('[data-snake-next-step] a')).toHaveAttribute('href', `/en/guides/${guide.counterpart}`);
      await expect(page.locator('#related-spend-bill-gates-money')).toHaveCount(0);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.lumagamehub.com/en/guides/${guide.slug}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      if (guide.slug.endsWith('editor')) await expect(page.locator('iframe')).toHaveCount(0);
      await page.screenshot({ path: info.outputPath(`${guide.slug}-${width}.png`) });
    }
  }
});

test('one guide activation emits one local intent event and keeps the native destination', async ({ page }) => {
  await page.goto('/en/guides/google-snake-mods');
  await page.evaluate(() => {
    const target = window as typeof window & { repairEvents?: string[]; clarity?: (...args: unknown[]) => void };
    target.repairEvents = [];
    target.clarity = (command, name) => { if (command === 'event') target.repairEvents!.push(String(name)); };
  });
  await page.context().route('https://googlesnakemods.com/**', route => route.fulfill({ status: 200, contentType: 'text/html', body: '<p>External destination isolated for acceptance test.</p>' }));
  const opened = page.waitForEvent('popup');
  await page.locator('[data-guide-intent-action="mod_web"]').click();
  const popup = await opened;
  await popup.waitForLoadState('domcontentloaded');
  expect(popup.url()).toBe('https://googlesnakemods.com/');
  await popup.close();
  expect(await page.evaluate(() => (window as typeof window & { repairEvents: string[] }).repairEvents.filter(name => name === 'guide_intent_click'))).toHaveLength(1);
});

test.describe('native navigation without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('keeps the real mod and counterpart links available', async ({ page }) => {
    await page.goto('/en/guides/google-snake-mods');
    await expect(page.locator('[data-guide-intent-action="mod_web"]')).toHaveAttribute('href', 'https://googlesnakemods.com/');
    await page.locator('[data-snake-next-step] a').click();
    await expect(page).toHaveURL(/\/en\/guides\/google-snake-level-editor$/);
    await expect(page.getByRole('main')).toContainText('does not contain a working editor');
  });
});
