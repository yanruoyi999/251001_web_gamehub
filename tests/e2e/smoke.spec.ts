import { test, expect } from '@playwright/test';

test.describe.skip('Luma Game Hub smoke tests', () => {
  test('homepage renders title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Luma Game Hub/i);
  });
});
