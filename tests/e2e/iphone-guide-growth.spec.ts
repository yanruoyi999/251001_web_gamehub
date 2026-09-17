import { expect, test } from './fixtures';

test('iPhone guide exposes one evidence-labelled entry in the first mobile screen and preserves dates', async ({ page }, info) => {
  for (const [locale,path] of [['en','/en/guides/best-free-iphone-games'],['zh','/guides/best-free-iphone-games']]) {
    for (const width of [390,1280]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(path);
      const pick = page.locator('[data-guide-pick-action="play_circle"]');
      await expect(pick).toHaveCount(1);
      await expect(pick).toHaveAttribute('href', `${locale === 'en' ? '/en' : ''}/games/draw-a-perfect-circle`);
      const box = await pick.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.y + box!.height).toBeLessThanOrEqual(844);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      await page.locator('[data-guide-quick-picks] summary').click();
      await expect(page.locator('[data-guide-quick-picks]')).toContainText('WebKit');
      await expect(page.locator('[data-guide-quick-picks]')).toContainText('Chromium');
      const article = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.map(node => JSON.parse(node.textContent!)).find(value => value['@type'] === 'Article'));
      expect(article).not.toHaveProperty('datePublished');
      await expect(page.locator('meta[property="article:published_time"]')).toHaveCount(0);
      await expect(page.locator('meta[property="article:modified_time"]')).toHaveAttribute('content', article.dateModified);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.lumagamehub.com${path}`);
      await page.screenshot({path:info.outputPath(`iphone-guide-${locale}-${width}.png`)});
    }
  }
});

test('the visible quick pick emits one exposure and one activation while retaining native navigation', async ({ page }) => {
  const events: string[] = [];
  await page.exposeFunction('captureGrowthEvent', (name: string) => { events.push(name); });
  await page.addInitScript(() => {
    const target = window as typeof window & { captureGrowthEvent: (name: string) => Promise<void>; clarity?: (...args: unknown[]) => void };
    target.clarity = (command, name) => {
      if (command === 'event' && ['guide_intent_view','guide_intent_click'].includes(String(name))) void target.captureGrowthEvent(String(name));
    };
  });
  await page.setViewportSize({width:390,height:844});
  await page.goto('/en/guides/best-free-iphone-games');
  await expect.poll(() => events.filter(name => name === 'guide_intent_view').length).toBe(1);
  await page.locator('footer').scrollIntoViewIfNeeded();
  await page.locator('[data-guide-quick-picks]').scrollIntoViewIfNeeded();
  await page.locator('[data-guide-pick-action="play_circle"]').click();
  await expect(page).toHaveURL(/\/en\/games\/draw-a-perfect-circle$/);
  await expect.poll(() => events.filter(name => name === 'guide_intent_click').length).toBe(1);
  expect(events.filter(name => name === 'guide_intent_view')).toHaveLength(1);
});

test.describe('iPhone guide before hydration', () => {
  test.use({javaScriptEnabled:false});
  test('keeps the native game link and preserves the existing experimental noindex', async ({page}) => {
    await page.goto('/en/guides/best-free-iphone-games');
    await page.locator('[data-guide-pick-action="play_circle"]').click();
    await expect(page).toHaveURL(/\/en\/games\/draw-a-perfect-circle$/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });
});
