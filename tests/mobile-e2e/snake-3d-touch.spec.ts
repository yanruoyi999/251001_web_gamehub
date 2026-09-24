import { expect, test } from '../e2e/fixtures';

test.describe('Luma Snake 3D mobile touch coverage', () => {
  test('plays with touch arrows and swipe, then pauses explicitly when hidden', async ({ page }) => {
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

    await page.locator('[data-snake-play="true"]').click();
    const stage = page.locator('[data-snake-stage]');
    await expect(stage).toHaveAttribute('data-snake-phase', /^(playing|error)$/, {
      timeout: 30_000,
    });
    if ((await stage.getAttribute('data-snake-phase')) === 'error') return;

    await page.getByRole('button', { name: 'Move up' }).click();
    await page.waitForTimeout(220);
    await expect(stage).toHaveAttribute('data-snake-phase', 'playing');

    const canvas = page.locator('[data-snake-canvas]');
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    const pointerId = 42;
    await canvas.dispatchEvent('pointerdown', {
      pointerId,
      pointerType: 'touch',
      clientX: box.x + box.width * 0.75,
      clientY: box.y + box.height * 0.5,
      bubbles: true,
    });
    await canvas.dispatchEvent('pointerup', {
      pointerId,
      pointerType: 'touch',
      clientX: box.x + box.width * 0.25,
      clientY: box.y + box.height * 0.5,
      bubbles: true,
    });
    await page.waitForTimeout(220);
    await expect(stage).toHaveAttribute('data-snake-phase', 'playing');

    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        get: () => true,
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect(stage).toHaveAttribute('data-snake-phase', 'paused');

    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        get: () => false,
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect(stage).toHaveAttribute('data-snake-phase', 'paused');

    await page.getByRole('button', { name: 'Resume' }).click();
    await expect(stage).toHaveAttribute('data-snake-phase', 'playing');
  });
});
