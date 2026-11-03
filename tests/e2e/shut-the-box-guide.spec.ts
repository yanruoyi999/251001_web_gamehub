import { expect, test } from './fixtures';

const slug = 'shut-the-box-rules';
const source = 'https://www.mastersofgames.com/rules/shut-box-rules.htm';
test.use({ trace: 'off', video: 'off' });

for (const locale of ['en', 'zh'] as const) {
  const prefix = locale === 'en' ? '/en' : '';
  test(`Shut the Box ${locale}: rules, examples, metadata and responsive reading`, async ({
    page,
  }, testInfo) => {
    const path = `${prefix}/guides/${slug}`;
    expect(
      (await page.goto(path, { waitUntil: 'domcontentloaded' }))?.status()
    ).toBe(200);
    const title =
      locale === 'en'
        ? 'Shut the Box Game Rules: 1–9 Scoring & Five Examples'
        : 'Shut the Box游戏规则：1–9计分与五个算例';
    await expect(page).toHaveTitle(new RegExp(title));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      locale === 'en'
        ? 'Shut the Box Game Rules: A 1–9 Guide'
        : 'Shut the Box游戏规则：1–9求和版'
    );
    for (const selector of [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
    ])
      await expect(page.locator(selector)).toHaveAttribute('content', title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /1–9/
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      'content',
      'article'
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://www.lumagamehub.com${path}`
    );
    for (const [language, route] of [
      ['en-US', '/en'],
      ['zh-CN', ''],
    ])
      await expect(
        page.locator(`link[hreflang="${language}"]`)
      ).toHaveAttribute(
        'href',
        `https://www.lumagamehub.com${route}/guides/${slug}`
      );
    await expect(
      page.locator('meta[name="robots"][content*="noindex"]')
    ).toHaveCount(0);
    const main = page.locator('main');
    for (const letter of ['A', 'B', 'C', 'D', 'E'])
      await expect(
        main.getByRole('heading', {
          name: new RegExp(
            `${locale === 'en' ? 'Example' : '例题'} ${letter} —`
          ),
        })
      ).toBeVisible();
    for (const equation of [
      '3 + 4 = 7',
      '1 + 2 + 4',
      '4 + 4 = 8',
      '2 + 6 = 8',
      '3 + 5 = 8',
      '1 + 4 + 6 = 11',
    ])
      await expect(main).toContainText(equation);
    for (const remaining of [34, 24, 12, 0])
      await expect(main).toContainText(
        `${locale === 'en' ? 'remaining sum' : '剩余和'} = ${remaining}`
      );
    await expect(main).toContainText(
      locale === 'en' ? 'only legal choice' : '唯一合法组合'
    );
    await expect(main).toContainText(
      locale === 'en' ? 'switching to one die was optional' : '改用一骰不是强制'
    );
    await expect(main).toContainText(
      locale === 'en'
        ? 'not a final score unless the turn ends'
        : '尚未结束回合就不是最终得分'
    );
    await expect(main).toContainText(locale === 'en' ? 'not 146' : '不是146');
    await expect(main).toContainText(
      locale === 'en' ? 'not a recorded random game' : '不是真实随机对局记录'
    );
    await expect(main).toContainText(
      locale === 'en'
        ? 'does not establish a universal tie procedure'
        : '没有给出通用平分程序'
    );
    await expect(main.locator(`a[href="${source}"]`).first()).toBeVisible();
    for (const related of ['how-to-play-dominoes', 'farkle-scoring'])
      await expect(
        main.locator(`a[href="${prefix}/guides/${related}"]`)
      ).toBeVisible();
    await expect(
      main.getByRole('link', {
        name: locale === 'en' ? 'Browse browser games' : '浏览网页游戏',
        exact: true,
      })
    ).toBeVisible();
    await expect(main.locator('iframe')).toHaveCount(0);
    const schema = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).flatMap(text => JSON.parse(text));
    const article = schema.find(item => item['@type'] === 'Article');
    expect(article.dateModified).toMatch(/^2026-11-03T\d\d:\d\d:\d\d\+08:00$/);
    expect(new Date(article.dateModified).getTime()).toBeLessThanOrEqual(
      Date.now()
    );
    expect(article).not.toHaveProperty('datePublished');
    expect(article.citation).toContain(source);
    const faq = schema.find(item => item['@type'] === 'FAQPage');
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
      await page.screenshot({
        path: testInfo.outputPath(`${locale}-${width}.png`),
      });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    for (const letter of ['A', 'C', 'E']) {
      const example = main
        .locator('div')
        .filter({
          has: page.getByRole('heading', {
            name: new RegExp(
              `${locale === 'en' ? 'Example' : '例题'} ${letter} —`
            ),
          }),
        })
        .last();
      await example.screenshot({
        path: testInfo.outputPath(`${locale}-example-${letter}-390.png`),
      });
    }
  });
}

test.describe('Shut the Box without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('both locale entries appear once in the index and sitemap and remain readable', async ({
    page,
    request,
  }) => {
    for (const prefix of ['/en', '']) {
      await page.goto(`${prefix}/guides`, { waitUntil: 'domcontentloaded' });
      const entry = page.locator(`main a[href="${prefix}/guides/${slug}"]`);
      await expect(entry).toHaveCount(1);
      await entry.click();
      await expect(page).toHaveURL(new RegExp(`${prefix}/guides/${slug}$`));
      await expect(page.locator('main')).toContainText('1 + 4 + 6 = 11');
      await expect(page.locator('main')).toContainText('34');
      await expect(
        page.locator(`main a[href="${source}"]`).first()
      ).toBeVisible();
      await expect(
        page.locator(`main a[href="${prefix}/guides/how-to-play-dominoes"]`)
      ).toBeVisible();
    }
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const xml = await response.text();
    for (const prefix of ['/en', ''])
      expect(
        xml.split(
          `<loc>https://www.lumagamehub.com${prefix}/guides/${slug}</loc>`
        )
      ).toHaveLength(2);
  });
});
