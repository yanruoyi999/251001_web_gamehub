import { expect, type Locator } from '@playwright/test';

export async function selectSolitaireCardAndMoveToFoundation(
  card: Locator,
  foundation: Locator,
  expectedRank: number,
  clickSelection: () => Promise<void>,
  clickDestination: () => Promise<void>
): Promise<void> {
  await clickSelection();
  await expect(card).toHaveAttribute('aria-pressed', 'true');
  await clickDestination();
  await expect(
    foundation.getByText(`${expectedRank}/13`, { exact: true })
  ).toBeVisible();
}
