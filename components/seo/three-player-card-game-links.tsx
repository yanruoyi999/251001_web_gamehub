import Link from 'next/link';
import { getLocalizedPath, type Locale } from '@/i18n/config';

const guides = [
  {
    slug: 'three-player-spades',
    en: { name: 'Three-player Spades', setup: 'One deck, 17 cards each. Bid for tricks and keep score.' },
    zh: { name: '三人 Spades', setup: '一副牌，每人 17 张。各自叫墩，按叫墩与实得墩数计分。' },
  },
  {
    slug: 'garbage-card-game-rules',
    en: { name: 'Garbage (Trash)', setup: 'Two decks, ten face-down slots each. The round winner starts the next round with one fewer slot.' },
    zh: { name: 'Garbage（Trash）', setup: '两副牌，每人先摆十个暗牌格。每轮赢家下轮少一格。' },
  },
  {
    slug: 'palace-card-game-rules',
    en: { name: 'Palace', setup: 'Two decks, three hidden cards, three face-up cards and three in hand. First to empty all three wins.' },
    zh: { name: 'Palace', setup: '两副牌，每人三暗、三明、三张手牌。先打完三处牌的人获胜。' },
  },
];

export function ThreePlayerCardGameLinks({ slug, locale }: { slug: string; locale: Locale }) {
  if (!guides.some(guide => guide.slug === slug)) return null;

  return (
    <section aria-labelledby="three-player-card-games" className="mt-16 border-t border-border pt-10">
      <h2 id="three-player-card-games" className="text-2xl font-semibold text-foreground">
        {locale === 'zh' ? '其他三人桌面牌戏' : 'More tabletop games for three'}
      </h2>
      <ul className="mt-4 space-y-3 text-sm">
        {guides.filter(guide => guide.slug !== slug).map(guide => (
          <li key={guide.slug}>
            <Link href={getLocalizedPath(locale, `/guides/${guide.slug}`)} className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4">
              {guide[locale].name}
            </Link>
            <p className="text-muted-foreground">{guide[locale].setup}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
