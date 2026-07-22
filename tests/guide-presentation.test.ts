import { readFile } from 'node:fs/promises';

import { describe, expect, it } from 'vitest';

import { getGuidePresentation } from '@/lib/guide-presentation';
import { getSeoLandingPage } from '@/lib/seo-landing-content';

const guidePageSource = await readFile(
  new URL('../app/[locale]/guides/[slug]/page.tsx', import.meta.url),
  'utf8',
);
const playerSource = await readFile(
  new URL('../components/game/game-player-facade.tsx', import.meta.url),
  'utf8',
);

describe('guide presentation', () => {
  it('uses the first section as the quick answer without repeating it in guide details', () => {
    const page = getSeoLandingPage('google-snake-mods');
    const content = page?.locales.en;

    expect(content).toBeDefined();

    const presentation = getGuidePresentation(content!);

    expect(presentation.quickAnswer.title).toBe(content!.sections[0].title);
    expect(presentation.detailSections).toEqual(content!.sections.slice(1));
    expect(presentation.detailSections).not.toContain(content!.sections[0]);
  });

  it('features the maintained mod page before offering the clearly labelled standard game', () => {
    const page = getSeoLandingPage('google-snake-mods');

    expect(page?.locales.en.quickAnswerLink).toMatchObject({
      href: 'https://googlesnakemods.com/',
      label: 'Open the maintained Google Snake Mods web version',
    });
    expect(page?.locales.zh.quickAnswerLink).toMatchObject({
      href: 'https://googlesnakemods.com/',
      label: '打开维护中的 Google Snake Mods 网页版',
    });
    expect(page?.locales.en.externalLinks?.map((link) => link.href)).not.toContain(
      'https://googlesnakemods.com/',
    );
    expect(page?.embedGame?.playLabel).toEqual({
      en: 'Play standard Snake - no mods',
      zh: '试玩标准 Snake（无模组）',
    });
    expect(guidePageSource).toContain('playLabel={page.embedGame.playLabel?.[locale]}');
    expect(playerSource).toContain('playLabel?: string;');
  });
});
