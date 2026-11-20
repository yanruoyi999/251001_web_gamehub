import { expect, test } from './fixtures';

test('both event guides are linked from the localized homepage and link back', async ({
  page,
}) => {
  for (const home of ['/', '/en']) {
    const prefix = home === '/' ? '' : home;
    for (const slug of ['mandy-gta-6', 'duolingo-pokemon-go']) {
      const path = prefix + '/guides/' + slug;
      const response = await page.goto(home);
      expect(response?.status()).toBe(200);
      await page.locator('#recent-guides a[href="' + path + '"]').click();
      await expect(page).toHaveURL(new RegExp(path + '$'));
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect((await page.reload())?.status()).toBe(200);
      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute('href');
      expect(canonical && new URL(canonical).pathname).toBe(path);
      const alternate = await page
        .locator('link[hreflang="' + (prefix ? 'zh-CN' : 'en-US') + '"]')
        .getAttribute('href');
      expect(alternate && new URL(alternate).pathname).toBe(
        (prefix ? '' : '/en') + '/guides/' + slug
      );
      const robots = await page
        .locator('meta[name="robots"]')
        .evaluateAll(nodes => nodes.map(node => node.getAttribute('content')));
      expect(robots.join(' ')).not.toContain('noindex');
      await page
        .getByRole('navigation', { name: /攻略路径|Guide breadcrumb/ })
        .locator('a[href="' + home + '"]')
        .click();
      await expect(page).toHaveURL(new RegExp(home === '/' ? '/$' : '/en$'));
    }
  }
});

test('Mandy gives a source-backed answer and the event planner handles the last viable date', async ({
  page,
}) => {
  await page.goto('/en/guides/mandy-gta-6');
  await expect(
    page.getByText(/Mandy is played by Lexie Shoaibi/).first()
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Rockstar Games cast credits' }).first()
  ).toBeVisible();
  await expect(
    page.getByText(/bathroom floor across from the bedroom/).first()
  ).toBeVisible();

  await page.goto('/en/guides/duolingo-pokemon-go');
  const planner = page.locator('#pokemon-go-quest-planner');
  await planner.getByLabel('Local date').fill('2026-12-23');
  await planner.getByLabel('I already joined the quest').check();
  await planner.getByRole('button', { name: 'Check my plan' }).click();
  await expect(planner.getByRole('status')).toContainText('2026-12-29');
  await planner.getByLabel('Local date').fill('2026-12-24');
  await planner.getByRole('button', { name: 'Check my plan' }).click();
  await expect(planner.getByRole('status')).toContainText('Not enough days');
});
