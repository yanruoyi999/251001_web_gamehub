import { expect, test } from './fixtures';

test('catalogue search, filters and pagination remain distinct from game details', async ({ page }) => {
  await page.goto('/en/games');
  await expect(page.getByRole('heading', { name: 'All Browser Games' })).toBeVisible();

  await page.locator('a[href="/en/games?page=2"]').click();
  await expect(page).toHaveURL(/\/en\/games\?page=2$/);
  await expect(page.locator('a[href="/en/games?page=1"]')).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/en\/games$/);

  const filters = page.locator('form').filter({ has: page.locator('input[name="search"]') });
  await filters.locator('input[name="search"]').fill('Tunnel Rush');
  await filters.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/search=Tunnel\+Rush/);
  const detail = page.getByRole('main').getByRole('link', { name: /tunnel rush/i }).filter({ hasText: /tunnel rush/i });
  await expect(detail.first()).toBeVisible();
  await detail.first().click();
  await expect(page).toHaveURL(/\/en\/games\/tunnel-rush$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Tunnel Rush', exact: true })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.lumagamehub.com/en/games/tunnel-rush');
  await page.goBack();
  await expect(filters.locator('input[name="search"]')).toHaveValue('Tunnel Rush');

  await page.goto('/en/games');
  const toggle = page.locator('#game-filter-toggle');
  if (!(await filters.locator('select[name="categoryId"]').isVisible())) {
    await page.locator('label[for="game-filter-toggle"]:visible').click();
    await expect(toggle).toBeChecked();
  }
  const category = filters.locator('select[name="categoryId"]');
  const id = await category.locator('option').nth(1).getAttribute('value');
  expect(id).toBeTruthy();
  await category.selectOption(id!);
  await filters.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(new RegExp(`[?&]categoryId=${id}(?:&|$)`));
  await expect(category).toHaveValue(id!);
});
