import { expect, test } from './fixtures';

const languages = [
  { prefix: '/en', pick: 'Pick a new round', copy: 'Copy this round', failure: 'Copy unavailable.', heading: 'Categories Game Topics: 48 Ideas for Your Next Round' },
  { prefix: '', pick: '抽取新一轮', copy: '复制本轮题目', failure: '无法自动复制', heading: 'Categories 游戏题目：48条原创主题' },
];

test('Categories guide has useful controls, correct metadata and no empty recommendations', async ({ page }, info) => {
  for (const language of languages) {
    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      const path = `${language.prefix}/guides/categories-game-topics`;
      expect((await page.goto(path))?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(language.heading);
      await expect(page.locator('[data-full-topic]')).toHaveCount(48);
      await expect(page.locator('iframe')).toHaveCount(0);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.lumagamehub.com${path}`);
      await expect(page.locator('a[href="#topic-picker"]')).toHaveCount(1);
      await expect(page.locator('#recommendations')).toHaveCount(0);
      await page.locator('a[href="#topic-picker"]').click();
      await expect(page).toHaveURL(/#topic-picker$/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      await page.screenshot({ path: info.outputPath(`categories-${language.prefix ? 'en' : 'zh'}-${width}.png`) });
    }
  }
});

test('Categories rounds reset, stay unique and provide a clipboard-denied fallback', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('Test permission denial')) } });
  });
  for (const language of languages) {
    await page.goto(`${language.prefix}/guides/categories-game-topics`);
    for (const group of ['warmup', 'everyday', 'creative']) {
      await page.locator('#category-group').selectOption(group);
      await expect(page.locator('[data-category-topic]')).toHaveCount(0);
      for (const count of [6, 8, 12]) {
        await page.locator('#category-count').selectOption(String(count));
        await page.getByRole('button', { name: language.pick, exact: true }).click();
        await expect(page.locator('[data-category-topic]')).toHaveCount(count);
        const ids = await page.locator('[data-category-topic]').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-category-topic')));
        expect(new Set(ids).size).toBe(count);
        const groups = await page.locator('[data-full-topic]').evaluateAll(nodes => Object.fromEntries(nodes.map(node => [node.getAttribute('data-full-topic'), node.closest('section')?.querySelector('h3')?.textContent])));
        const selectedGroup = await page.locator('#category-group option:checked').textContent();
        expect(ids.every(id => groups[id!] === selectedGroup)).toBe(true);
        expect((await page.locator('#category-copy').inputValue()).split('\n')).toHaveLength(count);
      }
    }
    await page.getByRole('button', { name: language.copy, exact: true }).click();
    await expect(page.getByRole('status')).toContainText(language.failure);
    await expect(page.locator('#category-copy')).toBeVisible();
    expect(await page.locator('#category-copy').inputValue()).not.toBe('');
  }
});

test.describe('Categories without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('keeps all topics, two contextual entries and sitemap discovery', async ({ page, request }) => {
    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    for (const language of languages) {
      const target = `${language.prefix}/guides/categories-game-topics`;
      expect(xml).toContain(`https://www.lumagamehub.com${target}`);
      for (const source of ['best-browser-games-5-minute-break', 'games-to-play-when-bored']) {
        await page.goto(`${language.prefix}/guides/${source}`);
        const entry = page.locator(`article a[href="${target}"]`);
        await expect(entry).toHaveCount(1);
        await entry.click();
        await expect(page).toHaveURL(new RegExp(`${target}$`));
        await expect(page.locator('[data-full-topic]')).toHaveCount(48);
        await expect(page.locator('[data-categories-topics] noscript p')).toBeVisible();
        await expect(page.locator('[data-categories-topics] noscript p')).toContainText(/JavaScript/);
        expect(await page.locator('meta[name="robots"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('content')).join(' '))).not.toContain('noindex');
      }
    }
    expect(xml).not.toContain('/games/draw-a-perfect-circle</loc>');
    expect(xml).not.toContain('/games/snake-3d</loc>');
  });
});
