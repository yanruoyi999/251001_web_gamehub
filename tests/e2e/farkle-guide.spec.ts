import { expect, test } from './fixtures';

const slug = 'farkle-scoring';
const source =
  'https://playmonster.com/wp-content/uploads/2018/06/Farkle-Rules.pdf';
const scores = [
  100, 50, 300, 200, 300, 400, 500, 600, 1000, 2000, 3000, 1500, 1500, 1500,
  2500,
];

test.use({ trace: 'off', video: 'off' });
for (const locale of ['en', 'zh'] as const) {
  const prefix = locale === 'en' ? '/en' : '';
  test(`Farkle ${locale}: complete reference, exercises, source and metadata`, async ({
    page,
  }, testInfo) => {
    const path = `${prefix}/guides/${slug}`;
    expect(
      (await page.goto(path, { waitUntil: 'domcontentloaded' }))?.status()
    ).toBe(200);
    const title =
      locale === 'en'
        ? 'Farkle Scoring: 15 Scores & Six Worked Examples'
        : 'Farkle计分：15类分值与六个完整算例';
    await expect(page).toHaveTitle(new RegExp(title));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      locale === 'en'
        ? 'Farkle Scoring: Points and Worked Examples'
        : 'Farkle计分：分值速查与完整算例'
    );
    for (const selector of [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
    ]) {
      await expect(page.locator(selector)).toHaveAttribute('content', title);
    }
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      'content',
      'article'
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image'
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://www.lumagamehub.com${path}`
    );
    for (const [language, route] of [
      ['en-US', '/en'],
      ['zh-CN', ''],
    ]) {
      await expect(
        page.locator(`link[hreflang="${language}"]`)
      ).toHaveAttribute(
        'href',
        `https://www.lumagamehub.com${route}/guides/${slug}`
      );
    }
    await expect(
      page.locator('meta[name="robots"][content*="noindex"]')
    ).toHaveCount(0);
    const main = page.locator('main');
    const reference = main
      .locator('div')
      .filter({
        has: page.getByRole('heading', {
          name:
            locale === 'en'
              ? 'Farkle scoring quick reference — all 15 categories'
              : 'Farkle分值速查：完整15类',
          exact: true,
        }),
      })
      .last();
    const rows = await reference.locator('li').allTextContents();
    expect(rows).toHaveLength(15);
    expect(rows.map(row => Number(row.match(/= (\d+)/)![1]))).toEqual(scores);
    for (const letter of ['A', 'B', 'C', 'D', 'E', 'F']) {
      await expect(
        main.getByRole('heading', {
          name: new RegExp(
            `${locale === 'en' ? 'Example' : '例题'} ${letter} —`
          ),
        })
      ).toBeVisible();
    }
    for (const equation of [
      '200 + 50 + 100 = 350',
      '100 + 50 = 150',
      '400 + 150 = 550',
      '9400 + 650 = 10050',
      '9100 + 1000 = 10100',
    ]) {
      await expect(main).toContainText(equation);
    }
    for (const boundary of ['2018/06', '©2016', '500', '2500', '750', '3000'])
      await expect(main).toContainText(boundary);
    await expect(main).toContainText(
      locale === 'en' ? 'banked score stays 700' : '旧已入账仍为700'
    );
    await expect(main).toContainText(
      locale === 'en' ? 'different throws' : '不同次掷骰'
    );
    await expect(main).toContainText(
      locale === 'en' ? 'not won immediately' : '不会立即胜'
    );
    await expect(main).toContainText(
      locale === 'en' ? 'does not detail a tie procedure' : '未细述平分处理'
    );
    for (const href of [
      source,
      'https://www.dicegamedepot.com/farkle-rules/',
      'https://litegames.freshdesk.com/en/support/solutions/articles/60000688670-farkle-rules',
    ])
      await expect(main.locator(`a[href="${href}"]`).first()).toBeVisible();
    await expect(main.locator('iframe')).toHaveCount(0);
    const json = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).flatMap(text => JSON.parse(text));
    const article = json.find(item => item['@type'] === 'Article');
    expect(article.dateModified).toMatch(/^2026-11-02T\d\d:\d\d:\d\d\+08:00$/);
    expect(new Date(article.dateModified).getTime()).toBeLessThanOrEqual(
      Date.now()
    );
    expect(article).not.toHaveProperty('datePublished');
    expect(article.citation).toContain(source);
    const faq = json.find(item => item['@type'] === 'FAQPage');
    expect(faq.mainEntity).toHaveLength(5);
    expect(await main.locator('dl dt').allTextContents()).toEqual(
      faq.mainEntity.map((q: { name: string }) => q.name)
    );
    expect(await main.locator('dl dd').allTextContents()).toEqual(
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
    await page.setViewportSize({ width: 390, height: 844 });
    await reference.screenshot({
      path: testInfo.outputPath(
        `reference-${locale}-${testInfo.project.name}-390.png`
      ),
    });
    const example = main
      .locator('div')
      .filter({
        has: page.getByRole('heading', {
          name: new RegExp(`${locale === 'en' ? 'Example' : '例题'} D —`),
        }),
      })
      .last();
    await example.screenshot({
      path: testInfo.outputPath(
        `example-D-${locale}-${testInfo.project.name}-390.png`
      ),
    });
  });
}

test.describe('Farkle without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('both locales remain readable and discoverable through index and sitemap', async ({
    page,
    request,
  }) => {
    for (const prefix of ['/en', '']) {
      await page.goto(`${prefix}/guides`, { waitUntil: 'domcontentloaded' });
      await page.locator(`main a[href="${prefix}/guides/${slug}"]`).click();
      await expect(page).toHaveURL(new RegExp(`${prefix}/guides/${slug}$`));
      await expect(page.locator('main')).toContainText('2500');
      await expect(page.locator('main')).toContainText('400 + 150 = 550');
      await expect(page.locator('main')).toContainText('9100 + 1000 = 10100');
      await expect(
        page.locator(`main a[href="${source}"]`).first()
      ).toBeVisible();
      await expect(
        page.locator(`main a[href="${prefix}/guides/spades-scoring"]`)
      ).toBeVisible();
    }
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    for (const prefix of ['/en', ''])
      expect(await response.text()).toContain(
        `<loc>https://www.lumagamehub.com${prefix}/guides/${slug}</loc>`
      );
  });
});
