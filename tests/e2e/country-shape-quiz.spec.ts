import { expect, test } from './fixtures';

for (const locale of ['en', 'zh'] as const) {
  test(`shape quiz completes and reviews missed answers in ${locale}`, async ({ page }) => {
    const prefix = locale === 'en' ? '/en' : '';
    await page.goto(`${prefix}/games/word-ladder`);
    await page.getByRole('link', { name: /Country Shape Quiz|看轮廓猜国家/ }).click();
    await expect(page).toHaveURL(new RegExp(`${prefix}/games/country-shape-quiz$`));
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.lumagamehub.com${prefix}/games/country-shape-quiz`);
    await expect(page.locator('link[hreflang="zh-CN"]')).toHaveAttribute('href', 'https://www.lumagamehub.com/games/country-shape-quiz');
    const game = page.getByRole('region', { name: /Country outline game|看轮廓猜国家游戏/ });
    const image = game.getByRole('img');
    await expect(image).toHaveJSProperty('naturalWidth', 360);
    await game.getByRole('combobox').selectOption('oceania');
    await expect(image).toHaveAttribute('src', '/images/country-shapes/AUS.png');
    await game.getByRole('button', { name: /New Zealand|新西兰/ }).press('Enter');
    await expect(game.getByRole('status')).toContainText(/Australia|澳大利亚/);
    await game.getByRole('button', { name: /Next outline|下一题/ }).click();
    await game.getByRole('button', { name: /New Zealand|新西兰/ }).click();
    await game.getByRole('button', { name: /Next outline|下一题/ }).click();
    await game.getByRole('button', { name: /Papua New Guinea|巴布亚新几内亚/ }).click();
    await game.getByRole('button', { name: /See score|查看得分/ }).click();
    await expect(game.getByRole('status')).toContainText('2/3');
    await game.getByRole('button', { name: /Practice missed outlines|重练错题/ }).click();
    await expect(image).toHaveAttribute('src', '/images/country-shapes/AUS.png');
    await game.getByRole('button', { name: /Australia|澳大利亚/ }).click();
    await game.getByRole('button', { name: /See score|查看得分/ }).click();
    await expect(game.getByRole('status')).toContainText('1/1');
    await game.getByRole('button', { name: /New round|再玩一轮/ }).click();
    await expect(image).toHaveAttribute('src', '/images/country-shapes/NZL.png');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  });
}

test('country shape quiz stays outside the sitemap', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBe(true);
  expect(await response.text()).not.toContain('/games/country-shape-quiz');
});
