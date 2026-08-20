import { expect, test } from './fixtures';

test.describe('Luma Circle test page', () => {
  test('renders a noindex page and completes a desktop drawing attempt', async ({ page }) => {
    const response = await page.goto('/en/games/draw-a-perfect-circle', { waitUntil: 'networkidle' });

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveTitle(/Draw a Perfect Circle/i);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/i);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/en\/games\/draw-a-perfect-circle$/);
    await expect(page.locator('h1')).toContainText('Draw a Perfect Circle');
    await expect(page.locator('[data-circle-canvas]')).toBeVisible();

    const sitemapText = await page.evaluate(async () => (await fetch('/sitemap.xml')).text());
    expect(sitemapText).not.toContain('/games/draw-a-perfect-circle');

    await page.locator('[data-circle-play="true"]').click();
    const canvas = page.locator('[data-circle-canvas]');
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    const center = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    const radius = Math.min(box.width, box.height) * 0.27;
    const points = Array.from({ length: 80 }, (_, index) => {
      const angle = (index / 79) * Math.PI * 2;
      return {
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius,
      };
    });

    await page.mouse.move(points[0].x, points[0].y);
    await page.mouse.down();
    for (const point of points.slice(1)) await page.mouse.move(point.x, point.y);
    await page.mouse.up();

    await expect(page.locator('[data-circle-stage]')).toHaveAttribute('data-circle-phase', 'result');
    await expect(page.locator('[data-circle-retry="true"]')).toBeVisible();
  });

  test('fits a mobile viewport without horizontal overflow', async ({ page }, testInfo) => {
    testInfo.skip(!['pixel-7', 'iphone-13'].includes(testInfo.project.name), 'Mobile projects cover the responsive viewport.');
    await page.goto('/en/games/draw-a-perfect-circle', { waitUntil: 'networkidle' });

    const layout = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      canvasWidth: document.querySelector<HTMLCanvasElement>('[data-circle-canvas]')?.getBoundingClientRect().width ?? 0,
    }));

    expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
    expect(layout.canvasWidth).toBeGreaterThan(0);
    expect(layout.canvasWidth).toBeLessThanOrEqual(layout.viewportWidth);
  });
});
