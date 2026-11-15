import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ThreePlayerCardGameLinks } from '@/components/seo/three-player-card-game-links';

(globalThis as typeof globalThis & { React: typeof React }).React = React;

const slugs = [
  'three-player-spades',
  'garbage-card-game-rules',
  'palace-card-game-rules',
];

describe('three-player tabletop guide links', () => {
  for (const locale of ['en', 'zh'] as const) {
    it(`links each pair once with the right locale in ${locale}`, () => {
      const prefix = locale === 'en' ? '/en' : '';
      for (const slug of slugs) {
        const html = renderToStaticMarkup(React.createElement(ThreePlayerCardGameLinks, { slug, locale }));
        const links = Array.from(html.matchAll(/href="([^"]+)"/g), (match) => match[1]);
        expect(links).toEqual(slugs.filter((target) => target !== slug)
          .map((target) => `${prefix}/guides/${target}`));
        expect(html).toContain(locale === 'en' ? 'More tabletop games for three' : '其他三人桌面牌戏');
      }
    });
  }

  it('does not add a section to unrelated guides', () => {
    expect(renderToStaticMarkup(React.createElement(ThreePlayerCardGameLinks, {
      slug: 'president-card-game-rules',
      locale: 'en',
    }))).toBe('');
  });
});
