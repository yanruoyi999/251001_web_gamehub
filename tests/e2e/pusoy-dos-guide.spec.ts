import { expect, test } from './fixtures';

const slug = 'pusoy-dos-rules';

for (const prefix of ['', '/en']) {
  const zh = prefix === '';
  test(`Pusoy Dos: ${zh ? 'zh' : 'en'} answers, full deal and measured guide entry`, async ({ page }) => {
    const events: string[] = [];
    await page.exposeFunction('capturePusoyIntent', (name: string) => events.push(name));
    await page.addInitScript(() => {
      const target = window as typeof window & {
        clarity?: (...args: string[]) => void;
        capturePusoyIntent: (name: string) => Promise<void>;
      };
      target.clarity = (cmd, name) => { if (cmd === 'event') void target.capturePusoyIntent(String(name)); };
    });
    const path = prefix + '/guides/' + slug;
    await page.goto(prefix + '/guides');
    const entry = page.locator(`a[href="${path}"][data-guide-intent-action="open_from_guides"]`);
    await expect(entry).toHaveCount(1);
    await entry.click();
    await expect(page).toHaveURL(new RegExp(path + '$'), { timeout: 20000 });
    await expect(page.getByRole('heading', { level: 1, name: zh ? 'Pusoy Dos 菲律宾大老二四人规则' : 'Pusoy Dos Rules for Four Players' })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex.*follow/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(path + '$'));
    const practice = page.locator('#pusoy-practice');
    const nextAnswer = practice.getByRole('button', { name: zh ? 'A 领出这对 9 获胜' : 'A leads the pair and wins' });
    await expect(nextAnswer).toHaveCount(0);
    const first = practice.getByRole('button', { name: zh ? '出 2♦' : 'Pass', exact: true });
    await first.click();
    await expect(first).toBeDisabled();
    await expect(practice.getByRole('status').first()).toContainText(zh ? 'C 只能过' : 'C must pass');
    await nextAnswer.press('Enter');
    await expect(practice.getByRole('status').last()).toContainText(zh ? '两张 9 一起出完' : 'Playing both nines');
    const sheet = practice.locator('a[download]');
    await expect(sheet).toHaveAttribute('href', '/printables/pusoy-dos-seat-slips.html');
    const sheetResponse = await page.request.get('/printables/pusoy-dos-seat-slips.html');
    expect(sheetResponse.ok()).toBe(true);
    expect(await sheetResponse.text()).toContain('Four seat slips');
    const summaries = practice.locator('summary');
    await summaries.first().click();
    await summaries.last().click();
    await expect(practice.locator('ol li')).toHaveCount(9);
    await expect(practice.locator('ol li').last()).toHaveText('A Q♠');
    await summaries.first().click();
    await summaries.first().click();
    await expect.poll(() => events.filter(name => name === 'guide_intent_click').length).toBe(5);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  });
}
