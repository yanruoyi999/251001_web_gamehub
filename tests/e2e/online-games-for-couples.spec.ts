import { expect, test } from './fixtures';

const COUPLES_PATH = '/en/games/online-games-for-couples';

test.describe('Online Games for Couples', () => {
  test('loads the original couples hub without horizontal overflow', async ({ page }) => {
    const response = await page.goto(COUPLES_PATH);

    expect(response?.ok()).toBe(true);
    await expect(page.getByRole('heading', { level: 1, name: 'Online Games for Couples' })).toBeVisible();
    await expect(page.locator('[data-couple-game]')).toHaveCount(3);
    await expect(page.locator('[data-couple-challenge-code]')).toHaveText(/^[A-Z2-9]{6}$/);

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(hasOverflow).toBe(false);
  });

  test('hides player one choice before player two answers', async ({ page }) => {
    await page.goto(COUPLES_PATH);
    await page.locator('[data-couple-game="couple-match-quiz"]').click();
    await page.locator('[data-couple-start]').click();

    await page.locator('[data-couple-choice="1-0"]').click();

    await expect(page.locator('[data-couple-choice^="1-"]')).toHaveCount(0);
    await expect(page.getByText('Choice locked. Hand the screen to the other player.')).toBeVisible();
    await expect(page.locator('[data-couple-choice="2-0"]')).toBeVisible();
  });

  test('completes the match quiz using two local players', async ({ page }) => {
    await page.goto(COUPLES_PATH);
    await page.locator('[data-couple-game="couple-match-quiz"]').click();
    await page.locator('[data-couple-start]').click();

    for (let round = 0; round < 6; round += 1) {
      await page.locator('[data-couple-choice="1-0"]').click();
      await page.locator('[data-couple-choice="2-0"]').click();
      await expect(page.locator('[data-couple-round-result]')).toBeVisible();
      await page.locator('[data-couple-next]').click();
    }

    await expect(page.locator('[data-couple-complete]')).toBeVisible();
    await expect(page.locator('[data-couple-complete]')).toContainText('Match score: 100%');
  });

  test('reuses a shared challenge code and prompt order after reload', async ({ page }) => {
    await page.goto(`${COUPLES_PATH}?challenge=DATE88`);

    await expect(page.locator('[data-couple-challenge-code]')).toHaveText('DATE88');
    await page.locator('[data-couple-start]').click();
    const firstPrompt = await page.locator('[data-couple-prompt]').textContent();
    expect(firstPrompt).toBeTruthy();

    await page.reload();
    await expect(page.locator('[data-couple-challenge-code]')).toHaveText('DATE88');
    await page.locator('[data-couple-start]').click();
    await expect(page.locator('[data-couple-prompt]')).toHaveText(firstPrompt ?? '');
  });
});
