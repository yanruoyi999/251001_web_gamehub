import { expect, test } from './fixtures';

test('Crazy Eights pilot works in both languages with trackable links and a printable sheet', async ({ page }) => {
  const events: string[] = [];
  await page.exposeFunction('captureGuideEvent', (name: string) => { events.push(name); });
  await page.addInitScript(() => {
    const target = window as typeof window & {
      captureGuideEvent: (name: string) => Promise<void>;
      clarity?: (...args: unknown[]) => void;
    };
    target.clarity = (command, name) => {
      if (command === 'event') void target.captureGuideEvent(String(name));
    };
    window.print = () => { document.documentElement.dataset.printRequested = 'true'; };
  });

  for (const locale of ['en', 'zh']) {
    const prefix = locale === 'en' ? '/en' : '';
    const path = `${prefix}/guides/crazy-eights-rules`;
    const before = events.filter(name => name === 'guide_intent_view').length;
    await page.goto(`${prefix}/guides/gin-rummy-rules`);
    const inbound = page.locator('[data-guide-intent-action="open_crazy_eights_rules"]');
    await expect(inbound).toHaveAttribute('href', path);
    await inbound.click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.lumagamehub.com${path}`);
    await expect.poll(() => events.filter(name => name === 'guide_intent_view').length).toBe(before + 1);

    const sheet = page.locator('[data-crazy-eights-print]');
    const example = sheet.locator('details');
    await example.locator('summary').click();
    await expect(example).toHaveAttribute('open', '');
    await sheet.getByRole('button').click();
    await expect(page.locator('html')).toHaveAttribute('data-print-requested', 'true');
    await expect(page.locator('[data-guide-intent-action="read_related_guide"]')).toHaveCount(3);
    await page.emulateMedia({ media: 'print' });
    await expect(sheet).toBeVisible();
    await expect(example).toBeHidden();
    await page.emulateMedia({ media: 'screen' });
  }
});
