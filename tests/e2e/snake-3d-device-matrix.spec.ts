import { expect, test } from './fixtures';

test.describe('Luma Snake 3D exhaustive device matrix', () => {
  test('renders, starts, accepts the native input path, pauses safely and preserves layout', async ({
    page,
  }, testInfo) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    const mediaRequests: string[] = [];

    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('request', (request) => {
      if (
        request.resourceType() === 'media' ||
        /\.(mp3|wav|ogg|m4a|aac)(?:$|\?)/i.test(request.url())
      ) {
        mediaRequests.push(request.url());
      }
    });

    const response = await page.goto('/en/games/snake-3d', {
      waitUntil: 'networkidle',
    });
    expect(response?.ok()).toBe(true);

    const initialLayout = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      documentWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight,
      touchPoints: navigator.maxTouchPoints,
    }));

    expect(initialLayout.viewportWidth).toBeGreaterThan(0);
    expect(initialLayout.viewportHeight).toBeGreaterThan(0);
    expect(initialLayout.documentWidth).toBeLessThanOrEqual(
      initialLayout.viewportWidth + 1
    );

    const playButton = page.locator('[data-snake-play="true"]');
    await expect(playButton).toBeVisible();
    await playButton.click();

    const stage = page.locator('[data-snake-stage]');
    await expect(stage).toHaveAttribute('data-snake-phase', 'playing', {
      timeout: 30_000,
    });

    const readyMs = Number(
      await stage.getAttribute('data-snake-play-to-ready-ms')
    );
    expect(Number.isFinite(readyMs)).toBe(true);
    expect(readyMs).toBeGreaterThanOrEqual(0);
    expect(readyMs).toBeLessThan(5_000);

    const canvas = page.locator('[data-snake-canvas]');
    await expect(canvas).toBeVisible();

    const graphics = await page.evaluate(() => {
      const element = document.querySelector<HTMLCanvasElement>(
        '[data-snake-canvas]'
      );
      if (!element) {
        return {
          hasContext: false,
          contextLost: true,
          width: 0,
          height: 0,
          cssWidth: 0,
          cssHeight: 0,
        };
      }

      const context = element.getContext('webgl2') ?? element.getContext('webgl');
      const rect = element.getBoundingClientRect();
      return {
        hasContext: Boolean(context),
        contextLost: context ? context.isContextLost() : true,
        width: element.width,
        height: element.height,
        cssWidth: rect.width,
        cssHeight: rect.height,
      };
    });

    expect(graphics.hasContext).toBe(true);
    expect(graphics.contextLost).toBe(false);
    expect(graphics.width).toBeGreaterThan(0);
    expect(graphics.height).toBeGreaterThan(0);
    expect(graphics.cssWidth).toBeGreaterThan(0);
    expect(graphics.cssWidth).toBeLessThanOrEqual(initialLayout.viewportWidth + 1);

    const rafFps = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let frames = 0;
          let startedAt = 0;
          const sampleMs = 450;

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
    expect(rafFps).toBeGreaterThan(0);

    const hasTouch = initialLayout.touchPoints > 0;
    if (hasTouch) {
      const moveUp = page.getByRole('button', { name: 'Move up' });
      await expect(moveUp).toBeVisible();
      await moveUp.click();
      await page.waitForTimeout(220);
      await expect(stage).toHaveAttribute('data-snake-phase', 'playing');

      const box = await canvas.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        const pointerId = 77;
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
      }
    } else {
      await page.keyboard.press('ArrowUp');
      await page.waitForTimeout(220);
      await expect(stage).toHaveAttribute('data-snake-phase', 'playing');
    }

    await page.getByRole('button', { name: 'Pause' }).click();
    await expect(stage).toHaveAttribute('data-snake-phase', 'paused');
    await page.getByRole('button', { name: 'Resume' }).click();
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

    const audioToggle = page.locator('[data-snake-audio-toggle="true"]');
    await expect(audioToggle).toBeVisible();
    const mutedBefore = await audioToggle.getAttribute('aria-pressed');
    await audioToggle.click();
    await expect(audioToggle).not.toHaveAttribute(
      'aria-pressed',
      mutedBefore ?? 'false'
    );

    const finalLayout = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
    }));
    expect(finalLayout.documentWidth).toBeLessThanOrEqual(
      finalLayout.viewportWidth + 1
    );

    expect(mediaRequests).toEqual([]);
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);

    const deviceName = String(
      testInfo.project.metadata.deviceName ?? testInfo.project.name
    );
    const summary = [
      `project=${testInfo.project.name}`,
      `device=${deviceName}`,
      `viewport=${initialLayout.viewportWidth}x${initialLayout.viewportHeight}`,
      `touch=${hasTouch}`,
      `play_to_ready_ms=${readyMs}`,
      `raf_fps=${rafFps.toFixed(1)}`,
    ].join('; ');

    testInfo.annotations.push({
      type: 'snake-device-matrix',
      description: summary,
    });
    // eslint-disable-next-line no-console
    console.info(`[snake-device-matrix] ${summary}`);
  });
});
