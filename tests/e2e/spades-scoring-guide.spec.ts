import { expect, test } from './fixtures';
import { SPADES_SCORING_GUIDE } from '../../lib/spades-scoring-guide-content';

const slug = 'spades-scoring';
for (const locale of ['en', 'zh'] as const) {
  const prefix = locale === 'en' ? '/en' : '';
  test(`Spades scoring ${locale}: readable arithmetic, sources and locale metadata`, async ({
    page,
  }) => {
    const path = `${prefix}/guides/${slug}`;
    expect(
      (await page.goto(path, { waitUntil: 'domcontentloaded' }))?.status()
    ).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      SPADES_SCORING_GUIDE.locales[locale].heading
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://www.lumagamehub.com${path}`
    );
    for (const [language, languagePrefix] of [
      ['en-US', '/en'],
      ['zh-CN', ''],
    ]) {
      await expect(
        page.locator(`link[hreflang="${language}"]`)
      ).toHaveAttribute(
        'href',
        `https://www.lumagamehub.com${languagePrefix}/guides/${slug}`
      );
    }
    await expect(
      page.locator('meta[name="robots"][content*="noindex"]')
    ).toHaveCount(0);
    await expect(page.locator('main iframe, main input')).toHaveCount(0);
    await expect(page.locator('main')).toContainText(
      locale === 'en' ? '60 + 2 = 62' : '60＋2＝62'
    );
    await expect(page.locator('main')).toContainText(
      locale === 'en' ? '160 − 80 = 80' : '160−80＝80'
    );
    await expect(page.locator('main')).toContainText(
      locale === 'en' ? '237 + 44 − 100 = 181' : '237＋44−100＝181'
    );
    for (const source of SPADES_SCORING_GUIDE.locales[locale].externalLinks!) {
      await expect(page.locator(`main a[href="${source.href}"]`)).toBeVisible();
    }
    const schema = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).flatMap(value => JSON.parse(value));
    const article = schema.find(value => value['@type'] === 'Article');
    expect(article.dateModified).toBe(SPADES_SCORING_GUIDE.updatedAt);
    expect(article).not.toHaveProperty('datePublished');
    const faq = schema.find(value => value['@type'] === 'FAQPage');
    expect(await page.locator('main dl dt').allTextContents()).toEqual(
      faq.mainEntity.map((question: { name: string }) => question.name)
    );
    expect(await page.locator('main dl dd').allTextContents()).toEqual(
      faq.mainEntity.map(
        (question: { acceptedAnswer: { text: string } }) =>
          question.acceptedAnswer.text
      )
    );
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth
      )
    ).toBeLessThanOrEqual(1);
    await page.screenshot({
      path: test.info().outputPath(`scoring-${locale}-390.png`),
      fullPage: true,
    });
  });
}

test.describe('Spades scoring without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('both locale guides have reciprocal three-player links, directory discovery and one sitemap entry', async ({
    page,
    request,
  }) => {
    for (const prefix of ['/en', '']) {
      await page.goto(`${prefix}/guides/three-player-spades`, {
        waitUntil: 'domcontentloaded',
      });
      await page.locator(`main a[href="${prefix}/guides/${slug}"]`).click();
      await expect(page).toHaveURL(new RegExp(`${prefix}/guides/${slug}$`));
      await expect(page.locator('main')).toContainText('181');
      await expect(page.locator('main')).toContainText(
        prefix === '/en' ? 'Every complete group of ten' : '累计袋数每满10'
      );
      await page
        .locator(`main a[href="${prefix}/guides/three-player-spades"]`)
        .click();
      await expect(page).toHaveURL(
        new RegExp(`${prefix}/guides/three-player-spades$`)
      );
      await expect(page.getByRole('heading', { level: 1 })).toContainText(
        prefix === '/en' ? '3 Players' : '三人'
      );
      await page.goto(`${prefix}/guides`, { waitUntil: 'domcontentloaded' });
      await expect(
        page.locator(`main a[href="${prefix}/guides/${slug}"]`)
      ).toHaveCount(1);
      await page.locator(`main a[href="${prefix}/guides/${slug}"]`).click();
      await expect(page).toHaveURL(new RegExp(`${prefix}/guides/${slug}$`));
    }
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const xml = await response.text();
    for (const prefix of ['/en', '']) {
      expect(
        xml.split(
          `<loc>https://www.lumagamehub.com${prefix}/guides/${slug}</loc>`
        )
      ).toHaveLength(2);
    }
  });
});
