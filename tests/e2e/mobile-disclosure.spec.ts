import { expect, test } from './fixtures';

test.describe('mobile disclosures without hydration', () => {
  test.use({
    hasTouch: true,
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });

  test('opens navigation and advanced filters on the first click', async ({
    page,
  }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });

    await page
      .locator('label[for="mobile-navigation-toggle"]')
      .filter({ hasText: /open navigation menu/i })
      .click();
    await expect(page.locator('#mobile-navigation-toggle')).toBeChecked();
    await expect(page.locator('#mobile-navigation')).toBeVisible();
    await expect(
      page
        .locator('label[for="mobile-navigation-toggle"]')
        .filter({ hasText: /close navigation menu/i })
    ).toBeVisible();

    await page.goto('/en/games', { waitUntil: 'domcontentloaded' });
    await page
      .locator('label[for="game-filter-toggle"]')
      .filter({ hasText: /more filters/i })
      .click();
    await expect(page.locator('#game-filter-toggle')).toBeChecked();
    await expect(
      page
        .locator('label[for="game-filter-toggle"]')
        .filter({ hasText: /hide filters/i })
    ).toBeVisible();
    await expect(page.getByText('Category', { exact: true })).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth + 1
        )
      )
      .toBe(true);
  });

  test('keeps the publisher play link actionable before hydration', async ({ page }) => {
    await page.goto('/en/guides/google-snake-mods', {
      waitUntil: 'domcontentloaded',
    });

    const playLink = page.getByRole('link', {
      name: 'Play standard Snake on Google (no mods)',
    });
    await expect(playLink).toHaveAttribute('href', 'https://www.google.com/fbx?fbx=snake_arcade');
    await expect(playLink).toHaveAttribute('target', '_blank');
    await expect(page.locator('main iframe')).toHaveCount(0);
  });

  test('moves focus to guide jump targets before hydration', async ({ page }) => {
    await page.goto('/en/guides/google-snake-mods', {
      waitUntil: 'domcontentloaded',
    });
    await page.getByRole('link', { name: 'Read the guide' }).click();

    await expect(page).toHaveURL(/#guide-details$/);
    await expect(page.locator('#guide-details')).toBeFocused();

    await page.goto('/en/guides/google-snake-mods', {
      waitUntil: 'domcontentloaded',
    });
    await page.getByRole('link', { name: 'See similar games' }).click();

    await expect(page).toHaveURL(/#recommendations$/);
    await expect(page.locator('#recommendations')).toBeFocused();
  });
});
