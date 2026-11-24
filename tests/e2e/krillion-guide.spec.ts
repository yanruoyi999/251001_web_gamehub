import { expect, test } from './fixtures';

for (const prefix of ['', '/en']) {
  test('Krillion entry choice and canonical at ' + (prefix || '/'), async ({ page }) => {
    const path = prefix + '/guides/krillion';
    await page.goto(prefix + '/guides/categories-game-topics');
    await page.locator('a[href="' + path + '"]').first().click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Krillion');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.lumagamehub.com' + path);
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
    for (const [action, href] of [
      ['open_daily', 'https://krillion.io/'],
      ['open_roblox', 'https://www.roblox.com/games/115175190808402/Krillion'],
    ]) {
      const entries = page.locator('a[data-guide-intent-action="' + action + '"]');
      await expect(entries).toHaveCount(2);
      await expect(entries.first()).toHaveAttribute('href', href);
      await expect(entries.last()).toHaveAttribute('href', href);
    }
  });
}
