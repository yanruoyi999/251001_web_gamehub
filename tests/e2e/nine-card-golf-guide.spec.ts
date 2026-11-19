import { expect, test } from './fixtures';

const slug = '9-card-golf-rules';

test('Nine Card Golf exposes rules in both languages and explains only after scoring', async ({ page }) => {
  await page.goto('/en/guides/golf-card-game-rules');
  await page.getByRole('link', { name: /Nine Card Golf Rules and Scoring/ }).click();
  await expect(page).toHaveURL(new RegExp(`/en/guides/${slug}$`));
  await expect(page.getByRole('heading', { level: 1, name: 'Nine Card Golf Rules and Scoring' })).toBeVisible();
  await page.goto(`/en/guides/${slug}`);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex.*follow/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`/en/guides/${slug}$`));
  await expect(page.locator('link[hreflang="zh-CN"]')).toHaveAttribute('href', new RegExp(`/guides/${slug}$`));
  const practice = page.locator('#nine-card-golf-practice');
  const first = practice.getByRole('spinbutton').first();
  await expect(practice.getByRole('table')).toHaveCount(1);
  await expect(practice.getByRole('status')).toHaveText('');
  await practice.getByRole('button', { name: 'Check answer' }).click();
  await expect(practice.getByRole('status')).toHaveText('Enter a whole number.');
  await first.fill('30.5');
  await first.press('Enter');
  await expect(practice.getByRole('table')).toHaveCount(1);
  await expect(practice.getByRole('status')).toHaveText('Enter a whole number.');
  await first.fill('24');
  await first.press('Enter');
  await expect(practice.getByRole('status').first()).toContainText('Total: 30');
  await expect(practice.getByRole('status').first()).toContainText('7 + 7 + 10 = 24');
  await expect(practice.getByRole('table')).toHaveCount(2);
  await expect(practice.getByRole('status').last()).toHaveText('');
  await practice.getByRole('spinbutton').last().fill('37');
  await practice.getByRole('button', { name: 'Check answer' }).last().click();
  await expect(practice.getByRole('status').last()).toContainText('Correct. Total: 37');

  await page.goto(`/guides/${slug}`);
  await expect(page.getByRole('heading', { level: 1, name: /九张 Golf/ })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex.*follow/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`^https?://[^/]+/guides/${slug}$`));
  await expect(page.locator('link[hreflang="en-US"]')).toHaveAttribute('href', new RegExp(`/en/guides/${slug}$`));
  await practice.getByRole('spinbutton').first().fill('30');
  await practice.getByRole('button', { name: '核对答案' }).first().click();
  await expect(practice.getByRole('status').first()).toContainText('正确。合计：30');
  await practice.getByRole('spinbutton').last().fill('0');
  await practice.getByRole('button', { name: '核对答案' }).last().click();
  await expect(practice.getByRole('status').last()).toContainText('再核对三列。合计：37');

  const sitemap = await page.request.get('/sitemap.xml');
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).not.toContain(slug);
});
