import { access, readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

const homeSource = await readFile(
  new URL('../app/[locale]/page.tsx', import.meta.url),
  'utf8',
);

const featuredScreenshots = [
  'google-snake.png',
  'ovo.png',
  'drive-mad.png',
  'solitaire.png',
];

describe('homepage curation', () => {
  it('puts real high-signal game and guide cards in the hero', () => {
    expect(homeSource).toContain('curatedEntries');
    expect(homeSource).toContain('/guides/google-snake-mods');
    expect(homeSource).toContain('/guides/ovo-walkthrough');
    expect(homeSource).toContain('/guides/drive-mad-level-tips');
    expect(homeSource).toContain('/games/solitaire');
    expect(homeSource).toContain('priority={index < 2}');
    expect(homeSource).not.toContain('<FeatureCard');
  });

  it('removes numbered SEO-facing advantage headings', () => {
    expect(homeSource).not.toContain('seoPointHeading');
    expect(homeSource).not.toContain('${seoPointHeading} ${index + 1}');
  });

  it('uses checked-in gameplay screenshots for every featured card', async () => {
    await Promise.all(
      featuredScreenshots.map((name) =>
        access(new URL(`../public/game-screenshots/${name}`, import.meta.url)),
      ),
    );
  });

  it('uses an accessible green for homepage text and primary actions', () => {
    expect(homeSource).toContain('bg-emerald-700');
    expect(homeSource).toContain('text-emerald-700 dark:text-emerald-400');
    expect(homeSource).not.toContain('bg-primary px-7');
  });
});
