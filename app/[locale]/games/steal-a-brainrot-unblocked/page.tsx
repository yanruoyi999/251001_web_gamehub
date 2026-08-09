import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, Gamepad2, ShieldCheck, Smartphone } from 'lucide-react';

import { BrainrotReflexGame } from '@/components/game/brainrot-reflex-game';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import {
  BRAINROT_REFLEX_PATH,
  BRAINROT_REFLEX_PUBLISHED_AT,
  BRAINROT_REFLEX_UPDATED_AT,
} from '@/lib/games/brainrot-reflex-seo';
import { buildAbsoluteUrl } from '@/lib/seo';
import { serializeJsonLd } from '@/lib/utils/json-ld';

export const dynamic = 'force-static';
export const revalidate = 86_400;

const OFFICIAL_ROBLOX_URL =
  'https://www.roblox.com/games/109983668079237/Steal-a-Brainrot';

const pageCopy = {
  zh: {
    metaTitle: 'Steal a Brainrot Unblocked？官方 Roblox 入口与原创反应小游戏',
    metaDescription:
      '正在找 Steal a Brainrot unblocked？查看官方 Roblox 入口、手机体验和安全访问说明，再玩一个无需下载的 Luma 原创反应小游戏。',
    title: 'Steal a Brainrot Unblocked？',
    subheading:
      '先核对官方 Roblox 入口，再玩一个无需下载的原创反应小游戏。Luma 不托管 Roblox 副本，也不提供绕过网络限制的方法。',
    sourceTitle: '官方入口与安全边界',
    sourceBody:
      'Steal a Brainrot 的官方公开页面位于 Roblox。Luma 只提供来源说明和独立小游戏：如果你的学校、公司或地区网络不允许访问 Roblox，请使用被允许的官方访问方式或选择 Luma 上的相似浏览器游戏，不要寻找不明镜像、扩展或下载包。',
    sourceLink: '打开 Roblox 官方页面',
    gameTitle: '先玩 Luma 原创反应挑战',
    gameBody:
      '下面的小游戏只借用了“快速抢到目标”的抽象玩法，不包含 Roblox 的角色、地图、代码或素材。它可以直接在手机和桌面浏览器运行。',
    aboutTitle: '这个页面适合解决什么问题？',
    aboutBody:
      '“Steal a Brainrot unblocked”通常混合了两种需求：找到官方游戏入口，以及在受限网络环境下寻找可玩的浏览器游戏。前者应回到 Roblox 官方页面，后者可以先试试下面的 Luma Original，再查看相关的 Brainrot 和无下载指南。',
    mobileTitle: '手机体验',
    mobileBody:
      '原创反应小游戏使用点击和轻触操作，不依赖键盘，也不需要登录。Steal a Brainrot 官方体验的设备和网络可用性则以 Roblox 页面和你的实际环境为准。',
    policyTitle: '不要把镜像当作官方游戏',
    policyBody:
      '要求安装 APK、浏览器扩展、所谓 mod menu、无限角色或账号授权的页面，不是 Luma 的官方来源。不要在这些页面输入 Roblox 凭据，也不要下载未知文件。',
    relatedTitle: '继续探索',
    related: [
      {
        href: '/guides/brainrot-games',
        title: 'Brainrot Games 指南',
        description: '比较 craft、merge、clicker、obby 和 crossing 类玩法。',
      },
      {
        href: '/guides/robby-cross-the-road-for-brainrot-guide',
        title: 'Robby: Cross the Road for Brainrot',
        description: '查看过马路、收集、基地槽位和移动端注意事项。',
      },
      {
        href: '/guides/no-download-games',
        title: '无下载浏览器游戏',
        description: '找到无需安装、适合短时间游玩的安全选择。',
      },
    ],
    faqTitle: '常见问题',
    faqs: [
      {
        question: '这个页面是 Steal a Brainrot 官方游戏吗？',
        answer:
          '不是。官方游戏入口是 Roblox；本页是 Luma 的独立说明页，并提供一个完全原创的反应小游戏。',
      },
      {
        question: 'Luma 能帮我绕过学校或公司网络限制吗？',
        answer:
          '不能。Luma 不提供代理、绕过限制、镜像复制或破解入口。请使用网络管理员允许的官方访问方式，或选择其他可访问的浏览器游戏。',
      },
      {
        question: 'Luma 原创小游戏需要下载或登录吗？',
        answer:
          '不需要。它直接运行在当前页面，支持桌面点击和手机轻触，成绩只保存在当前浏览器。',
      },
      {
        question: '为什么搜索结果里有很多“unblocked”页面？',
        answer:
          '这是一个容易吸引镜像、克隆和扩展页面的搜索词。页面是否使用官方来源、是否要求下载或账号授权，需要逐个核对，不能因为标题写着 unblocked 就视为官方。',
      },
    ],
    home: '首页',
    games: '游戏',
  },
  en: {
    metaTitle:
      'Steal a Brainrot Unblocked? Official Roblox Access & Reflex Game',
    metaDescription:
      'Looking for Steal a Brainrot unblocked? Check the official Roblox route, mobile notes, and play an original no-download reflex mini-game on Luma.',
    title: 'Steal a Brainrot Unblocked?',
    subheading:
      'Check the official Roblox route, then play an original no-download reflex mini-game. Luma does not host a Roblox copy or provide network-bypass instructions.',
    sourceTitle: 'Official access and safety boundary',
    sourceBody:
      'The official public listing for Steal a Brainrot is on Roblox. Luma provides source context and an independent mini-game only: if your school, workplace, or region does not allow Roblox, use an approved official route or choose a similar Luma browser game instead of hunting for unknown mirrors, extensions, or downloads.',
    sourceLink: 'Open the official Roblox page',
    gameTitle: 'Play the Luma original reflex challenge',
    gameBody:
      'This mini-game borrows only the abstract idea of grabbing a target quickly. It contains no Roblox characters, maps, code, or copied artwork, and it runs on mobile and desktop browsers.',
    aboutTitle: 'What does this page help with?',
    aboutBody:
      'The query “Steal a Brainrot unblocked” usually combines two needs: finding the official game and finding something playable on a restricted network. The official route is Roblox; for a lightweight browser alternative, try the Luma Original above and explore the related Brainrot and no-download guides.',
    mobileTitle: 'Mobile notes',
    mobileBody:
      'The original reflex game uses taps and clicks, needs no keyboard or account, and runs in the current browser. The official Steal a Brainrot experience depends on Roblox support and your network, so verify those details on the official listing and on your device.',
    policyTitle: 'Do not treat mirrors as the official game',
    policyBody:
      'Pages asking for an APK, browser extension, mod menu, unlimited characters, or Roblox account authorization are not Luma or official Roblox sources. Do not enter Roblox credentials or download unknown files on those pages.',
    relatedTitle: 'Keep exploring',
    related: [
      {
        href: '/guides/brainrot-games',
        title: 'Brainrot Games Guide',
        description:
          'Compare craft, merge, clicker, obby, and crossing-style games.',
      },
      {
        href: '/guides/robby-cross-the-road-for-brainrot-guide',
        title: 'Robby: Cross the Road for Brainrot',
        description:
          'Read practical notes on traffic, collection, base slots, and mobile play.',
      },
      {
        href: '/guides/no-download-games',
        title: 'No-download browser games',
        description:
          'Find safer browser choices for quick sessions without installers.',
      },
    ],
    faqTitle: 'Frequently asked questions',
    faqs: [
      {
        question: 'Is this the official Steal a Brainrot game?',
        answer:
          'No. The official game is accessed through Roblox. This page is an independent Luma guide with a completely original reflex mini-game.',
      },
      {
        question: 'Can Luma bypass a school or workplace network block?',
        answer:
          'No. Luma does not provide proxies, bypass tools, cloned mirrors, or cracked access. Use an approved official route or choose another browser game that your network allows.',
      },
      {
        question: 'Does the Luma mini-game need a download or login?',
        answer:
          'No. It runs on this page with desktop clicks or mobile taps. The best score is stored only in the current browser.',
      },
      {
        question: 'Why are there so many “unblocked” pages in search results?',
        answer:
          'The query attracts mirrors, clones, and extension pages. Check the actual platform, source, download prompts, and account requests instead of assuming an unblocked title is official.',
      },
    ],
    home: 'Home',
    games: 'Games',
  },
} as const;

interface PageProps {
  params: Promise<{ locale: string }>;
}

function resolveLocale(value: string): Locale {
  return value === 'en' ? 'en' : 'zh';
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const content = pageCopy[locale];
  const canonical = getLocalizedPath(locale, BRAINROT_REFLEX_PATH);

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords:
      locale === 'en'
        ? [
            'steal a brainrot unblocked',
            'steal a brainrot roblox',
            'steal a brainrot safe access',
            'brainrot reflex game',
            'brainrot games no download',
          ]
        : [
            'steal a brainrot unblocked',
            'Steal a Brainrot Roblox',
            'Brainrot 反应小游戏',
            'Brainrot 无下载游戏',
          ],
    alternates: {
      canonical,
      languages: {
        'zh-CN': getLocalizedPath('zh', BRAINROT_REFLEX_PATH),
        'en-US': getLocalizedPath('en', BRAINROT_REFLEX_PATH),
        'x-default': getLocalizedPath('en', BRAINROT_REFLEX_PATH),
      },
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: canonical,
      type: 'website',
      locale: locale === 'zh' ? 'zh-CN' : 'en-US',
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.metaDescription,
    },
  };
}

export default async function StealABrainrotUnblockedPage({
  params,
}: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const content = pageCopy[locale];
  const localizedPath = getLocalizedPath(locale, BRAINROT_REFLEX_PATH);
  const pageUrl = buildAbsoluteUrl(localizedPath);
  const localeTag = locale === 'zh' ? 'zh-CN' : 'en-US';

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'VideoGame',
      name: 'Brainrot Reflex: Quick Grab',
      alternateName: content.title,
      url: pageUrl,
      description: content.gameBody,
      datePublished: BRAINROT_REFLEX_PUBLISHED_AT,
      dateModified: BRAINROT_REFLEX_UPDATED_AT,
      inLanguage: localeTag,
      applicationCategory: 'GameApplication',
      operatingSystem: 'Web Browser',
      gamePlatform: ['Desktop Browser', 'Mobile Browser'],
      playMode: 'SinglePlayer',
      genre: ['Casual', 'Reflex'],
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: 0,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Luma Game Hub',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: content.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: content.home,
          item: buildAbsoluteUrl(getLocalizedPath(locale)),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: content.games,
          item: buildAbsoluteUrl(getLocalizedPath(locale, '/games')),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: content.title,
          item: pageUrl,
        },
      ],
    },
  ];

  return (
    <article className="w-full bg-background">
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        />
      ))}

      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <nav
          aria-label={locale === 'zh' ? '面包屑导航' : 'Breadcrumb'}
          className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
        >
          <Link href={getLocalizedPath(locale)} className="hover:text-primary">
            {content.home}
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={getLocalizedPath(locale, '/games')}
            className="hover:text-primary"
          >
            {content.games}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">{content.title}</span>
        </nav>

        <header className="mb-8 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary">
            {content.title}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            {content.subheading}
          </p>
        </header>

        <BrainrotReflexGame locale={locale} />

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <article className="border-t-2 border-primary pt-4">
            <Gamepad2 aria-hidden="true" className="h-5 w-5 text-primary" />
            <h2 className="mt-3 font-bold text-foreground">
              {content.gameTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {content.gameBody}
            </p>
          </article>
          <article className="border-t-2 border-cyan-500 pt-4">
            <Smartphone
              aria-hidden="true"
              className="h-5 w-5 text-cyan-600 dark:text-cyan-300"
            />
            <h2 className="mt-3 font-bold text-foreground">
              {content.mobileTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {content.mobileBody}
            </p>
          </article>
          <article className="border-t-2 border-amber-500 pt-4">
            <ShieldCheck
              aria-hidden="true"
              className="h-5 w-5 text-amber-600 dark:text-amber-300"
            />
            <h2 className="mt-3 font-bold text-foreground">
              {content.policyTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {content.policyBody}
            </p>
          </article>
        </section>

        <section className="mt-12 border-y border-border py-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground">
                {content.sourceTitle}
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                {content.sourceBody}
              </p>
            </div>
            <a
              href={OFFICIAL_ROBLOX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-primary px-4 py-3 font-semibold text-primary transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {content.sourceLink}
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground">
            {content.aboutTitle}
          </h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            {content.aboutBody}
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground">
            {content.faqTitle}
          </h2>
          <dl className="mt-6 divide-y divide-border border-y border-border">
            {content.faqs.map(faq => (
              <div key={faq.question} className="py-5">
                <dt className="font-semibold text-foreground">
                  {faq.question}
                </dt>
                <dd className="mt-2 text-sm leading-7 text-muted-foreground">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12" aria-labelledby="related-games">
          <h2 id="related-games" className="text-2xl font-bold text-foreground">
            {content.relatedTitle}
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {content.related.map(item => (
              <Link
                key={item.href}
                href={getLocalizedPath(locale, item.href)}
                className="border border-border p-5 transition hover:border-primary/50 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="font-semibold text-foreground">
                  {item.title}
                </span>
                <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                  {item.description}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
