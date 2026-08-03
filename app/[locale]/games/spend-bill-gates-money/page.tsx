import type { Metadata } from 'next';
import Link from 'next/link';

import { SpendBillGatesMoneyGame } from '@/components/game/spend-bill-gates-money-game';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import {
  DEFAULT_OPEN_GRAPH_IMAGES,
  DEFAULT_TWITTER_IMAGES,
  buildAbsoluteUrl,
} from '@/lib/seo';
import { serializeJsonLd } from '@/lib/utils/json-ld';

export const dynamic = 'force-static';
export const revalidate = 86_400;

const pageCopy = {
  zh: {
    metaTitle: '花光比尔·盖茨的钱 - 亿万富翁模拟器',
    metaDescription:
      '你能花掉1000亿美元吗？购买私人飞机、岛屿、NBA球队等，体验亿万富翁的消费人生。',
    pageTitle: '花光比尔·盖茨的钱',
    aboutTitle: '关于这个亿万富翁消费游戏',
    about:
      '《花光比尔·盖茨的钱》是一款完全在浏览器中运行的免费互动模拟游戏。你会获得固定的1000亿美元游戏资产，并在私人飞机、超级游艇、职业球队、学校、医院、太空计划和一些荒诞商品之间做选择。商品可以重复购买，余额不会低于零；结束时，游戏会根据各类消费金额生成一个亿万富翁身份。这里的重点不是预测真实财富，而是用轻松的方式体验极大金额、选择偏好和消费想象。所有计算都保留在当前页面，不需要登录，也不会进行真实付款。',
    faqTitle: '常见问题',
    faqs: [
      {
        question: '比尔·盖茨有多少钱？',
        answer:
          '他的财富每天都会随市场和资产变化。本游戏采用固定的1000亿美元作为玩法金额，并非比尔·盖茨当前净资产的实时估值。这是一个非官方娱乐游戏，与比尔·盖茨、微软或任何相关组织无关，也没有获得其背书。',
      },
      {
        question: '花掉1000亿美元需要多久？',
        answer:
          '这取决于花钱速度。如果每天花100万美元，大约需要274年；如果每天花10亿美元，则需要100天。在游戏里，你可以通过重复购买大型项目，更快看到余额变化。',
      },
      {
        question: '用比尔·盖茨的钱能买什么？',
        answer:
          '游戏提供15种选择，包括私人飞机、超级游艇、私人岛屿、NBA球队、摩天大楼、太空计划、100所学校、医院、气候研究、黄金马桶和月球陨石坑命名等。',
      },
    ],
    disclaimerTitle: '非官方娱乐声明',
    disclaimer:
      '这是一个非官方的娱乐游戏，与比尔·盖茨、微软或任何相关组织无关。1000亿美元的金额是游戏设定的固定数值，并非比尔·盖茨当前净资产的实时估值。',
    relatedTitle: '继续探索 Luma Game Hub',
    related: [
      {
        href: '/games',
        title: '浏览全部免费游戏',
        description: '继续寻找支持手机和桌面浏览器的即开即玩游戏。',
      },
      {
        href: '/guides/no-download-games',
        title: '无需下载的浏览器游戏',
        description: '了解如何选择安全、快速且适合碎片时间的在线游戏。',
      },
      {
        href: '/guides/games-to-play-when-bored',
        title: '无聊时可以玩的游戏',
        description: '从短局、益智和轻量挑战中找到下一款游戏。',
      },
    ],
    breadcrumbHome: '首页',
    breadcrumbGames: '游戏',
  },
  en: {
    metaTitle: 'Spend Bill Gates Money - Billionaire Life Simulator',
    metaDescription:
      'Can you spend $100 billion? Buy private jets, islands, NBA teams, and more in this billionaire spending game.',
    pageTitle: 'Spend Bill Gates Money',
    aboutTitle: 'About this billionaire spending game',
    about:
      'Spend Bill Gates Money is a free, browser-only interactive simulator built around a fixed $100 billion gameplay balance. Buy private jets, super yachts, sports teams, schools, hospitals, a space program, and a few deliberately ridiculous luxuries. Every item can be purchased more than once, your balance can never fall below zero, and the final report assigns a billionaire identity based on where most of the money went. The game does not predict real wealth or process real payments. It is a lightweight way to explore huge numbers, personal priorities, and the fantasy of making decisions without ordinary financial limits. No account is required, and all calculations stay on the page.',
    faqTitle: 'Frequently asked questions',
    faqs: [
      {
        question: 'How much money does Bill Gates have?',
        answer:
          "His net worth changes daily with markets and asset values. This game uses a fixed $100 billion as a gameplay amount, not a live estimate. It is an unofficial entertainment game and is not affiliated with or endorsed by Bill Gates, Microsoft, or any related organization.",
      },
      {
        question: 'How long would it take to spend $100 billion?',
        answer:
          'It depends on the spending rate. At $1 million per day, $100 billion lasts about 274 years. At $1 billion per day, it lasts 100 days. In the game, repeated large purchases make the balance move much faster.',
      },
      {
        question: "What can you buy with Bill Gates' money?",
        answer:
          'The 15 choices include private jets, a super yacht, a private island, an NBA team, a skyscraper, a space program, 100 schools, hospitals, climate research, a golden toilet, and the right to name a moon crater.',
      },
    ],
    disclaimerTitle: 'Unofficial entertainment notice',
    disclaimer:
      "This is an unofficial entertainment game and is not affiliated with or endorsed by Bill Gates, Microsoft, or any related organization. The $100 billion amount is a rounded gameplay value, not a live estimate of Bill Gates' current net worth.",
    relatedTitle: 'Keep exploring Luma Game Hub',
    related: [
      {
        href: '/games',
        title: 'Browse all free games',
        description: 'Find more instant-play games for mobile and desktop browsers.',
      },
      {
        href: '/guides/no-download-games',
        title: 'No-download browser games',
        description: 'Learn how to choose quick, safe browser games for short sessions.',
      },
      {
        href: '/guides/games-to-play-when-bored',
        title: 'Games to play when bored',
        description: 'Pick your next short, puzzle, or lightweight browser challenge.',
      },
    ],
    breadcrumbHome: 'Home',
    breadcrumbGames: 'Games',
  },
} as const;

interface SpendBillGatesMoneyPageProps {
  params: Promise<{ locale: string }>;
}

function resolveLocale(value: string): Locale {
  return value === 'en' ? 'en' : 'zh';
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: SpendBillGatesMoneyPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const content = pageCopy[locale];
  const canonical = getLocalizedPath(
    locale,
    '/games/spend-bill-gates-money',
  );

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords:
      locale === 'zh'
        ? ['花光比尔盖茨的钱', '亿万富翁模拟器', '花钱游戏', '1000亿美元']
        : [
            'spend bill gates money',
            'billionaire simulator',
            'spend 100 billion',
            'money spending game',
          ],
    alternates: {
      canonical,
      languages: {
        'zh-CN': getLocalizedPath(
          'zh',
          '/games/spend-bill-gates-money',
        ),
        'en-US': getLocalizedPath(
          'en',
          '/games/spend-bill-gates-money',
        ),
        'x-default': getLocalizedPath(
          'en',
          '/games/spend-bill-gates-money',
        ),
      },
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: canonical,
      type: 'website',
      locale: locale === 'zh' ? 'zh-CN' : 'en-US',
      alternateLocale: [locale === 'zh' ? 'en-US' : 'zh-CN'],
      images: DEFAULT_OPEN_GRAPH_IMAGES,
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.metaDescription,
      images: DEFAULT_TWITTER_IMAGES,
    },
  };
}

export default async function SpendBillGatesMoneyPage({
  params,
}: SpendBillGatesMoneyPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const content = pageCopy[locale];
  const localizedPath = getLocalizedPath(
    locale,
    '/games/spend-bill-gates-money',
  );
  const pageUrl = buildAbsoluteUrl(localizedPath);
  const localeTag = locale === 'zh' ? 'zh-CN' : 'en-US';

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'VideoGame',
      name: content.pageTitle,
      alternateName:
        locale === 'zh'
          ? 'Spend Bill Gates Money - Billionaire Life Simulator'
          : '花光比尔·盖茨的钱 - 亿万富翁模拟器',
      url: pageUrl,
      description: content.metaDescription,
      inLanguage: localeTag,
      applicationCategory: 'GameApplication',
      operatingSystem: 'Web Browser',
      gamePlatform: ['Desktop Browser', 'Mobile Browser'],
      playMode: 'SinglePlayer',
      genre: ['Simulation', 'Casual'],
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
      mainEntity: content.faqs.map((faq) => ({
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
          name: content.breadcrumbHome,
          item: buildAbsoluteUrl(getLocalizedPath(locale)),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: content.breadcrumbGames,
          item: buildAbsoluteUrl(getLocalizedPath(locale, '/games')),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: content.pageTitle,
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

      <h1 className="sr-only">{content.pageTitle}</h1>
      <SpendBillGatesMoneyGame locale={locale} />

      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <nav
          aria-label={locale === 'zh' ? '面包屑导航' : 'Breadcrumb'}
          className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
        >
          <Link href={getLocalizedPath(locale)} className="hover:text-primary">
            {content.breadcrumbHome}
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={getLocalizedPath(locale, '/games')}
            className="hover:text-primary"
          >
            {content.breadcrumbGames}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">{content.pageTitle}</span>
        </nav>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-9">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            {content.aboutTitle}
          </h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            {content.about}
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-9">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            {content.faqTitle}
          </h2>
          <dl className="mt-6 space-y-6">
            {content.faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl bg-muted/50 p-5">
                <dt className="text-lg font-semibold text-foreground">
                  {faq.question}
                </dt>
                <dd className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <aside className="mt-8 rounded-2xl border border-amber-300/30 bg-amber-50 p-5 text-amber-950 dark:bg-amber-950/20 dark:text-amber-100">
          <h2 className="font-semibold">{content.disclaimerTitle}</h2>
          <p className="mt-2 text-sm leading-6">{content.disclaimer}</p>
        </aside>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-foreground">
            {content.relatedTitle}
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {content.related.map((item) => (
              <Link
                key={item.href}
                href={getLocalizedPath(locale, item.href)}
                className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:bg-muted/40"
              >
                <span className="font-semibold text-foreground">{item.title}</span>
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
