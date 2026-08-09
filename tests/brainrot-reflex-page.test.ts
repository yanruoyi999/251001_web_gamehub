import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import sitemap from '@/app/sitemap';
import { generateMetadata } from '@/app/[locale]/games/steal-a-brainrot-unblocked/page';
import { BRAINROT_REFLEX_PATH } from '@/lib/games/brainrot-reflex-seo';
import { buildAbsoluteUrl } from '@/lib/seo';

const routePath = path.join(
  process.cwd(),
  'app/[locale]/games/steal-a-brainrot-unblocked/page.tsx'
);
const componentPath = path.join(
  process.cwd(),
  'components/game/brainrot-reflex-game.tsx'
);

describe('Brainrot reflex experiment', () => {
  it('publishes transparent metadata and the official source boundary', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'en' }),
    });
    const source = readFileSync(routePath, 'utf8');

    expect(metadata.title).toContain('Steal a Brainrot Unblocked?');
    expect(metadata.alternates?.canonical).toBe(`/en${BRAINROT_REFLEX_PATH}`);
    expect(source).toContain(
      'https://www.roblox.com/games/109983668079237/Steal-a-Brainrot'
    );
    expect(source).toContain('does not host a Roblox copy');
    expect(source).toContain("'@type': 'FAQPage'");
    expect(source).toContain("'@type': 'VideoGame'");
  });

  it('adds both localized URLs to the sitemap without an iframe dependency', async () => {
    const urls = (await sitemap()).map(entry => entry.url);
    const component = readFileSync(componentPath, 'utf8');

    expect(urls).toContain(buildAbsoluteUrl(`/en${BRAINROT_REFLEX_PATH}`));
    expect(urls).toContain(buildAbsoluteUrl(BRAINROT_REFLEX_PATH));
    expect(component).toContain(
      "trackInteraction('brainrot_reflex_game_started'"
    );
    expect(component).toContain(
      "trackInteraction('brainrot_reflex_game_finished'"
    );
    expect(component).not.toContain('<iframe');
  });
});
