import { expect, test } from './fixtures';

const pages = [
  {
    slug: 'daily-solitaire',
    title: /Daily Solitaire/i,
    surface: '[data-daily-solitaire]',
  },
  {
    slug: 'connect-the-dots',
    title: /Connect the Dots/i,
    surface: '[data-connect-the-dots]',
  },
  {
    slug: 'sorting-games',
    title: /Sorting Games/i,
    surface: '[data-sorting-lab]',
  },
  {
    slug: 'mahjong-connect',
    title: /Mahjong Connect/i,
    surface: '[data-mahjong-connect]',
  },
  {
    slug: 'asmr-games',
    title: /ASMR Games/i,
    surface: '[data-asmr-experiences]',
  },
] as const;

test.describe('Luma five-page batch', () => {
  for (const pageDefinition of pages) {
    test(`${pageDefinition.slug} renders its noindex contract and first interaction`, async ({ page }) => {
      const response = await page.goto(`/en/games/${pageDefinition.slug}`, {
        waitUntil: 'domcontentloaded',
      });

      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(pageDefinition.title);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.locator(pageDefinition.surface)).toBeVisible();
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        /noindex.*follow/i,
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        new RegExp(`/en/games/${pageDefinition.slug}$`),
      );

      const layout = await page.evaluate(() => ({
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
      }));
      expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);

      if (pageDefinition.slug === 'daily-solitaire') {
        await page.locator('[data-daily-solitaire] header button').click();
        await expect(page.locator('[data-daily-solitaire] button').filter({ hasText: 'Draw' }).first()).toBeEnabled();
      }

      if (pageDefinition.slug === 'connect-the-dots') {
        await page.getByRole('button', { name: 'Start board' }).click();
        await page.getByRole('button', { name: 'Number 1', exact: true }).click();
        await expect(page.locator('[data-connect-the-dots]')).toContainText('Progress: 1/12');
      }

      if (pageDefinition.slug === 'sorting-games') {
        await page.getByRole('button', { name: 'Start mode' }).click();
        await page.getByRole('button', { name: 'Coral' }).click();
        await expect(page.locator('[data-sorting-lab]')).toContainText('Correct');
      }

      if (pageDefinition.slug === 'mahjong-connect') {
        await page.getByRole('button', { name: 'Start level 1' }).click();
        await page.getByRole('button', { name: 'Hint' }).click();
        await expect(page.locator('[data-mahjong-board] button').first()).toBeVisible();
      }

      if (pageDefinition.slug === 'asmr-games') {
        await page.locator('[data-asmr-surface]').click();
        await expect(page.locator('[data-asmr-experiences]')).toContainText('1 interactions');
      }
    });
  }
});
