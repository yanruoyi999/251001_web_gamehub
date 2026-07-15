import { getLocalizedPath } from '@/i18n/config';
import { buildAbsoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

const priorityPages = [
  '/',
  '/games',
  '/guides',
  '/guides/free-games-no-ads',
  '/guides/games-to-play-when-bored',
  '/guides/google-snake-mods',
  '/games/solitaire',
  '/games/monster-survivors',
];

export function GET() {
  const lines = [
    '# Luma Game Hub',
    '',
    'Luma Game Hub is a curated browser games directory focused on instant-play, mobile-friendly, no-download games, practical game guides, and search-friendly game collections.',
    '',
    'Primary audience: players looking for free browser games, quick boredom busters, mobile-friendly web games, and simple walkthroughs.',
    '',
    'Canonical site:',
    buildAbsoluteUrl('/'),
    '',
    'Sitemap:',
    buildAbsoluteUrl('/sitemap.xml'),
    '',
    'Priority pages:',
    ...priorityPages.flatMap((path) => [
      `- ${buildAbsoluteUrl(getLocalizedPath('zh', path))}`,
      `- ${buildAbsoluteUrl(getLocalizedPath('en', path))}`,
    ]),
    '',
    'Content notes:',
    '- Game pages include playable iframe entries where source review allows it, original descriptions, categories, tags, and related navigation.',
    '- Guide pages target specific game and search-intent questions with practical tips, FAQs, and internal links.',
    '- The site supports zh and en localized paths with canonical and hreflang metadata.',
  ];

  return new Response(`${lines.join('\n')}\n`, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
