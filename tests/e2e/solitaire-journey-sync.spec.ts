import { expect, test } from './fixtures';
import { selectSolitaireCardAndMoveToFoundation } from './helpers/solitaire-journey-actions';

test('foundation move waits for visible selection and delayed destination acknowledgement', async ({
  page,
}) => {
  await page.setContent(`
    <main data-daily-solitaire>
      <button id="card" aria-label="Select 3 of clubs from waste" aria-pressed="false">3 clubs</button>
      <button id="foundation" aria-label="Clubs foundation"><span>Empty</span></button>
    </main>
    <script>
      const card = document.getElementById('card');
      const foundation = document.getElementById('foundation');
      card.addEventListener('click', () => {
        setTimeout(() => card.setAttribute('aria-pressed', 'true'), 200);
      });
      foundation.addEventListener('click', () => {
        if (card.getAttribute('aria-pressed') !== 'true') return;
        setTimeout(() => {
          foundation.querySelector('span').textContent = '3/13';
          card.setAttribute('aria-pressed', 'false');
        }, 200);
      });
    </script>
  `);
  const game = page.locator('[data-daily-solitaire]');
  const card = game.getByRole('button', {
    name: 'Select 3 of clubs from waste',
    exact: true,
  });
  const foundation = game.getByRole('button', {
    name: 'Clubs foundation',
    exact: true,
  });

  await selectSolitaireCardAndMoveToFoundation(
    card,
    foundation,
    3,
    () => card.click(),
    () => foundation.click()
  );

  // Immediate reads prove the helper returned after both asynchronous commits.
  expect(await foundation.getByText('3/13', { exact: true }).isVisible()).toBe(
    true
  );
  expect(await card.getAttribute('aria-pressed')).toBe('false');
});

test('foundation move rejects a no-op destination instead of advancing the journey', async ({
  page,
}) => {
  await page.setContent(`
    <main data-daily-solitaire>
      <button id="card" aria-label="A of spades" aria-pressed="false">A spades</button>
      <button id="foundation" aria-label="Spades foundation" data-clicks="0"><span>Empty</span></button>
    </main>
    <script>
      const card = document.getElementById('card');
      const foundation = document.getElementById('foundation');
      card.addEventListener('click', () => card.setAttribute('aria-pressed', 'true'));
      foundation.addEventListener('click', () => {
        foundation.dataset.clicks = String(Number(foundation.dataset.clicks) + 1);
      });
    </script>
  `);
  const game = page.locator('[data-daily-solitaire]');
  const card = game.getByRole('button', { name: 'A of spades', exact: true });
  const foundation = game.getByRole('button', {
    name: 'Spades foundation',
    exact: true,
  });

  await expect(
    selectSolitaireCardAndMoveToFoundation(
      card,
      foundation,
      1,
      () => card.click(),
      () => foundation.click()
    )
  ).rejects.toThrow();

  await expect(card).toHaveAttribute('aria-pressed', 'true');
  await expect(foundation).toHaveAttribute('data-clicks', '1');
  await expect(foundation.getByText('Empty', { exact: true })).toBeVisible();
});
