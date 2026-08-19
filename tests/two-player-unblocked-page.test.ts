import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const pagePath = path.join(
  process.cwd(),
  'app/[locale]/games/2-player-unblocked/page.tsx',
);

describe('2 Player Unblocked Games dedicated landing page', () => {
  it('ships bilingual SEO, canonical locale metadata, collection schema, and the playable collection first', () => {
    expect(existsSync(pagePath)).toBe(true);
    if (!existsSync(pagePath)) return;

    const source = readFileSync(pagePath, 'utf8');

    expect(source).toContain('generateStaticParams');
    expect(source).toContain('generateMetadata');
    expect(source).toContain('2 Player Unblocked Games');
    expect(source).toContain('双人浏览器游戏');
    expect(source).toContain('/games/2-player-unblocked');
    expect(source).toContain('TwoPlayerCollectionPlayer');
    expect(source).toContain("'@type': 'CollectionPage'");
    expect(source).toContain("'@type': 'ItemList'");
    expect(source).toContain("'@type': 'FAQPage'");
    expect(source).toContain("'@type': 'BreadcrumbList'");
    expect(source).toContain("'x-default': getLocalizedPath('en', TWO_PLAYER_PATH)");
    expect(source).toContain('serializeJsonLd');

    const playerPosition = source.indexOf('<TwoPlayerCollectionPlayer');
    const guidePosition = source.indexOf('id="two-player-guide"');
    expect(playerPosition).toBeGreaterThan(-1);
    expect(guidePosition).toBeGreaterThan(playerPosition);
  });

  it('uses unblocked as a search/category term and provides practical device/control guidance without fake metrics', () => {
    const source = readFileSync(pagePath, 'utf8');

    expect(source).toContain('does not bypass school, workplace, or network filters');
    expect(source).toContain('不会绕过学校、公司或网络过滤规则');
    expect(source).toContain('same-keyboard');
    expect(source).toContain('Chromebook');
    expect(source).toContain('mobile');
    expect(source).toContain('No download');
    expect(source).toContain('No account');
    expect(source).not.toContain('aggregateRating');
    expect(source).not.toContain('interactionStatistic');
    expect(source).not.toContain('reviewCount');
  });
});
