import { expect, test } from './fixtures';

test.describe('Luma Game Hub smoke tests', () => {
  test('homepage renders title', async ({ page }) => {
    const response = await page.goto('/');

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveURL('/');
    await expect(page).toHaveTitle(/Luma Game Hub/i);
  });
});
