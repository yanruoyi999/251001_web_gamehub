import { expect, test } from './fixtures';

const languages = [
  {
    prefix: '/en',
    heading: 'Word Chain Game Examples: 8 Puzzles with Answers',
    reveal: 'Reveal answer 1',
  },
  {
    prefix: '',
    heading: '英语复合词接龙练习：8题附答案',
    reveal: '展开第 1 题答案与解释',
  },
];
const slug = 'word-chain-game-examples';

for (const language of languages) {
  test(`Word chain ${language.prefix || 'zh'}: clues, keyboard answers and metadata agree`, async ({
    page,
  }) => {
    const path = `${language.prefix}/guides/${slug}`;
    expect(
      (await page.goto(path, { waitUntil: 'domcontentloaded' }))?.status()
    ).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      language.heading
    );
    const practice = page.locator('#word-chain-practice');
    await expect(practice.locator('details')).toHaveCount(8);
    await expect(practice.locator('ol')).toHaveCount(8);
    await expect(practice.locator('ol li')).toHaveCount(48);
    await expect(page.locator('main iframe')).toHaveCount(0);
    await expect(page.locator('#recommendations')).toHaveCount(0);
    await expect(page.locator('a[href="#word-chain-practice"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://www.lumagamehub.com${path}`
    );
    for (const [locale, prefix] of [
      ['en-US', '/en'],
      ['zh-CN', ''],
    ]) {
      await expect(page.locator(`link[hreflang="${locale}"]`)).toHaveAttribute(
        'href',
        `https://www.lumagamehub.com${prefix}/guides/${slug}`
      );
    }
    const data = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).flatMap(text => JSON.parse(text));
    const article = data.find(item => item['@type'] === 'Article');
    expect(article.dateModified).toBe('2026-10-31T00:00:00+08:00');
    expect(article).not.toHaveProperty('datePublished');
    expect(
      data.find(item => item['@type'] === 'FAQPage').mainEntity
    ).toHaveLength(3);
    await expect(page.locator('header time')).toHaveAttribute(
      'datetime',
      '2026-10-31T00:00:00+08:00'
    );
    for (const width of [320, 390, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      const summary = practice.locator('summary').first();
      await expect(summary).toHaveText(language.reveal);
      await summary.focus();
      await expect(summary).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(practice.locator('details').first()).toHaveAttribute(
        'open',
        ''
      );
      await expect(practice.locator('details p').first()).toHaveText(
        'door → bell → tower → block → party → hat'
      );
      await expect(
        practice.locator('details').first().locator('li')
      ).toHaveCount(5);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth
        )
      ).toBeLessThanOrEqual(1);
      await page.keyboard.press('Space');
      await expect(practice.locator('details').first()).not.toHaveAttribute(
        'open',
        ''
      );
    }
    for (const source of ['word-games-for-seniors', 'categories-game-topics']) {
      await expect(
        page.locator(`article a[href="${language.prefix}/guides/${source}"]`)
      ).toHaveCount(1);
    }
  });
}

test.describe('Word chains without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('native answer reveal, contextual discovery, index and sitemap stay available', async ({
    page,
    request,
  }) => {
    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    for (const language of languages) {
      const target = `${language.prefix}/guides/${slug}`;
      expect(xml).toContain(`<loc>https://www.lumagamehub.com${target}</loc>`);
      for (const source of [
        'word-games-for-seniors',
        'categories-game-topics',
      ]) {
        await page.goto(`${language.prefix}/guides/${source}`, {
          waitUntil: 'domcontentloaded',
        });
        await expect(page.locator('header time')).toHaveAttribute(
          'datetime',
          '2026-10-31T00:00:00+08:00'
        );
        const link = page.locator(`article a[href="${target}"]`);
        await expect(link).toHaveCount(1);
        await link.click();
        await expect(page).toHaveURL(new RegExp(`${target}$`));
        const details = page.locator('#word-chain-practice details');
        await expect(details).toHaveCount(8);
        await details.first().locator('summary').click();
        await expect(details.first().locator('p')).toBeVisible();
        await expect(details.locator('li')).toHaveCount(40);
        await expect(
          page.locator('meta[name="robots"][content*="noindex"]')
        ).toHaveCount(0);
      }
      await page.goto(`${language.prefix}/guides`, {
        waitUntil: 'domcontentloaded',
      });
      await expect(page.locator(`main a[href="${target}"]`)).toHaveCount(1);
    }
  });
});
