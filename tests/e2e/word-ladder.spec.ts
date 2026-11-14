import { expect, test } from './fixtures';

for (const locale of ['en', 'zh'] as const) {
  test(`word ladder completes and replays in ${locale}`, async ({ page }) => {
    const prefix = locale === 'en' ? '/en' : '';
    const events: string[] = [];
    await page.exposeFunction('captureLadderEvent', (name: string) => { events.push(name); });
    await page.addInitScript(() => {
      const target = window as typeof window & {
        captureLadderEvent: (name: string) => Promise<void>;
        clarity?: (...args: unknown[]) => void;
      };
      target.clarity = (command, name) => {
        if (command === 'event' && String(name).startsWith('word_ladder_')) {
          void target.captureLadderEvent(String(name));
        }
      };
    });
    await page.goto(`${prefix}/guides/word-chain-game-examples`);
    await page.getByRole('link', { name: /Play Word Ladder|玩英文单词字梯/ }).click();
    await expect(page).toHaveURL(new RegExp(`${prefix}/games/word-ladder$`));
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.lumagamehub.com${prefix}/games/word-ladder`, { timeout: 20_000 });
    await expect(page.locator('link[hreflang="en-US"]')).toHaveAttribute('href', 'https://www.lumagamehub.com/en/games/word-ladder');
    await expect(page.locator('link[hreflang="zh-CN"]')).toHaveAttribute('href', 'https://www.lumagamehub.com/games/word-ladder');

    const game = page.getByRole('region', { name: /Word Ladder puzzle|英文单词字梯游戏/ });
    const input = game.getByRole('textbox');
    await input.fill('warm');
    await game.getByRole('button', { name: /Add word|加入单词/ }).click();
    await expect(game.getByRole('status')).toContainText(/exactly one letter|只替换一个字母/);
    await game.getByRole('button', { name: /Hint|提示/ }).click();
    await expect(game.getByRole('status')).toContainText(/CORD/);
    for (const word of ['cord', 'card', 'ward', 'warm']) {
      await input.fill(word);
      await input.press('Enter');
    }
    await expect(game.getByRole('status')).toContainText(/Ladder completed|字梯完成/);
    await expect(input).toBeDisabled();
    await expect.poll(() => [...events]).toEqual(['word_ladder_started', 'word_ladder_completed']);
    await game.getByRole('button', { name: /Undo|撤销/ }).click();
    await input.fill('warm');
    await input.press('Enter');
    await expect(input).toBeDisabled();
    await game.getByRole('button', { name: /Next puzzle|下一题/ }).click();
    await expect(input).toBeEnabled();
    await expect(game).toContainText(/Puzzle 2\/16|挑战 2\/16/);
    await input.fill('heal');
    await game.getByRole('button', { name: /Add word|加入单词/ }).click();
    await expect(game).toContainText(/HEAL/i);
    await game.getByRole('button', { name: /Undo|撤销/ }).click();
    await expect(game.getByRole('listitem')).toHaveCount(1);
    await expect.poll(() => [...events]).toEqual([
      'word_ladder_started', 'word_ladder_completed', 'word_ladder_started', 'word_ladder_replay',
    ]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      page.viewportSize()!.width,
    );
  });
}

test('word ladder routes stay out of the experiment sitemap', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBe(true);
  expect(await response.text()).not.toContain('/games/word-ladder');
});
