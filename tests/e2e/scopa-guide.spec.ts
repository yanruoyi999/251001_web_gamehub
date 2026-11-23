import { expect, test } from './fixtures';

const slug = 'scopa-card-game-rules';

for (const prefix of ['/en', '']) {
  const zh = prefix === '';

  test(`${zh ? 'zh' : 'en'} Scopa guide reveals both scoring cases and measures completion`, async ({ page }) => {
    const interactions: string[] = [];
    await page.exposeFunction('captureScopaEvent', (event: string) => interactions.push(event));
    await page.addInitScript(() => {
      const target = window as typeof window & {
        captureScopaEvent: (event: string) => Promise<void>;
        clarity?: (...args: unknown[]) => void;
      };
      target.clarity = (command, name) => {
        if (command === 'event') void target.captureScopaEvent(String(name));
      };
    });
    const view = page.viewportSize();
    if (view && view.width > 390) await page.setViewportSize({ width: 390, height: 844 });

    const url = `${prefix}/guides/${slug}`;
    await page.goto(`${prefix}/guides`, { waitUntil: 'load' });
    const entry = page.locator(`a[href="${url}"][data-guide-intent-action="open_from_guides"]`);
    await expect(entry).toHaveCount(1);
    await page.evaluate(() => { document.body.dataset.scopaNavigationProbe = 'ready'; });
    if (zh) await entry.click();
    else await entry.press('Enter');
    await expect(page).toHaveURL(new RegExp(`${url}$`));
    await expect(page.locator('body')).toHaveAttribute('data-scopa-navigation-probe', 'ready');
    await expect(page.getByRole('heading', { level: 1, name: zh ? 'Scopa 纸牌规则与计分' : 'Scopa Card Game Rules and Scoring' })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex.*follow/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`^https?://[^/]+${url}$`));
    await expect(page.locator(`link[hreflang="${zh ? 'en-US' : 'zh-CN'}"]`)).toHaveAttribute('href',
      new RegExp(`^https?://[^/]+${zh ? '/en' : ''}/guides/${slug}$`));
    await expect(page.locator('main a[href="https://www.pagat.com/fishing/scopa.html"]').first()).toBeAttached();

    const practice = page.locator('#scopa-practice');
    const first = practice.locator('form').first();
    const button = zh ? '核对分数' : 'Check scores';
    await expect(practice.locator('form')).toHaveCount(1);
    await expect(first.getByRole('status')).toHaveText('');
    await first.getByRole('button', { name: button }).click();
    await expect(first.getByRole('status')).toHaveText(zh ? '请选择一组分数。' : 'Choose a pair of scores.');
    await expect(practice.locator('form')).toHaveCount(1);
    await expect.poll(() => interactions.filter(name => name === 'guide_intent_click').length).toBe(1);

    await first.getByRole('radio', { name: zh ? 'A 1, B 4' : 'A 2, B 3' }).press('Space');
    await first.getByRole('button', { name: button }).press('Enter');
    await expect(first.getByRole('status')).toContainText(zh ? '正确。 A 1, B 4' : 'Check the breakdown. A 1, B 4');
    await expect(first.getByRole('status')).toContainText(zh ? '缺少一门花色，无资格。' : 'Missing a suit, so ineligible.');
    await expect(first.getByRole('status')).toContainText('18 + 21 + 18 + 21 = 78');
    await expect(first.getByRole('button', { name: button })).toBeDisabled();
    await expect.poll(() => interactions.filter(name => name === 'guide_intent_click').length).toBe(2);

    const second = practice.locator('form').last();
    await expect(practice.locator('form')).toHaveCount(2);
    await expect(second.getByRole('status')).toHaveText('');
    await second.getByRole('radio', { name: zh ? 'A 1, B 5' : 'A 0, B 5' }).press('Space');
    await second.getByRole('button', { name: button }).press('Enter');
    await expect(second.getByRole('status')).toContainText(zh ? '再核对各项。 A 0, B 5' : 'Correct. A 0, B 5');
    await expect(second.getByRole('status')).toContainText('14 + 21 + 21 + 18 = 74');
    await expect(second.getByRole('status')).toContainText('21 + 16 + 16 + 21 = 74');
    await expect(second.getByRole('status')).toContainText(zh ? '双方都不得分' : 'neither player a point');
    await expect(second.getByRole('button', { name: button })).toBeDisabled();
    await expect.poll(() => interactions.filter(name => name === 'guide_intent_click').length).toBe(4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  });
}

test('Scopa stays out of the sitemap', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBeTruthy();
  expect(await response.text()).not.toContain(slug);
});
