import { expect, test } from './fixtures';

const COLLECTION_PATH = '/en/games/2-player-unblocked';

test.describe('2 Player Unblocked collection', () => {
  test('loads one self-hosted runtime only after Play and unloads it on game switch', async ({ page }) => {
    const response = await page.goto(COLLECTION_PATH);

    expect(response?.ok()).toBe(true);
    await expect(page.getByRole('heading', { level: 1, name: '2 Player Unblocked Games' })).toBeVisible();
    await expect(page.locator('iframe[data-two-player-runtime]')).toHaveCount(0);

    await page.locator('[data-two-player-start]').click();
    const pongFrame = page.locator('iframe[data-two-player-runtime="classic-pong-duel"]');
    await expect(pongFrame).toHaveCount(1);
    await expect(page.locator('iframe[data-two-player-runtime]')).toHaveCount(1);
    await expect(page.getByText('Game loaded. Click the game area, then use the keyboard controls.')).toBeVisible();

    await page.locator('[data-game-selector="key-sprint-duel"]').click();
    await expect(page.locator('iframe[data-two-player-runtime]')).toHaveCount(0);

    await page.locator('[data-two-player-start]').click();
    await expect(page.locator('iframe[data-two-player-runtime="key-sprint-duel"]')).toHaveCount(1);
    await expect(page.locator('iframe[data-two-player-runtime]')).toHaveCount(1);
  });

  test('classic pong accepts both player key sets during the same interval', async ({ page }) => {
    await page.goto(COLLECTION_PATH);
    await page.locator('[data-two-player-start]').click();
    await expect(page.getByText('Game loaded. Click the game area, then use the keyboard controls.')).toBeVisible();

    const frame = page.frameLocator('iframe[data-two-player-runtime="classic-pong-duel"]');
    const board = frame.locator('#board');
    const paddleOne = frame.locator('#paddle-one');
    const paddleTwo = frame.locator('#paddle-two');

    // Match the real user flow. WebKit only routes subsequent hardware-keyboard
    // input into a sandboxed iframe after a user activation inside that frame.
    await board.click();
    await page.keyboard.press('Enter');
    await expect(paddleOne).toHaveAttribute('style', /top:/);
    await expect(paddleTwo).toHaveAttribute('style', /top:/);

    const beforeOne = await paddleOne.getAttribute('style');
    const beforeTwo = await paddleTwo.getAttribute('style');

    await page.keyboard.down('w');
    await page.keyboard.down('ArrowDown');
    try {
      await expect.poll(async () => {
        const [afterOne, afterTwo] = await Promise.all([
          paddleOne.getAttribute('style'),
          paddleTwo.getAttribute('style'),
        ]);
        return afterOne !== beforeOne && afterTwo !== beforeTwo;
      }).toBe(true);
    } finally {
      await page.keyboard.up('ArrowDown');
      await page.keyboard.up('w');
    }
  });

  test('fullscreen control is reversible and mobile limitation is explicit', async ({ page }) => {
    await page.goto(COLLECTION_PATH);

    await expect(
      page.getByText('Browse on mobile; this game requires a physical keyboard'),
    ).toBeVisible();

    const fullscreenButton = page.locator('[data-two-player-fullscreen]');
    await expect(fullscreenButton).toHaveAttribute('aria-pressed', 'false');
    await fullscreenButton.click();
    await expect(fullscreenButton).toHaveAttribute('aria-pressed', 'true');
    await fullscreenButton.click();
    await expect(fullscreenButton).toHaveAttribute('aria-pressed', 'false');
  });
});
