import { expect, test } from './fixtures';

test.describe('mobile disclosures without hydration', () => {
  test.use({
    hasTouch: true,
    isMobile: true,
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
});
