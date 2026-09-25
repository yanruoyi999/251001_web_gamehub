import { expect, test } from './fixtures';
import { EUCHRE_EXAMPLES, EUCHRE_GUIDE } from '../../lib/euchre-guide-content';

for (const locale of ['en', 'zh'] as const) {
  const prefix = locale === 'en' ? '/en' : '';
  const path = `${prefix}/guides/euchre-strategy`;
  test(`Euchre ${locale}: source-labelled examples, FAQ and discovery agree`, async ({ page }, info) => {
    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(EUCHRE_GUIDE.locales[locale].heading);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.lumagamehub.com${path}`);
    await expect(page.locator('link[hreflang="en-US"]')).toHaveAttribute('href', 'https://www.lumagamehub.com/en/guides/euchre-strategy');
    await expect(page.locator('link[hreflang="zh-CN"]')).toHaveAttribute('href', 'https://www.lumagamehub.com/guides/euchre-strategy');
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
    for (const exercise of EUCHRE_EXAMPLES) await expect(page.getByRole('heading', { name: exercise.title[locale], exact: true })).toBeVisible();
    const data = (await page.locator('script[type="application/ld+json"]').allTextContents()).flatMap(text => JSON.parse(text));
    const faq = data.find(item => item['@type'] === 'FAQPage');
    expect(faq.mainEntity).toHaveLength(5);
    expect(await page.locator('main dl dt').allTextContents()).toEqual(faq.mainEntity.map((item: { name: string }) => item.name));
    expect(await page.locator('main dl dd').allTextContents()).toEqual(faq.mainEntity.map((item: { acceptedAnswer: { text: string } }) => item.acceptedAnswer.text));
    await expect(page.locator('main iframe')).toHaveCount(0);
    for (const slug of EUCHRE_GUIDE.relatedSlugs) await expect(page.locator(`main a[href="${prefix}/guides/${slug}"]`)).toBeVisible();
    for (const width of [320, 390, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: info.outputPath(`euchre-${locale}-mobile.png`) });
  });
}

test.describe('Euchre native navigation', () => {
  test.use({ javaScriptEnabled: false });
  test('is discoverable from the existing guide and readable without scripts', async ({ page, request }) => {
    for (const prefix of ['/en', '']) {
      await page.goto(`${prefix}/guides/categories-game-topics`, { waitUntil: 'domcontentloaded' });
      await page.locator(`main a[href="${prefix}/guides/euchre-strategy"]`).click();
      await expect(page).toHaveURL(new RegExp(`${prefix}/guides/euchre-strategy$`));
      await expect(page.locator('main dl dt')).toHaveCount(5);
      await expect(page.getByRole('heading', { name: EUCHRE_EXAMPLES[3].title[prefix ? 'en' : 'zh'], exact: true })).toBeVisible();
      await page.goto(`${prefix}/guides`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator(`main a[href="${prefix}/guides/euchre-strategy"]`).first()).toBeVisible();
    }
    const xml = await (await request.get('/sitemap.xml')).text();
    for (const prefix of ['/en', '']) expect(xml).toContain(`<loc>https://www.lumagamehub.com${prefix}/guides/euchre-strategy</loc>`);
  });
});
