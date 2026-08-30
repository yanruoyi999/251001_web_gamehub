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
  {
    slug: 'draw-a-perfect-circle',
    title: /Draw a Perfect Circle/i,
    surface: '[data-draw-perfect-circle]',
  },
  {
    slug: 'chinese-checkers',
    title: /Chinese Checkers Online/i,
    surface: '[data-chinese-checkers]',
  },
  {
    slug: 'stacker-game',
    title: /Stacker Game/i,
    surface: '[data-stacker-game]',
    query: '?smoke=42',
  },
  {
    slug: 'two-player-games',
    title: /Games to Play With 2 People/i,
    surface: '[data-two-player-games]',
  },
] as const;

test.describe('Luma five-page batch', () => {
  for (const pageDefinition of pages) {
    test(`${pageDefinition.slug} renders its noindex contract and first interaction`, async ({ page }) => {
      if ('query' in pageDefinition || [
        'draw-a-perfect-circle',
        'chinese-checkers',
        'stacker-game',
        'two-player-games',
      ].includes(pageDefinition.slug)) {
        await page.setViewportSize({ width: 360, height: 800 });
      }

      const response = await page.goto(
        `/en/games/${pageDefinition.slug}${'query' in pageDefinition ? pageDefinition.query : ''}`,
        {
        waitUntil: 'domcontentloaded',
        },
      );

      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(pageDefinition.title);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.locator(pageDefinition.surface)).toBeVisible();
      await expect(page.locator(pageDefinition.surface)).toHaveAttribute(
        'data-interactive-ready',
        'true',
      );
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

      if (pageDefinition.slug === 'draw-a-perfect-circle') {
        const canvas = page.locator('canvas[aria-label="Drawing canvas"]');
        await canvas.scrollIntoViewIfNeeded();
        const box = await canvas.boundingBox();
        expect(box).not.toBeNull();
        const centerX = box!.x + box!.width / 2;
        const centerY = box!.y + box!.height / 2;
        const radius = Math.min(box!.width, box!.height) * 0.29;
        await page.mouse.move(centerX + radius, centerY);
        await page.mouse.down();
        for (let index = 1; index <= 32; index += 1) {
          const angle = (Math.PI * 2 * index) / 32;
          await page.mouse.move(
            centerX + Math.cos(angle) * radius,
            centerY + Math.sin(angle) * radius,
          );
        }
        await page.mouse.up();
        await page.getByRole('button', { name: 'Score stroke' }).click();
        await expect(page.locator('[data-draw-perfect-circle]')).toContainText('/100');
      }

      if (pageDefinition.slug === 'chinese-checkers') {
        await page.getByRole('button', { name: 'Hint' }).click();
        const destination = page.getByRole('gridcell', { name: /legal destination/ }).first();
        await expect(destination).toBeVisible();
        await destination.click();
        await expect(page.locator('[data-chinese-checkers]')).toContainText('Move history');
        await expect(page.locator('[data-chinese-checkers]')).toContainText('→');
      }

      if (pageDefinition.slug === 'stacker-game') {
        await expect(page.locator('[data-stacker-game]')).toHaveAttribute('data-smoke-mode', 'true');
        await page.getByRole('button', { name: 'Start run' }).click();
        await page.locator('canvas[aria-label="Stacker tower"]').click();
        await expect(page.locator('[data-stacker-game]')).toContainText(/Height\s*1/);
      }

      if (pageDefinition.slug === 'two-player-games') {
        await page.getByRole('button', { name: /Grid Claim/ }).click();
        await expect(page.locator('[data-mode-instructions]')).toContainText('Take turns');
        await page.getByRole('gridcell', { name: 'Cell 1' }).click();
        await expect(page.getByRole('gridcell', { name: /Cell 1 claimed by one/ })).toContainText('P1');

        await page.getByRole('button', { name: /Sync Switch/ }).click();
        await page.keyboard.down('KeyA');
        await page.keyboard.down('KeyL');
        await page.keyboard.up('KeyL');
        await page.keyboard.up('KeyA');
        await expect(page.locator('[data-two-player-games]')).toContainText('1/5');

        const zones = await page.locator('[data-player-zone]').evaluateAll((elements) =>
          elements.map((element) => {
            const box = element.getBoundingClientRect();
            return { left: box.left, right: box.right, top: box.top, bottom: box.bottom };
          }),
        );
        expect(zones).toHaveLength(2);
        expect(zones[0].right).toBeLessThanOrEqual(zones[1].left);
        expect(zones.every((zone) => zone.bottom - zone.top >= 44)).toBe(true);
      }
    });
  }
});
