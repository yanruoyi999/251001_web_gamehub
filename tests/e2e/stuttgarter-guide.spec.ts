import { expect, test } from './fixtures';

for (const locale of ['en', 'zh'] as const) {
  const prefix = locale === 'zh' ? '' : '/en';
  const path = prefix + '/guides/stuttgarter-meaning';

  test('Stuttgarter meaning, spoiler and first answer in ' + locale, async ({ page }) => {
    await page.goto(prefix + '/guides/word-chain-game-examples');
    await page.locator('a[href="' + path + '"]').click();
    await expect(page).toHaveURL(new RegExp(path + '$'));
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Stuttgarter');
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(path + '$'));
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'CAPSIZE', exact: true })).toBeEnabled();
    const events: string[] = [];
    await page.exposeFunction('captureGuideAction', (name: string) => events.push(name));
    await page.evaluate(() => {
      const qa = window as typeof window & { clarity?: (...args: string[]) => void; captureGuideAction: (name: string) => void };
      qa.clarity = (command, name) => { if (command === 'event') qa.captureGuideAction(name); };
    });
    const details = page.locator('details').filter({ has: page.locator('[data-nosnippet]') });
    await expect(details.locator('strong')).toBeHidden();
    await details.locator('summary').press('Enter');
    await expect(details.locator('strong')).toHaveText('GARTER');
    await details.locator('summary').press('Enter');
    await details.locator('summary').press('Enter');
    if (locale === 'en') {
      await page.getByRole('button', { name: 'CAPSIZE', exact: true }).click();
      await expect(page.getByRole('status').filter({ hasText: /Try again|再试试/ })).toBeVisible();
    }
    await page.getByRole('button', { name: 'NIGHTCAP', exact: true }).press('Enter');
    await expect(page.getByRole('status').filter({ hasText: /NIGHT \+ CAP/ })).toBeVisible();
    await page.getByRole('button', { name: 'NIGHTCAP', exact: true }).click();
    await expect.poll(() => events.filter(name => name === 'guide_intent_click').length).toBe(2);
  });
}
