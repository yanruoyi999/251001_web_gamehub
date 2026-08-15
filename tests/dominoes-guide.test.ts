import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

import sitemap from '@/app/sitemap';
import { getSeoLandingPage } from '@/lib/seo-landing-content';
import { buildAbsoluteUrl } from '@/lib/seo';

const guidePageSource = await readFile(
  new URL('../app/[locale]/guides/[slug]/page.tsx', import.meta.url),
  'utf8',
);
const componentSource = await readFile(
  new URL('../components/game/dominoes-training.tsx', import.meta.url),
  'utf8',
);

describe('Dominoes guide experiment', () => {
  it('keeps the first version noindex and source-labelled', () => {
    const page = getSeoLandingPage('how-to-play-dominoes');

    expect(page).toBeDefined();
    expect(page?.indexable).toBe(false);
    expect(page?.interactiveWidget).toBe('dominoes-training');
    expect(page?.relatedSlugs.length).toBeGreaterThanOrEqual(2);
    expect(page?.locales.en.externalLinks?.map((link) => link.href)).toContain(
      'https://www.pagat.com/domino/basics.html',
    );
  });

  it('keeps the experiment out of both localized sitemap surfaces', async () => {
    const urls = (await sitemap()).map((entry) => entry.url);

    expect(urls).not.toContain(buildAbsoluteUrl('/en/guides/how-to-play-dominoes'));
    expect(urls).not.toContain(buildAbsoluteUrl('/guides/how-to-play-dominoes'));
  });

  it('mounts the trainer and records start, move, and completion signals', () => {
    expect(guidePageSource).toContain('DominoesTraining');
    expect(guidePageSource).toContain("page.interactiveWidget === 'dominoes-training'");
    expect(componentSource).toContain("trackInteraction('domino_tutorial_start'");
    expect(componentSource).toContain("trackInteraction('domino_move_attempt'");
    expect(componentSource).toContain("trackInteraction('domino_tutorial_complete'");
  });
});
