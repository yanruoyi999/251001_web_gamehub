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
    await page.goto('/en');

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

    await page.goto('/en/games');
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

  test('keeps guide play intent actionable before hydration', async ({ page }) => {
    await page.goto('/en/guides/google-snake-mods');

    const playLink = page.locator('#play').getByRole('link', {
      name: 'Play standard Snake - no mods',
    });

    await expect(playLink).toHaveAttribute('href', '/en/games/google-snake');
    await playLink.click();
    await expect(page).toHaveURL(/\/en\/games\/google-snake$/);
  });

  test('moves focus to guide jump targets before hydration', async ({ page }) => {
    await page.goto('/en/guides/google-snake-mods');
    await page.getByRole('link', { name: 'Read the guide' }).click();

    await expect(page).toHaveURL(/#guide-details$/);
    await expect(page.locator('#guide-details')).toBeFocused();

    await page.goto('/en/guides/google-snake-mods');
    await page.getByRole('link', { name: 'See similar games' }).click();

    await expect(page).toHaveURL(/#recommendations$/);
    await expect(page.locator('#recommendations')).toBeFocused();
  });
});
