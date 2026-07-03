import type { Metadata } from 'next';
import Link from 'next/link';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';

const PATH = '/guides/no-download-games';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = (params.locale as Locale) ?? 'zh';
  const isZh = locale === 'zh';
  const title = isZh ? '无需下载的在线小游戏 | Luma Game Hub' : 'No Download Games | Luma Game Hub';
  const description = isZh
    ? '了解如何选择无需安装、无需注册、能直接在浏览器中打开的在线小游戏。'
    : 'Learn how to choose no-download games that open directly in the browser without installs, accounts, or app-store friction.';

  return {
    title,
    description,
    alternates: {
      canonical: getLocalizedPath(locale, PATH),
      languages: Object.fromEntries(
        locales.map((loc) => [loc === 'zh' ? 'zh-CN' : 'en-US', getLocalizedPath(loc, PATH)]),
      ),
    },
    openGraph: { title, description, url: getLocalizedPath(locale, PATH), type: 'article' },
    twitter: { card: 'summary', title, description },
  };
}

export default function NoDownloadGamesPage({ params }: { params: { locale: string } }) {
  const locale = (params.locale as Locale) ?? 'zh';
  const isZh = locale === 'zh';
  const checklist = isZh
    ? ['直接在浏览器打开，不要求安装 App。', '不要求创建账号才能试玩。', '页面在点击游玩前说明设备与控制方式。', '遇到跳转、遮挡或失效时应该重新复查。']
    : ['Open directly in the browser with no app install.', 'Do not require an account before a first test round.', 'Explain device and control expectations before play starts.', 'Recheck pages when redirects, overlays, or broken embeds appear.'];

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Link href={getLocalizedPath(locale, '/guides')} className="text-primary hover:underline">
        {isZh ? '返回专题合集' : 'Back to guides'}
      </Link>
      <h1 className="mt-8 text-4xl font-bold">
        {isZh ? '无需下载的在线小游戏' : 'No Download Games'}
      </h1>
      <p className="mt-5 text-lg leading-8 text-muted-foreground">
        {isZh
          ? '无需下载游戏的核心价值是低门槛：玩家可以先试玩，再决定是否继续。好的浏览器游戏应该减少安装、注册和复杂教程带来的摩擦。'
          : 'The value of no-download games is low friction: players can test a game before committing. Good browser games reduce install prompts, sign-in walls, and long tutorials.'}
      </p>
      <section className="mt-10 rounded-xl border bg-background p-6">
        <h2 className="text-2xl font-semibold">{isZh ? '检查清单' : 'Checklist'}</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-muted-foreground">
          {checklist.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold">{isZh ? '为什么这对玩家重要？' : 'Why this matters'}</h2>
        <p className="leading-7 text-muted-foreground">
          {isZh
            ? '短时间休息、通勤和临时等待场景不适合复杂安装流程。浏览器游戏可以让玩家快速确认操作方式、画面是否适配，以及是否值得继续投入时间。'
            : 'Short breaks, commutes, and waiting time do not fit complicated install flows. Browser games let players quickly test controls, layout, and whether a title deserves more time.'}
        </p>
      </section>
      <footer className="mt-10 flex flex-wrap gap-3">
        <Link href={getLocalizedPath(locale, '/games')} className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
          {isZh ? '浏览全部游戏' : 'Browse all games'}
        </Link>
        <Link href={getLocalizedPath(locale, '/guides/quick-play-guide')} className="rounded-lg border px-6 py-3 font-medium text-primary hover:bg-primary/10">
          {isZh ? '查看快速游玩指南' : 'Read quick play guide'}
        </Link>
      </footer>
    </article>
  );
}
