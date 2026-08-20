import { expect, test } from './fixtures';

test.describe('Luma Checkers experiment', () => {
  test('exposes one controlled discovery entry in the games directory', async ({
    page,
  }) => {
    await page.goto('/en/games', { waitUntil: 'networkidle' });

    await expect(page.locator('[data-checkers-discovery]')).toHaveCount(1);
    await expect(
      page.locator('[data-checkers-discovery-link]')
    ).toHaveAttribute('href', '/en/games/checkers-rules');
  });

  test('renders a noindex page and applies the first legal move', async ({
    page,
  }) => {
    const response = await page.goto('/en/games/checkers-rules', {
      waitUntil: 'networkidle',
    });

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveTitle(/Checkers Rules and Play Online/i);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      /noindex/i
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /\/en\/games\/checkers-rules$/
    );
    await expect(page.locator('h1')).toContainText('Checkers Rules Trainer');

    const sitemapText = await page.evaluate(async () =>
      (await fetch('/sitemap.xml')).text()
    );
    expect(sitemapText).not.toContain('/games/checkers-rules');

    await page.locator('[data-checkers-play="true"]').click();
    await expect(page.locator('[data-checkers-stage]')).toHaveAttribute(
      'data-checkers-phase',
      'playing'
    );
    await expect(page.locator('[data-checkers-square="5-0"]')).toHaveAttribute(
      'aria-label',
      /red piece/i
    );

    await page.locator('[data-checkers-square="5-0"]').click();
    await expect(page.locator('[data-checkers-square="5-0"]')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await page.locator('[data-checkers-square="4-1"]').click();
    await expect(page.locator('[data-checkers-stage]')).toHaveAttribute(
      'data-checkers-phase',
      'playing'
    );
    await expect(page.locator('[data-checkers-square="5-0"]')).toHaveAttribute(
      'aria-label',
      /empty playable square/i
    );
  });

  test('fits a mobile viewport without horizontal overflow', async ({
    page,
  }, testInfo) => {
    testInfo.skip(
      !['pixel-7', 'iphone-13'].includes(testInfo.project.name),
      'Mobile projects cover responsive viewports.'
    );
    await page.goto('/en/games/checkers-rules', { waitUntil: 'networkidle' });

    const layout = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      boardWidth:
        document.querySelector('[data-checkers-stage]')?.getBoundingClientRect()
          .width ?? 0,
    }));

    expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
    expect(layout.boardWidth).toBeGreaterThan(0);
    expect(layout.boardWidth).toBeLessThanOrEqual(layout.viewportWidth);
  });
});
