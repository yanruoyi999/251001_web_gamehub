import type { Metadata } from 'next';
import Link from 'next/link';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';

const PATH = '/guides/quick-play-guide';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (localeParam as Locale) ?? 'zh';
  const isZh = locale === 'zh';
  const title = isZh ? '快速游玩指南 | Luma Game Hub' : 'Quick Play Guide | Luma Game Hub';
  const description = isZh
    ? '选择启动快、规则清楚、容易暂停的在线小游戏，适合通勤、学习间隙和等待时间。'
    : 'Choose online games that start quickly, explain themselves clearly, and are easy to pause for commutes, study breaks, and waiting time.';

  return {
    title,
    description,
    alternates: {
      canonical: getLocalizedPath(locale, PATH),
      languages: Object.fromEntries(
        locales.map((loc) => [loc === 'zh' ? 'zh-CN' : 'en-US', getLocalizedPath(loc, PATH)]),
      ),
    },
    openGraph: {
      title,
      description,
      url: getLocalizedPath(locale, PATH),
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = (localeParam as Locale) ?? 'zh';
  const isZh = locale === 'zh';
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Link href={getLocalizedPath(locale, '/guides')} className="text-primary hover:underline">
        {isZh ? '返回专题合集' : 'Back to guides'}
      </Link>
      <h1 className="mt-8 text-4xl font-bold">
        {isZh ? '快速游玩指南' : 'Quick Play Guide'}
      </h1>
      <p className="mt-5 text-lg leading-8 text-muted-foreground">
        {isZh
          ? '这个页面帮助玩家选择启动快、规则清楚、容易暂停的在线小游戏。它适合通勤、学习间隙和等待时间。'
          : 'This page helps players choose online games that start quickly, explain themselves clearly, and are easy to pause. It is useful for commutes, study breaks, and waiting time.'}
      </p>
      <section className="mt-10 space-y-6">
        <h2 className="text-2xl font-semibold">{isZh ? '选择标准' : 'Selection checklist'}</h2>
        <ul className="list-disc space-y-3 pl-5 text-muted-foreground">
          <li>{isZh ? '单局最好能在几分钟内完成或暂停。' : 'A round should be easy to finish or pause within a few minutes.'}</li>
          <li>{isZh ? '操作方式要清楚，不需要长教程。' : 'Controls should be clear without a long tutorial.'}</li>
          <li>{isZh ? '移动端支持要真实说明。' : 'Mobile support should be stated honestly.'}</li>
          <li>{isZh ? '页面应在点击游玩前给出足够背景。' : 'The page should give enough context before play starts.'}</li>
        </ul>
      </section>
      <footer className="mt-10">
        <Link href={getLocalizedPath(locale, '/games')} className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
          {isZh ? '浏览全部游戏' : 'Browse all games'}
        </Link>
      </footer>
    </article>
  );
}
