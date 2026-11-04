import { expect, test } from './fixtures';

const slug = 'cribbage-scoring-chart';
const source = 'https://www.cribbage.org/NewSite/rules/rulebook_2025.pdf';

for (const locale of ['en', 'zh'] as const) {
  const prefix = locale === 'en' ? '/en' : '';
  const path = `${prefix}/guides/${slug}`;
  const printLabel = locale === 'en' ? 'Print scoring chart' : '打印计分速查表';

  test(`Cribbage ${locale}: registered metadata, chart placement and mobile last column`, async ({
    page,
  }, testInfo) => {
    expect(
      (await page.goto(path, { waitUntil: 'domcontentloaded' }))?.status()
    ).toBe(200);
    const chart = page.locator('article > [data-cribbage-print-root]');
    await expect(chart.getByRole('table')).toHaveCount(2);
    await expect(chart.locator('thead th[scope="col"]')).toHaveCount(7);
    await expect(chart.locator('tbody th[scope="row"]')).toHaveCount(14);
    await expect(chart.locator('caption')).toHaveCount(2);
    await expect(chart).toContainText(
      locale === 'en' ? 'Not applicable' : '不适用'
    );
    expect(
      await chart.evaluate(
        el => el.previousElementSibling?.querySelector('h2')?.textContent
      )
    ).toContain(locale === 'en' ? 'Quick answer:' : '简答：');
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
    const schemas = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).flatMap(text => JSON.parse(text));
    const article = schemas.find(item => item['@type'] === 'Article');
    expect(article.dateModified).toMatch(/^2026-11-04T/);
    expect(article).not.toHaveProperty('datePublished');
    expect(article.citation).toContain(source);
    await page.setViewportSize({ width: 390, height: 844 });
    const measurements = await page.evaluate(() => ({
      width: innerWidth,
      document: document.documentElement.scrollWidth,
    }));
    expect(measurements.width).toBe(390);
    expect(measurements.document).toBeLessThanOrEqual(391);
    for (const scroll of await chart.getByRole('region').all()) {
      await scroll.focus();
      for (let step = 0; step < 12; step += 1) {
        await page.keyboard.press('ArrowRight');
      }
      await expect
        .poll(() =>
          scroll.evaluate(
            el => el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
          )
        )
        .toBe(true);
      const last = scroll.locator('tbody tr').last().locator('td').last();
      expect(
        await last.evaluate(el => {
          const cell = el.getBoundingClientRect();
          const region = el.closest('[role="region"]')!.getBoundingClientRect();
          return cell.right <= region.right + 1 && cell.left >= region.left - 1;
        })
      ).toBe(true);
    }
    await testInfo.attach(`${locale}-390-widths`, {
      body: JSON.stringify(measurements),
      contentType: 'application/json',
    });
    await page.screenshot({
      path: testInfo.outputPath(`${locale}-390.png`),
      fullPage: true,
    });
  });

  test(`Cribbage ${locale}: keyboard print action and chart-only print media`, async ({
    page,
  }) => {
    await page.goto(path, { waitUntil: 'networkidle' });
    let printCalls = 0;
    await page.exposeFunction('recordCribbagePrint', () => {
      printCalls += 1;
    });
    await page.evaluate(() => {
      window.print = () => {
        void (
          window as unknown as { recordCribbagePrint: () => Promise<void> }
        ).recordCribbagePrint();
      };
    });
    const button = page.getByRole('button', { name: printLabel, exact: true });
    await button.click();
    await expect.poll(() => printCalls).toBe(1);
    await button.focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => printCalls).toBe(2);
    await page.emulateMedia({ media: 'print' });
    const chart = page.locator('[data-cribbage-print-root]');
    await expect(chart).toBeVisible();
    await expect(chart.getByRole('table')).toHaveCount(2);
    await expect(chart.locator('footer')).toBeVisible();
    await expect(chart.locator(`a[href="${source}"]`)).toBeVisible();
    await expect(button).toBeHidden();
    await expect(page.locator('article > header')).toBeHidden();
    await expect(page.locator('#guide-details')).toBeHidden();
    for (const hidden of await page.locator('[data-print-hide]').all())
      await expect(hidden).toBeHidden();
    expect(
      await chart
        .locator('thead')
        .first()
        .evaluate(el => getComputedStyle(el).display)
    ).toBe('table-header-group');
    expect(
      await chart
        .getByRole('region')
        .first()
        .evaluate(el => getComputedStyle(el).overflowX)
    ).toBe('visible');
    expect(
      await chart
        .locator('tbody tr')
        .first()
        .evaluate(el => getComputedStyle(el).breakInside)
    ).toBe('avoid');
    await expect(page.locator('article a[download]')).toHaveCount(0);
  });
}

test.describe('Cribbage without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('both locale charts and sources survive index and physical partner-game discovery', async ({
    page,
    request,
  }) => {
    for (const prefix of ['/en', '']) {
      const href = `${prefix}/guides/${slug}`;
      await page.goto(`${prefix}/guides`, { waitUntil: 'domcontentloaded' });
      const entry = page.locator(`main a[href="${href}"]`);
      await expect(entry).toHaveCount(1);
      await entry.click();
      await expect(page).toHaveURL(new RegExp(`${href}$`));
      await expect(
        page.locator('[data-cribbage-print-root] table')
      ).toHaveCount(2);
      await expect(
        page.locator(`[data-cribbage-print-root] a[href="${source}"]`)
      ).toBeVisible();
      await page.emulateMedia({ media: 'print' });
      await expect(
        page.locator('[data-cribbage-print-root] footer')
      ).toBeVisible();
      await expect(page.locator('article > header')).toBeHidden();
      await page.emulateMedia({ media: 'screen' });
      await page.goto(`${prefix}/games/solitaire`, {
        waitUntil: 'domcontentloaded',
      });
      const resource = page.locator(`main a[href="${href}"]`);
      await expect(resource).toHaveCount(1);
      await expect(resource).toContainText(prefix ? 'partner' : '双人');
      await resource.click();
      await expect(
        page.locator('[data-cribbage-print-root] table')
      ).toHaveCount(2);
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

test('existing Yahtzee and Popcorn keep their ordinary and PDF print behavior', async ({
  page,
}) => {
  await page.goto('/en/guides/highest-scoring-yahtzee-game', {
    waitUntil: 'domcontentloaded',
  });
  await expect(page.locator('main')).toContainText('1,575');
  await expect(
    page.locator('[data-cribbage-guide], [data-cribbage-print-root]')
  ).toHaveCount(0);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('article > header')).toBeVisible();
  await page.emulateMedia({ media: 'screen' });
  await page.goto('/en/guides/how-to-play-popcorn-game', {
    waitUntil: 'domcontentloaded',
  });
  const pdf = page.locator(
    'a[download][href="/printables/popcorn-game-rules.pdf"]'
  );
  await expect(pdf).toBeVisible();
  await page.emulateMedia({ media: 'print' });
  await expect(pdf).toBeHidden();
  await expect(page.locator('article > header')).toBeVisible();
  await expect(page.locator('main > article')).toHaveAttribute(
    'data-printable-guide',
    'true'
  );
});
