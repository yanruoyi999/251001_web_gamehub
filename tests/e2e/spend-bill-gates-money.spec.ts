import { expect, test } from './fixtures';

test.describe('Spend Bill Gates Money mobile flow', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('starts, buys each feedback tier, finishes, and restarts without overflow', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/en/games/spend-bill-gates-money');

    const startButton = page.getByTestId('billionaire-start');
    await expect(startButton).toBeVisible();
    await expect(page.getByText('$100,000,000,000', { exact: true })).toBeVisible();

    const hasNoHorizontalOverflow = async () =>
      page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      );

    expect(await hasNoHorizontalOverflow()).toBe(true);

    await startButton.click();
    await expect(page.getByTestId('buy-private-jet')).toBeVisible();

    await page.getByTestId('buy-private-jet').click();
    const normalToast = page.getByText(/Private Jet Purchased/);
    await expect(normalToast).toBeVisible();

    const toastBox = await normalToast.locator('..').boundingBox();
    expect(toastBox?.y ?? 0).toBeGreaterThanOrEqual(124);

    await page.getByTestId('buy-nba-team').click();
    await expect(page.getByText('YOU JUST BOUGHT', { exact: true })).toBeVisible();

    await page.waitForTimeout(1_600);
    await page.getByTestId('buy-golden-toilet').click();
    await expect(
      page.getByText('A $1 MILLION TOILET? Respectfully... why?', {
        exact: true,
      }),
    ).toBeVisible();

    await page.getByTestId('billionaire-finish').click();
    await expect(
      page.getByText('YOUR BILLIONAIRE IDENTITY', { exact: true }),
    ).toBeVisible();
    await expect(page.getByText('Chaos Billionaire', { exact: true })).toBeVisible();

    const shareButton = page.getByTestId('billionaire-share');
    await expect(shareButton).toBeVisible();

    await page.evaluate(() => {
      const testWindow = window as typeof window & {
        __billionaireClipboardCalled?: boolean;
      };
      testWindow.__billionaireClipboardCalled = false;

      Object.defineProperty(navigator, 'share', {
        configurable: true,
        value: async () => {
          throw new DOMException('Share canceled', 'AbortError');
        },
      });
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async () => {
            testWindow.__billionaireClipboardCalled = true;
          },
        },
      });
    });

    await shareButton.click();
    expect(
      await page.evaluate(
        () =>
          (window as typeof window & {
            __billionaireClipboardCalled?: boolean;
          }).__billionaireClipboardCalled,
      ),
    ).toBe(false);
    await expect(page.getByText('Result copied. Paste it anywhere to share.')).toHaveCount(0);
    await expect(page.locator('#billionaire-share-fallback')).toHaveCount(0);

    expect(await hasNoHorizontalOverflow()).toBe(true);

    await page.getByTestId('billionaire-restart').click();
    await expect(startButton).toBeVisible();
    await expect(page.getByTestId('buy-private-jet')).toHaveCount(0);
  });
});
