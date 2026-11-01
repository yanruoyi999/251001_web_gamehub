import { expect, test } from './fixtures';

for (const prefix of ['/en', '']) {
  for (const slug of ['word-chain-game-examples', 'three-player-spades']) {
    test(`${prefix || 'zh'} ${slug}: entry activation reports once and keeps its destination`, async ({ page }, info) => {
      const events: string[] = [];
      await page.exposeFunction('captureEntryEvent', (name: string) => { events.push(name); });
      await page.addInitScript(() => {
        const target = window as typeof window & {
          captureEntryEvent: (name: string) => Promise<void>;
          clarity?: (...args: unknown[]) => void;
        };
        target.clarity = (command, name) => {
          if (command === 'event') void target.captureEntryEvent(String(name));
        };
      });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${prefix}/guides/${slug}`, { waitUntil: 'load' });
      expect(events.filter(name => name === 'guide_intent_click')).toHaveLength(0);

      const read = page.locator('[data-guide-intent-action="read_guide"]');
      await read.focus();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(new RegExp(`/guides/${slug}#guide-details$`));
      await expect.poll(() => events.filter(name => name === 'guide_intent_click').length).toBe(1);

      if (slug === 'word-chain-game-examples') {
        const practice = page.locator('[data-guide-intent-action="practice_entry"]');
        await expect(practice).toHaveAttribute('href', '#word-chain-practice');
        await practice.click();
        await expect(page).toHaveURL(/#word-chain-practice$/);
        await expect(page.locator('#word-chain-practice details')).toHaveCount(8);
        await expect.poll(() => events.filter(name => name === 'guide_intent_click').length).toBe(2);
      } else {
        await expect(page.locator('[data-guide-intent-action="practice_entry"]')).toHaveCount(0);
        await expect(page.locator('main')).toContainText(prefix ? 'not a playable three-person online room' : '不是在线三人联机牌桌');
      }

      const browse = page.locator('[data-guide-intent-action="browse_games"]');
      await expect(browse).toHaveAttribute('href', `${prefix}/games`);
      await browse.scrollIntoViewIfNeeded();
      await page.screenshot({ path: info.outputPath(`${slug}-${prefix ? 'en' : 'zh'}-entry.png`) });
      await browse.focus();
      await page.keyboard.press('Enter');
      await expect.poll(() => new URL(page.url()).pathname).toBe(`${prefix}/games`);
      await expect.poll(() => events.filter(name => name === 'guide_intent_click').length).toBe(slug === 'word-chain-game-examples' ? 3 : 2);
    });
  }
}

test('other guides keep their unmeasured directory CTA', async ({ page }) => {
  await page.goto('/en/guides/categories-game-topics', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-guide-intent-action="browse_games"]')).toHaveCount(0);
  await expect(page.locator('main a[href="/en/games"]')).toHaveCount(1);
});

test.describe('guide entries without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  for (const prefix of ['/en', '']) {
    for (const slug of ['word-chain-game-examples', 'three-player-spades']) {
      test(`${prefix || 'zh'} ${slug}: native keyboard entries and answer reveal remain usable`, async ({ page }) => {
        await page.goto(`${prefix}/guides/${slug}`, { waitUntil: 'domcontentloaded' });
        if (slug === 'word-chain-game-examples') {
          const practice = page.locator('[data-guide-intent-action="practice_entry"]');
          await expect(practice).toHaveAttribute('href', '#word-chain-practice');
          await practice.focus();
          await expect(practice).toBeFocused();
          await page.keyboard.press('Enter');
          await expect(page).toHaveURL(/#word-chain-practice$/);
          const answer = page.locator('#word-chain-practice details').first();
          const summary = answer.locator('summary');
          await summary.focus();
          await expect(summary).toBeFocused();
          await page.keyboard.press('Enter');
          await expect(answer).toHaveAttribute('open', '');
          await expect(answer.locator('p')).toBeVisible();
        }
        const browse = page.locator('[data-guide-intent-action="browse_games"]');
        await expect(browse).toHaveAttribute('href', `${prefix}/games`);
        await browse.focus();
        await expect(browse).toBeFocused();
        await page.keyboard.press('Enter');
        await expect.poll(() => new URL(page.url()).pathname).toBe(`${prefix}/games`);
      });
    }
  }
});
