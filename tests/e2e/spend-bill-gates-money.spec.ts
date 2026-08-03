import { expect, test } from './fixtures';

async function hasNoHorizontalOverflow(page: Parameters<typeof test>[0] extends never ? never : any) {
  return page.evaluate(
    () =>
      document.documentElement.scrollWidth <=
      document.documentElement.clientWidth,
  );
}

test.describe('Spend Bill Gates Money mobile upgrade flow', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('adds and removes quantities, finishes from the HUD, and opens Telegram', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/en/games/spend-bill-gates-money');

    const startButton = page.getByTestId('billionaire-start');
    await expect(startButton).toBeVisible();
    expect(await hasNoHorizontalOverflow(page)).toBe(true);

    await startButton.click();
    const quantity = page.getByTestId('quantity-private-island');
    const add = page.getByTestId('buy-private-island');
    const remove = page.getByTestId('remove-private-island');

    await expect(quantity).toHaveText('×0');
    await expect(remove).toBeDisabled();

    await add.click();
    await add.click();
    await expect(quantity).toHaveText('×2');
    await expect(page.getByTestId('billionaire-hud')).toContainText('$99.7B');

    await remove.click();
    await expect(quantity).toHaveText('×1');
    await expect(page.getByTestId('billionaire-hud')).toContainText('$99.8B');

    await remove.click();
    await expect(quantity).toHaveText('×0');
    await expect(remove).toBeDisabled();
    await expect(page.getByTestId('billionaire-hud')).toContainText('$100B');
    await expect(page.getByText('0 items', { exact: true })).toBeVisible();

    await page.getByTestId('buy-golden-toilet').click();
    await page.getByTestId('billionaire-hud-finish').click();
    await expect(
      page.getByText('YOUR BILLIONAIRE IDENTITY', { exact: true }),
    ).toBeVisible();
    await expect(page.getByText('Chaos Billionaire', { exact: true })).toBeVisible();

    await page.evaluate(() => {
      const testWindow = window as typeof window & {
        __billionaireOpenedShare?: {
          url: string;
          target: string;
          features: string;
        };
      };
      window.open = ((url?: string | URL, target?: string, features?: string) => {
        testWindow.__billionaireOpenedShare = {
          url: String(url ?? ''),
          target: target ?? '',
          features: features ?? '',
        };
        return null;
      }) as typeof window.open;
    });

    await page.getByTestId('billionaire-share').click();
    const dialog = page.getByTestId('billionaire-share-dialog');
    await expect(dialog).toBeVisible();

    const channelOrder = await dialog
      .locator('[data-testid^="share-channel-"]')
      .evaluateAll((elements) =>
        elements.map((element) => element.getAttribute('data-testid')),
      );
    expect(channelOrder.slice(0, 4)).toEqual([
      'share-channel-x',
      'share-channel-telegram',
      'share-channel-whatsapp',
      'share-channel-facebook',
    ]);

    await page.getByTestId('share-channel-telegram').click();
    const opened = await page.evaluate(
      () =>
        (window as typeof window & {
          __billionaireOpenedShare?: {
            url: string;
            target: string;
            features: string;
          };
        }).__billionaireOpenedShare,
    );
    expect(opened?.target).toBe('_blank');
    expect(opened?.features).toBe('noopener,noreferrer');
    const telegramUrl = new URL(opened?.url ?? 'https://invalid.example');
    expect(telegramUrl.origin + telegramUrl.pathname).toBe(
      'https://t.me/share/url',
    );
    expect(telegramUrl.searchParams.get('url')).toContain(
      '/en/games/spend-bill-gates-money',
    );
    expect(telegramUrl.searchParams.get('text')).toContain('Chaos Billionaire');

    expect(await hasNoHorizontalOverflow(page)).toBe(true);
  });
});

test.describe('Spend Bill Gates Money desktop upgrade flow', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('keeps the HUD below the Header and provides China-focused sharing', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/en/games/spend-bill-gates-money');
    await page.getByTestId('billionaire-start').click();
    await page.getByTestId('buy-private-jet').click();
    await page.getByTestId('buy-moon-crater').scrollIntoViewIfNeeded();

    const headerBox = await page.locator('header').first().boundingBox();
    const hudBox = await page.getByTestId('billionaire-hud').boundingBox();
    expect(headerBox).not.toBeNull();
    expect(hudBox).not.toBeNull();
    expect(hudBox?.y ?? 0).toBeGreaterThanOrEqual(
      (headerBox?.y ?? 0) + (headerBox?.height ?? 0) - 1,
    );
    expect(hudBox?.y ?? 0).toBeLessThanOrEqual(
      (headerBox?.y ?? 0) + (headerBox?.height ?? 0) + 2,
    );

    await page.getByTestId('billionaire-hud-finish').click();
    await page.getByTestId('billionaire-share').click();
    const englishDialog = page.getByTestId('billionaire-share-dialog');
    await expect(englishDialog).toBeVisible();
    const dialogBox = await englishDialog.boundingBox();
    expect(dialogBox?.width ?? 1280).toBeLessThan(800);
    expect(dialogBox?.x ?? 0).toBeGreaterThan(0);
    await page.getByTestId('billionaire-share-close').click();

    await page.goto('/games/spend-bill-gates-money');
    await page.getByTestId('billionaire-start').click();
    await page.getByTestId('buy-private-jet').click();
    await page.getByTestId('billionaire-hud-finish').click();

    await page.evaluate(() => {
      const testWindow = window as typeof window & {
        __billionaireWechatCopied?: string;
      };
      Object.defineProperty(navigator, 'share', {
        configurable: true,
        value: undefined,
      });
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (value: string) => {
            testWindow.__billionaireWechatCopied = value;
          },
        },
      });
    });

    await page.getByTestId('billionaire-share').click();
    const chineseDialog = page.getByTestId('billionaire-share-dialog');
    await expect(chineseDialog).toBeVisible();
    const chineseOrder = await chineseDialog
      .locator('[data-testid^="share-channel-"]')
      .evaluateAll((elements) =>
        elements.map((element) => element.getAttribute('data-testid')),
      );
    expect(chineseOrder.slice(0, 5)).toEqual([
      'share-channel-wechat',
      'share-channel-weibo',
      'share-channel-qq',
      'share-channel-telegram',
      'share-channel-x',
    ]);

    await page.getByTestId('share-channel-wechat').click();
    await expect(
      page.getByText('结果和链接已复制。请打开微信，粘贴后发送给好友或群聊。', {
        exact: true,
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () =>
          (window as typeof window & {
            __billionaireWechatCopied?: string;
          }).__billionaireWechatCopied,
      ),
    ).toContain('/games/spend-bill-gates-money');
  });
});
