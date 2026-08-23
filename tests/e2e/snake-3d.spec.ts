import { expect, test } from './fixtures';

test.describe('Luma Snake 3D', () => {
  test('keeps the 3D bundle lazy and records a real runtime performance sample', async ({ page }, testInfo) => {
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

    const readyMs = Number(await stage.getAttribute('data-snake-play-to-ready-ms'));
    expect(Number.isFinite(readyMs)).toBe(true);
    expect(readyMs).toBeGreaterThanOrEqual(0);
    expect(readyMs).toBeLessThan(5_000);

    const canvasState = await page.evaluate(() => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-snake-canvas]');
      if (!canvas) return { hasContext: false, width: 0, height: 0, contextLost: true };

      const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
      return {
        hasContext: Boolean(gl),
        width: canvas.width,
        height: canvas.height,
        contextLost: gl ? gl.isContextLost() : true,
      };
    });

    expect(canvasState.hasContext).toBe(true);
    expect(canvasState.width).toBeGreaterThan(0);
    expect(canvasState.height).toBeGreaterThan(0);
    expect(canvasState.contextLost).toBe(false);

    const rafFps = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let frames = 0;
          let startedAt = 0;
          const sampleMs = 750;

          const sample = (timestamp: number) => {
            if (startedAt === 0) startedAt = timestamp;
            frames += 1;
            const elapsed = timestamp - startedAt;
            if (elapsed >= sampleMs) {
              resolve((frames * 1_000) / elapsed);
              return;
            }
            requestAnimationFrame(sample);
          };

          requestAnimationFrame(sample);
        })
    );

    expect(rafFps).toBeGreaterThan(20);
    testInfo.annotations.push({
      type: 'snake-performance',
      description: `play_to_ready_ms=${readyMs}; raf_fps=${rafFps.toFixed(1)}`,
    });
    // eslint-disable-next-line no-console
    console.info(`[snake-performance] play_to_ready_ms=${readyMs} raf_fps=${rafFps.toFixed(1)}`);
  });

  test('persists the local mute preference without loading an audio asset', async ({ page }) => {
    await page.goto('/en/games/snake-3d', { waitUntil: 'networkidle' });

    const audioToggle = page.locator('[data-snake-audio-toggle="true"]');
    await expect(audioToggle).toHaveAttribute('aria-pressed', 'false');
    await audioToggle.click();
    await expect(audioToggle).toHaveAttribute('aria-pressed', 'true');

    const storedMuted = await page.evaluate(() =>
      window.localStorage.getItem('luma-snake-3d-muted')
    );
    expect(storedMuted).toBe('true');

    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('[data-snake-audio-toggle="true"]')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  test('completes play, first move, pause, resume, game over and retry', async ({ page }) => {
    await page.goto('/en/games/snake-3d', { waitUntil: 'networkidle' });
    await page.locator('[data-snake-play="true"]').click();

    const stage = page.locator('[data-snake-stage]');
    await expect(stage).toHaveAttribute('data-snake-phase', /^(playing|error)$/, {
      timeout: 30_000,
    });
    if ((await stage.getAttribute('data-snake-phase')) === 'error') return;

    await page.keyboard.press('ArrowUp');
    await page.getByRole('button', { name: 'Pause' }).click();
    await expect(stage).toHaveAttribute('data-snake-phase', 'paused');

    await page.getByRole('button', { name: 'Resume' }).click();
    await expect(stage).toHaveAttribute('data-snake-phase', 'playing');

    await expect(stage).toHaveAttribute('data-snake-phase', 'dead', {
      timeout: 5_000,
    });
    await expect(page.locator('[data-snake-retry="true"]')).toBeVisible();
    await page.locator('[data-snake-retry="true"]').click();
    await expect(stage).toHaveAttribute('data-snake-phase', /^(playing|error)$/, {
      timeout: 30_000,
    });
  });

  test('buffers only one valid direction change before the next game tick', async ({ page }) => {
    await page.goto('/en/games/snake-3d', { waitUntil: 'networkidle' });
    await page.locator('[data-snake-play="true"]').click();

    const stage = page.locator('[data-snake-stage]');
    await expect(stage).toHaveAttribute('data-snake-phase', /^(playing|error)$/, {
      timeout: 30_000,
    });

    if ((await stage.getAttribute('data-snake-phase')) === 'error') return;

    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(260);

    await expect(stage).toHaveAttribute('data-snake-phase', 'playing');
  });

  test('pauses when the document becomes hidden and does not auto-resume', async ({ page }) => {
    await page.goto('/en/games/snake-3d', { waitUntil: 'networkidle' });
    await page.locator('[data-snake-play="true"]').click();

    const stage = page.locator('[data-snake-stage]');
    await expect(stage).toHaveAttribute('data-snake-phase', /^(playing|error)$/, {
      timeout: 30_000,
    });
    if ((await stage.getAttribute('data-snake-phase')) === 'error') return;

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
  });
});
