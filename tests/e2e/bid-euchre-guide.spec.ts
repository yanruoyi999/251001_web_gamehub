import { expect, test } from './fixtures';

test('Bid Euchre is reachable from Euchre and explains each score after an answer', async ({ page }) => {
  await page.goto('/en/guides/euchre-strategy');
  await page.getByRole('link', { name: /Double-deck Bid Euchre rules and scoring practice/ }).click();
  await expect(page).toHaveURL(/\/en\/guides\/bid-euchre-rules$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex.*follow/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/en\/guides\/bid-euchre-rules$/);
  await expect(page.locator('link[hreflang="zh-CN"]')).toHaveAttribute('href', /\/guides\/bid-euchre-rules$/);

  const results = page.locator('section[aria-labelledby="bid-euchre-practice"] [role="status"]');
  await expect(results).toHaveText(['', '', '']);
  await page.getByRole('button', { name: 'Bidders +5, defenders +2', exact: true }).click();
  await expect(results.first()).toContainText('Check the bid again.');
  await expect(results.first()).toContainText('Bidders +6, defenders +2');
  await page.getByRole('button', { name: 'Bidders −5, defenders +4', exact: true }).click();
  await page.getByRole('button', { name: 'Bidders −6, defenders +3', exact: true }).click();
  await expect(results.nth(1)).toContainText('Correct.');
  await expect(results.last()).toContainText('Correct.');

  await page.goto('/guides/bid-euchre-rules');
  await expect(page.getByRole('heading', { level: 1, name: /叫牌与计分/ })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex.*follow/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https?:\/\/[^/]+\/guides\/bid-euchre-rules$/);
  await page.getByRole('button', { name: '叫牌方 −6，防守方 +3', exact: true }).click();
  await expect(results.last()).toContainText('正确。');
});
