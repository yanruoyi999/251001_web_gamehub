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

  test('buffers only one valid direction change before the next game tick', async ({ page }) => {
    await page.goto('/en/games/snake-3d', { waitUntil: 'networkidle' });
    await page.locator('[data-snake-play="true"]').click();

    const stage = page.locator('[data-snake-stage]');
    await expect(stage).toHaveAttribute('data-snake-phase', /^(playing|error)$/, {
      timeout: 30_000,
    });

    if ((await stage.getAttribute('data-snake-phase')) === 'error') return;

    // Initial direction is right. The old implementation applied both inputs
    // immediately, making the effective direction left before the first tick
    // and colliding with the snake body.
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(260);

    await expect(stage).toHaveAttribute('data-snake-phase', 'playing');
  });
});
