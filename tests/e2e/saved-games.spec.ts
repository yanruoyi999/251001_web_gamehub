import { expect, test } from './fixtures';
import type { Page } from '@playwright/test';

async function assertNoHorizontalOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true);
}

test.describe('saved games discovery', () => {
  test('desktop exposes the saved entry and renders a saved Luma original', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'gamehub:favorites',
        JSON.stringify(['slug:spend-bill-gates-money'])
      );
    });

    await page.goto('/');
    await expect(
      page.getByRole('link', { name: '查看我的收藏' })
    ).toBeVisible();
    await page.getByRole('link', { name: '查看我的收藏' }).click();

    await expect(page).toHaveURL('/games/saved');
    await expect(
      page.getByRole('heading', { name: '我的收藏游戏' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: '花光比尔·盖茨的钱', exact: true })
    ).toBeVisible();
    await assertNoHorizontalOverflow(page);
  });

  test('mobile can remove a saved game and returns to the empty state', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'gamehub:favorites',
        JSON.stringify(['slug:spend-bill-gates-money'])
      );
    });

    await page.goto('/games/saved');
    await expect(page.getByRole('button', { name: '取消收藏' })).toBeVisible();
    await page.getByRole('button', { name: '取消收藏' }).click();

    await expect(
      page.getByRole('heading', { name: '还没有收藏游戏' })
    ).toBeVisible();
    await assertNoHorizontalOverflow(page);
  });
});
