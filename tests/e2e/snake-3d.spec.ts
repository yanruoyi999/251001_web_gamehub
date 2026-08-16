import { expect, test } from './fixtures';

test.describe('Luma Snake 3D', () => {
  test('keeps the 3D bundle lazy and starts a rendered desktop game', async ({ page }) => {
    const scriptRequests: string[] = [];
    page.on('request', (request) => {
      if (request.resourceType() === 'script') scriptRequests.push(request.url());
    });

    const response = await page.goto('/en/games/snake-3d', {
      waitUntil: 'networkidle',
    });

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveTitle(/Snake Game 3D/i);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      /noindex/i
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /\/en\/games\/snake-3d$/
    );

    const initialScriptRequests = new Set(scriptRequests);
    const playButton = page.locator('[data-snake-play="true"]');
    await expect(playButton).toBeVisible();
    await playButton.click();

    await expect(page.locator('[data-snake-canvas]')).toBeVisible();
    await expect
      .poll(() => scriptRequests.some((url) => !initialScriptRequests.has(url)))
      .toBe(true);

    const stage = page.locator('[data-snake-stage]');
    await expect(stage).toHaveAttribute(
      'data-snake-phase',
      /^(playing|dead|error)$/,
      { timeout: 30_000 }
    );

    const phase = await stage.getAttribute('data-snake-phase');
    if (phase === 'error') {
      await expect(page.getByText(/could not start in this browser/i)).toBeVisible();
      return;
    }

    const canvasState = await page.evaluate(() => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-snake-canvas]');
      if (!canvas) return { hasContext: false, width: 0, height: 0, pixel: [] };

      const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
      if (!gl) {
        return { hasContext: false, width: canvas.width, height: canvas.height, pixel: [] };
      }

      gl.finish();
      const pixel = new Uint8Array(4);
      gl.readPixels(
        Math.floor(gl.drawingBufferWidth / 2),
        Math.floor(gl.drawingBufferHeight / 2),
        1,
        1,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixel
      );
      return {
        hasContext: true,
        width: canvas.width,
        height: canvas.height,
        pixel: Array.from(pixel),
      };
    });

    expect(canvasState.hasContext).toBe(true);
    expect(canvasState.width).toBeGreaterThan(0);
    expect(canvasState.height).toBeGreaterThan(0);
    expect(canvasState.pixel.some((value) => value > 0)).toBe(true);
  });

  test('fits a mobile viewport and exposes touch controls', async ({ page }, testInfo) => {
    testInfo.skip(
      !['pixel-7', 'iphone-13'].includes(testInfo.project.name),
      'Touch controls are covered by the mobile Playwright projects.'
    );

    await page.goto('/en/games/snake-3d', { waitUntil: 'networkidle' });

    await expect(page.getByRole('button', { name: 'Move up' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Move left' })).toBeVisible();

    const layout = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      canvasWidth: document.querySelector<HTMLCanvasElement>('[data-snake-canvas]')?.getBoundingClientRect().width ?? 0,
    }));

    expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
    expect(layout.canvasWidth).toBeGreaterThan(0);
    expect(layout.canvasWidth).toBeLessThanOrEqual(layout.viewportWidth);
  });
});
