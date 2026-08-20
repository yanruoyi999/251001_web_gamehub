import { expect, test } from './fixtures';

const SORTING_PATH = '/en/games/sorting-games';

test.describe('Sorting Games', () => {
  test('loads the original sorting hub without iframe or horizontal overflow', async ({ page }) => {
    const response = await page.goto(SORTING_PATH);

    expect(response?.ok()).toBe(true);
    await expect(page.getByRole('heading', { level: 1, name: 'Sorting Games Online' })).toBeVisible();
    await expect(page.locator('[data-sorting-game]')).toHaveCount(3);
    await expect(page.locator('[data-sorting-challenge-code]')).toHaveText(/^[A-Z2-9]{6}$/);
    await expect(page.locator('iframe')).toHaveCount(0);

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(hasOverflow).toBe(false);
  });

  test('switches among all three original local games', async ({ page }) => {
    await page.goto(SORTING_PATH);

    await page.locator('[data-sorting-game="number-order-sprint"]').click();
    await page.locator('[data-sorting-start]').click();
    await expect(page.locator('[data-number-tile]')).toHaveCount(9);

    await page.locator('[data-sorting-game="shape-shelf-sort"]').click();
    await page.locator('[data-sorting-start]').click();
    await expect(page.locator('[data-shape-card]')).toHaveCount(1);

    await page.locator('[data-sorting-game="color-stack-sort"]').click();
    await page.locator('[data-sorting-start]').click();
    await expect(page.locator('[data-color-stack]')).toHaveCount(5);
    await expect(page.locator('iframe')).toHaveCount(0);
  });

  test('completes Number Order Sprint by sorting the rendered values', async ({ page }) => {
    await page.goto(`${SORTING_PATH}?challenge=SORT88`);
    await expect(page.locator('[data-sorting-challenge-code]')).toHaveText('SORT88');

    await page.locator('[data-sorting-game="number-order-sprint"]').click();
    await page.locator('[data-sorting-start]').click();

    const values = await page.locator('[data-number-tile]').evaluateAll((tiles) =>
      tiles.map((tile) => Number(tile.getAttribute('data-number-tile'))),
    );
    const ordered = [...values].sort((left, right) => left - right);

    for (const value of ordered) {
      await page.locator(`[data-number-tile="${value}"]`).click();
    }

    await expect(page.locator('[data-sorting-complete]')).toBeVisible();
    await expect(page.locator('[data-sorting-complete]')).toContainText('Challenge complete!');
  });

  test('reuses the same challenge code and number order after reload', async ({ page }) => {
    await page.goto(`${SORTING_PATH}?challenge=SORT88`);
    await expect(page.locator('[data-sorting-challenge-code]')).toHaveText('SORT88');

    await page.locator('[data-sorting-game="number-order-sprint"]').click();
    await page.locator('[data-sorting-start]').click();
    const firstOrder = await page.locator('[data-number-tile]').evaluateAll((tiles) =>
      tiles.map((tile) => tile.getAttribute('data-number-tile')),
    );

    await page.reload();
    await expect(page.locator('[data-sorting-challenge-code]')).toHaveText('SORT88');
    await page.locator('[data-sorting-game="number-order-sprint"]').click();
    await page.locator('[data-sorting-start]').click();
    const repeatedOrder = await page.locator('[data-number-tile]').evaluateAll((tiles) =>
      tiles.map((tile) => tile.getAttribute('data-number-tile')),
    );

    expect(repeatedOrder).toEqual(firstOrder);
  });
});