import type { Metadata } from 'next';
import Link from 'next/link';

import { SpendBillGatesMoneyGame } from '@/components/game/spend-bill-gates-money-game';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import {
  SPEND_BILL_GATES_MONEY_OG_IMAGE,
  SPEND_BILL_GATES_MONEY_PATH,
  SPEND_BILL_GATES_MONEY_PUBLISHED_AT,
  SPEND_BILL_GATES_MONEY_UPDATED_AT,
} from '@/lib/games/spend-bill-gates-money-seo';
import { buildAbsoluteUrl } from '@/lib/seo';
import { serializeJsonLd } from '@/lib/utils/json-ld';

export const dynamic = 'force-static';
export const revalidate = 86_400;

const pageCopy = {
  zh: {
    metaTitle: '花光比尔·盖茨的钱 - 亿万富翁模拟器',
    metaDescription:
      '在线体验花光比尔·盖茨的钱游戏：用加减控制规划固定的1000亿美元，购买私人飞机、球队、学校和太空计划，并生成亿万富翁身份。',
    pageTitle: '花光比尔·盖茨的钱',
    aboutTitle: '关于这个亿万富翁消费模拟器',
    about:
      '《花光比尔·盖茨的钱》是一款完全在浏览器中运行的免费互动模拟游戏。你会获得固定的1000亿美元游戏资产，并在私人飞机、超级游艇、职业球队、学校、医院、太空计划和一些荒诞商品之间做选择。商品可以重复购买，也可以减少数量并退回对应的游戏金额；结束时，游戏会根据各类消费金额生成一个亿万富翁身份。这里的重点不是预测真实财富，而是用轻松的方式体验极大金额、选择偏好和消费想象。所有计算都保留在当前页面，不需要登录，也不会进行真实付款。',
    seoTitle: '玩法、手机支持与1000亿美元说明',
    howToTitle: '怎么玩花光比尔盖茨的钱游戏',
    howToBody:
      '点击“开始花钱”后，你会得到固定的1000亿美元游戏余额。使用商品卡右侧的加号购买，观察顶部余额和百分比变化；至少购买一件商品后，可以从固定财富栏或购买记录底部查看结果。这个在线花钱游戏会按你的消费类别生成亿万富翁身份。',
    mobileTitle: '手机能玩，而且无需下载',
    mobileBody:
      '这款比尔盖茨花钱模拟器直接在现代手机和桌面浏览器中运行，不需要安装应用、注册账号或上传个人信息。开始游戏后，财富总额和进度条会固定在网站导航栏下方，向下浏览商品时仍然可见。',
    buySellTitle: '如何增加、减少和退回商品金额',
    buySellBody:
      '它是一款支持加减数量的在线花钱游戏：点击加号购买一件，点击减号移除一件并把对应游戏金额退回余额。所有金额都使用整数美元计算，余额不会低于零，方便反复比较不同消费组合。',
    whatCanBuyTitle: '1000亿美元能买什么？',
    whatCanBuyBody:
      '1000亿美元可以买私人飞机、超级游艇、私人岛屿、NBA球队、足球俱乐部、摩天大楼、太空计划、学校、医院和气候研究，也可以买黄金马桶等故意夸张的商品。不同选择让你直观看到百万、十亿和百亿美元之间的数量级差异。',
    fixedBalanceTitle: '为什么游戏使用固定的1000亿美元',
    fixedBalanceBody:
      '真实净资产会随市场每天变化，不适合让同一局游戏保持一致。本页使用固定的1000亿美元作为玩法基准，使每位用户面对同一预算，也避免把娱乐数值误写成比尔·盖茨当前财富的实时估值。',
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
      {
        question: '花光比尔·盖茨的钱可以在手机上玩吗？',
        answer:
          '可以。页面支持现代手机浏览器，不需要下载应用或登录。开始游戏后，财富总额和进度条会固定在网站导航栏下方。',
      },
      {
        question: '购买后可以减少商品数量并退回金额吗？',
        answer:
          '可以。每张商品卡都有加号、数量和减号；点击减号会移除一件商品，并把对应的游戏金额完整退回余额。',
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
      'Play the Spend Bill Gates Money game online. Plan a fixed $100 billion budget with buy and remove controls, then reveal your billionaire identity.',
    pageTitle: 'Spend Bill Gates Money',
    aboutTitle: 'About this billionaire spending game',
    about:
      'Spend Bill Gates Money is a free, browser-only interactive simulator built around a fixed $100 billion gameplay balance. Buy private jets, super yachts, sports teams, schools, hospitals, a space program, and a few deliberately ridiculous luxuries. Every item can be purchased more than once or removed for a full gameplay refund, and the final report assigns a billionaire identity based on where most of the money went. The game does not predict real wealth or process real payments. It is a lightweight way to explore huge numbers, personal priorities, and the fantasy of making decisions without ordinary financial limits. No account is required, and all calculations stay on the page.',
    seoTitle: 'How to play, mobile support, and the $100 billion scale',
    howToTitle: 'How to play the Spend Bill Gates Money game online',
    howToBody:
      'Press Start Spending to receive a fixed $100 billion gameplay balance. Use the plus button on a product card to buy an item, watch the fixed fortune bar update, and generate a result after at least one purchase. The simulator assigns a billionaire identity from the categories where you spent the most.',
    mobileTitle: 'Play on mobile with no download or account',
    mobileBody:
      'This Spend Bill Gates Money simulator runs directly in modern mobile and desktop browsers. It needs no app installation, account, or personal-data upload. After the game starts, the fortune total and progress bar remain fixed below the site header while you browse the product list.',
    buySellTitle: 'A money spending game with buy and sell controls',
    buySellBody:
      'Use plus to buy another unit and minus to remove one and refund its gameplay price. The reversible controls let you compare different $100 billion plans without restarting. Prices use integer dollars, and the remaining balance can never drop below zero.',
    whatCanBuyTitle: 'What can you buy with 100 billion dollars?',
    whatCanBuyBody:
      'The list ranges from private jets, yachts, islands, sports teams, and skyscrapers to schools, hospitals, climate research, and a space program. Deliberately absurd options such as a golden toilet make the scale of millions and billions easier to compare.',
    fixedBalanceTitle: 'Why this billionaire spending simulator uses a fixed balance',
    fixedBalanceBody:
      'Real net worth changes with markets and asset values. A fixed $100 billion keeps every player on the same budget and prevents an entertainment figure from being presented as a live estimate of Bill Gates’ current wealth.',
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
      {
        question: 'Can I play Spend Bill Gates Money on mobile?',
        answer:
          'Yes. The page works in modern mobile browsers with no app download or account. After the game starts, the fortune total and progress bar remain fixed below the site header.',
      },
      {
        question: 'Can I remove purchases and get the money back?',
        answer:
          'Yes. Each product card has plus, quantity, and minus controls. Minus removes one unit and refunds the full gameplay price to your balance.',
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
  const canonical = getLocalizedPath(locale, SPEND_BILL_GATES_MONEY_PATH);
  const socialImage = {
    url: buildAbsoluteUrl(SPEND_BILL_GATES_MONEY_OG_IMAGE),
    width: 1200,
    height: 630,
    alt:
      locale === 'zh'
        ? '花光比尔·盖茨的钱：1000亿美元消费模拟器'
        : 'Spend Bill Gates Money: $100 billion spending simulator',
  };

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords:
      locale === 'zh'
        ? [
            '花光比尔盖茨的钱',
            '花光比尔盖茨的钱游戏',
            '比尔盖茨花钱模拟器',
            '亿万富翁消费模拟器',
            '在线花钱游戏',
            '1000亿美元能买什么',
          ]
        : [
            'spend bill gates money',
            'spend bill gates money game online',
            'spend bill gates money simulator',
            'spend 100 billion dollars game',
            'billionaire spending simulator online',
            'spend bill gates money mobile',
            'spend bill gates money no download',
            'money spending game with buy and sell',
            'what can you buy with 100 billion dollars',
          ],
    alternates: {
      canonical,
      languages: {
        'zh-CN': getLocalizedPath('zh', SPEND_BILL_GATES_MONEY_PATH),
        'en-US': getLocalizedPath('en', SPEND_BILL_GATES_MONEY_PATH),
        'x-default': getLocalizedPath('en', SPEND_BILL_GATES_MONEY_PATH),
      },
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: canonical,
      type: 'website',
      locale: locale === 'zh' ? 'zh-CN' : 'en-US',
      alternateLocale: [locale === 'zh' ? 'en-US' : 'zh-CN'],
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.metaDescription,
      images: [socialImage.url],
    },
  };
}

export default async function SpendBillGatesMoneyPage({
  params,
}: SpendBillGatesMoneyPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const content = pageCopy[locale];
  const localizedPath = getLocalizedPath(locale, SPEND_BILL_GATES_MONEY_PATH);
  const pageUrl = buildAbsoluteUrl(localizedPath);
  const localeTag = locale === 'zh' ? 'zh-CN' : 'en-US';
  const seoSections = [
    { title: content.howToTitle, body: content.howToBody },
    { title: content.mobileTitle, body: content.mobileBody },
    { title: content.buySellTitle, body: content.buySellBody },
    { title: content.whatCanBuyTitle, body: content.whatCanBuyBody },
    { title: content.fixedBalanceTitle, body: content.fixedBalanceBody },
  ];

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
      image: buildAbsoluteUrl(SPEND_BILL_GATES_MONEY_OG_IMAGE),
      description: content.metaDescription,
      datePublished: SPEND_BILL_GATES_MONEY_PUBLISHED_AT,
      dateModified: SPEND_BILL_GATES_MONEY_UPDATED_AT,
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

        <section className="mt-8" aria-labelledby="billionaire-game-guide">
          <h2
            id="billionaire-game-guide"
            className="text-2xl font-bold text-foreground sm:text-3xl"
          >
            {content.seoTitle}
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {seoSections.map((section) => (
              <section
                key={section.title}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-foreground">
                  {section.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
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
