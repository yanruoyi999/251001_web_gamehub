import { readFile } from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import sitemap from '@/app/sitemap';
import { buildAbsoluteUrl } from '@/lib/seo';
import { getSeoLandingPage } from '@/lib/seo-landing-content';

const guidePageSource = await readFile(
  new URL('../app/[locale]/guides/[slug]/page.tsx', import.meta.url),
  'utf8',
);
const aliasPageSource = await readFile(
  new URL('../app/[locale]/game/popcorn/how-to-play/page.tsx', import.meta.url),
  'utf8',
);

describe('popcorn guide', () => {
  it('covers the ambiguous popcorn intents without pretending they are one game', async () => {
    const page = getSeoLandingPage('how-to-play-popcorn-game');
    const urls = (await sitemap()).map((entry) => entry.url);

    expect(page).toBeDefined();
    expect(page?.embedGame).toBeUndefined();
    expect(page?.video?.embedUrl).toContain('youtube-nocookie.com/embed/Ot40kdLBZhk');
    expect(page?.printablePath).toBe('/printables/popcorn-game-rules.pdf');
    expect(
      fs.existsSync(path.join(process.cwd(), 'public', 'printables', 'popcorn-game-rules.pdf')),
    ).toBe(true);
    expect(page?.locales.en.sections.length).toBeGreaterThanOrEqual(7);
    expect(page?.locales.en.sections.map((section) => section.body).join(' ')).toContain(
      'There is no single universal scorecard',
    );
    expect(page?.locales.en.externalLinks?.map((link) => link.href)).toEqual(
      expect.arrayContaining([
        'https://www.playworks.org/game-library/popcorn/',
        'https://service.mattel.com/instruction_sheets/Y2852-0920.pdf',
        'https://www.dramatrunk.com/drama-game-popcorn',
      ]),
    );
    expect(urls).toContain(buildAbsoluteUrl('/en/guides/how-to-play-popcorn-game'));
    expect(urls).toContain(buildAbsoluteUrl('/guides/how-to-play-popcorn-game'));
  });

  it('exposes printable and video affordances only for content that declares them', () => {
    const popcorn = getSeoLandingPage('how-to-play-popcorn-game');
    const telemount = getSeoLandingPage('telemount-walkthrough');

    expect(popcorn?.printablePath).toBeTruthy();
    expect(popcorn?.video).toBeTruthy();
    expect(telemount?.printablePath).toBeUndefined();
    expect(telemount?.video).toBeUndefined();
    expect(guidePageSource).toContain('data-printable-guide');
    expect(guidePageSource).toContain('page.video.embedUrl');
  });

  it('keeps the requested /game/popcorn/how-to-play path as a canonical redirect', () => {
    expect(aliasPageSource).toContain("'/guides/how-to-play-popcorn-game'");
    expect(aliasPageSource).toContain('permanentRedirect');
  });
});
