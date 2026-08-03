import { expect, test } from './fixtures';

test.describe('Spend Bill Gates Money mobile flow', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('starts, buys each feedback tier, finishes, and restarts without overflow', async ({
    page,
  }) => {
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
    await expect(page.getByText(/Private Jet Purchased/)).toBeVisible();

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
    await expect(page.getByTestId('billionaire-share')).toBeVisible();

    expect(await hasNoHorizontalOverflow()).toBe(true);

    await page.getByTestId('billionaire-restart').click();
    await expect(startButton).toBeVisible();
    await expect(page.getByTestId('buy-private-jet')).toHaveCount(0);
  });
});
