import { expect, test } from './fixtures';

test.describe('Luma Game Hub smoke tests', () => {
  test('homepage renders title', async ({ page }) => {
    const response = await page.goto('/');

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveURL('/');
    await expect(page).toHaveTitle(/Luma Game Hub/i);
  });

  test('homepage exposes distinct recommendation shelves without mobile overflow', async ({
    page,
  }) => {
    await page.goto('/en');

    await expect(page.getByText("Today's picks", { exact: true })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Popular games today' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Popular guides' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'More games and guides' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'View saved games' })).toHaveAttribute(
      'href',
      '/en/games/saved',
    );

    await expect(
      page.locator(
        'section[aria-labelledby="popular-guides"] a[href^="/en/guides/"]',
      ),
    ).toHaveCount(5);
    await expect(
      page.locator(
        'section[aria-labelledby="more-games"] a[href^="/en/games/"], section[aria-labelledby="more-games"] a[href^="/en/guides/"]',
      ),
    ).toHaveCount(3);

    const layout = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      shelfOverflow: Array.from(
        document.querySelectorAll<HTMLElement>('.game-shelf-scroll'),
      ).map(node => ({
        scrollWidth: node.scrollWidth,
        clientWidth: node.clientWidth,
      })),
    }));
    expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
    expect(layout.shelfOverflow.length).toBeGreaterThanOrEqual(3);
  });

  test('retained game and guide templates keep the controls and navigation visible', async ({
    page,
  }) => {
    await page.goto('/en/games/tunnel-rush');
    await expect(page.locator('[data-legacy-game-guide]')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Controls' })).toBeVisible();
    await expect(page.locator('main iframe')).toHaveCount(0);

    await page.goto('/en/guides/google-snake-mods');
    await expect(page.locator('#guide-details')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Featured Picks' })).toBeVisible();
  });
});
