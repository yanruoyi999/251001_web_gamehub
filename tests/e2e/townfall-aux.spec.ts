import { test, expect } from './fixtures';

for (const [prefix, label] of [['/en', 'Show hint'], ['', '层提示']]) {
  test('Townfall AUX method and original practice ' + (prefix || 'zh'), async ({ page }) => {
    const path = prefix + '/guides/silent-hill-townfall-aux-valve-puzzle';
    await page.goto(prefix + '/guides/0h-h1-binary-puzzle-guide');
    await page.locator('a[href="' + path + '"]').first().click();
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://www.lumagamehub.com' + path);
    const box = page.getByRole('region', { name: /Valve hints and practice|阀门提示与练习/ });
    await box.getByRole('button', { name: new RegExp(label) }).click();
    await box.getByRole('button', { name: new RegExp(label) }).click();
    await expect(box.getByRole('button', { name: new RegExp(label) })).toHaveCount(0);
    await box.getByRole('button', { name: /^C ·/ }).click();
    await expect(box.getByRole('status')).toContainText(/mismatch|还没对上/);
    await box.getByRole('button', { name: /^B ·/ }).click();
    await expect(box.getByRole('status')).toContainText(/Correct|答对/);
    await expect(box.getByRole('button', { name: /^B ·/ })).toBeDisabled();
  });
}
