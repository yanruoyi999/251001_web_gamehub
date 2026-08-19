import { expect, test } from '../e2e/fixtures';

test.describe('Luma Snake 3D mobile touch coverage', () => {
  test('fits a mobile viewport and exposes touch controls', async ({ page }) => {
    await page.goto('/en/games/snake-3d', { waitUntil: 'networkidle' });

    await expect(page.getByRole('button', { name: 'Move up' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Move left' })).toBeVisible();

    const layout = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      canvasWidth:
        document
          .querySelector<HTMLCanvasElement>('[data-snake-canvas]')
          ?.getBoundingClientRect().width ?? 0,
    }));

    expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
    expect(layout.canvasWidth).toBeGreaterThan(0);
    expect(layout.canvasWidth).toBeLessThanOrEqual(layout.viewportWidth);
  });
});
