import { expect, test } from './fixtures';
import { THREE_PLAYER_SPADES_GUIDE } from '../../lib/three-player-spades-guide-content';

const slug = 'three-player-spades';
for (const locale of ['en', 'zh'] as const) {
  const prefix = locale === 'en' ? '/en' : '';
  test(`Three-player Spades ${locale}: visible rules, scores and metadata agree`, async ({
    page,
  }) => {
    const path = `${prefix}/guides/${slug}`;
    expect(
      (await page.goto(path, { waitUntil: 'domcontentloaded' }))?.status()
    ).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      THREE_PLAYER_SPADES_GUIDE.locales[locale].heading
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://www.lumagamehub.com${path}`
    );
    await expect(page.locator('link[hreflang="en-US"]')).toHaveAttribute(
      'href',
      `https://www.lumagamehub.com/en/guides/${slug}`
    );
    await expect(page.locator('link[hreflang="zh-CN"]')).toHaveAttribute(
      'href',
      `https://www.lumagamehub.com/guides/${slug}`
    );
    await expect(
      page.locator('meta[name="robots"][content*="noindex"]')
    ).toHaveCount(0);
    await expect(page.locator('main iframe')).toHaveCount(0);
    await expect(page.locator('main')).toContainText(
      locale === 'en' ? '249 + 53 − 100 = 202' : '249＋53−100＝202'
    );
    for (const name of ['Alex', 'Blair', 'Casey'])
      await expect(page.locator('main')).toContainText(name);
    for (const source of THREE_PLAYER_SPADES_GUIDE.locales[locale]
      .externalLinks!) {
      await expect(page.locator(`main a[href="${source.href}"]`)).toBeVisible();
    }
    const json = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).flatMap(t => JSON.parse(t));
    const article = json.find(x => x['@type'] === 'Article');
    expect(article.dateModified).toBe('2026-11-02T07:56:48+08:00');
    expect(article).not.toHaveProperty('datePublished');
    const faq = json.find(x => x['@type'] === 'FAQPage');
    expect(faq.mainEntity).toHaveLength(5);
    expect(await page.locator('main dl dt').allTextContents()).toEqual(
      faq.mainEntity.map((q: { name: string }) => q.name)
    );
    expect(await page.locator('main dl dd').allTextContents()).toEqual(
      faq.mainEntity.map(
        (q: { acceptedAnswer: { text: string } }) => q.acceptedAnswer.text
      )
    );
    for (const width of [320, 390, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth
        )
      ).toBeLessThanOrEqual(1);
    }
  });
}

test.describe('Three-player Spades without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('Euchre discovery, written examples, guide index and sitemap remain available', async ({
    page,
    request,
  }) => {
    for (const prefix of ['/en', '']) {
      await page.goto(`${prefix}/guides/euchre-strategy`, {
        waitUntil: 'domcontentloaded',
      });
      await page.locator(`main a[href="${prefix}/guides/${slug}"]`).click();
      await expect(page).toHaveURL(new RegExp(`${prefix}/guides/${slug}$`));
      await expect(page.locator('main')).toContainText('Alex');
      await expect(page.locator('main')).toContainText('202');
      await page
        .locator(`main a[href="${prefix}/guides/euchre-strategy"]`)
        .click();
      await expect(page).toHaveURL(
        new RegExp(`${prefix}/guides/euchre-strategy$`)
      );
      await page.goto(`${prefix}/guides`, { waitUntil: 'domcontentloaded' });
      await expect(
        page.locator(`main a[href="${prefix}/guides/${slug}"]`)
      ).toHaveCount(1);
    }
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const xml = await response.text();
    for (const prefix of ['/en', '']) {
      expect(xml).toContain(
        `<loc>https://www.lumagamehub.com${prefix}/guides/${slug}</loc>`
      );
    }
  });
});
