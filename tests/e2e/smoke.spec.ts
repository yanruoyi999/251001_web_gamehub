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
      page.getByRole('heading', { name: 'Three games to try today' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Popular guides' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Games in testing' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'View saved games' })).toHaveAttribute(
      'href',
      '/en/games/saved',
    );

    await expect(
      page.locator(
        'section[aria-labelledby="popular-guides"] a[href^="/en/guides/"]',
      ),
    ).toHaveCount(3);
    await expect(
      page.locator(
        'section[aria-labelledby="testing-games"] a[href^="/en/games/"]',
      ),
    ).toHaveCount(3);

    const layout = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
    }));
    expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
  });
});
