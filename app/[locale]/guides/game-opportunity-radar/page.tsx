import type { Metadata } from 'next';
import Link from 'next/link';

import { GameOpportunityRadarForm } from '@/components/creator/game-opportunity-radar-form';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import {
  DEFAULT_OPEN_GRAPH_IMAGES,
  DEFAULT_TWITTER_IMAGES,
  buildAbsoluteUrl,
  getSiteBaseUrl,
} from '@/lib/seo';
import { serializeJsonLd } from '@/lib/utils/json-ld';

export const dynamic = 'force-static';
export const revalidate = 86400;

const pageCopy = {
  zh: {
    metaTitle: '游戏机会雷达：小团队游戏 MVP 可行性评估',
    metaDescription:
      '根据平台、团队、预算、周期和玩法复杂度，免费初筛游戏 MVP 是否适合进入验证，并获得范围、变现测试和风险建议。',
    eyebrow: 'Game Opportunity Radar · MVP',
    heading: '先判断什么值得做，再投入开发',
    subheading:
      '这不是“AI 猜下一个爆款”，而是一个透明的项目初筛：先看你的第一版能不能按时做完，再决定是否购买更完整的市场与竞品报告。',
    quickTitle: '第一版就是 Luma Game Hub 里的内容 + 工具内页',
    quickBody:
      '现在不需要马上拆独立站。先用这个页面验证三件事：有没有开发者访问、有没有人完成评估、有没有人主动询问付费完整报告。验证成立后，再把它拆成独立的 Game Opportunity Radar 产品。',
    validationTitle: '真正需要验证的三件事',
    validationSteps: [
      {
        title: '1. 有人真的在找方向吗？',
        body: '先看目标开发者是否愿意填写真实的平台、预算和周期，而不是只浏览一篇泛泛文章。',
      },
      {
        title: '2. 这个方向做得出来吗？',
        body: '把首版压缩成一个核心循环、一张地图和一个明确结束条件，避免把大型愿景误当成 MVP。',
      },
      {
        title: '3. 有人愿意为更深分析付钱吗？',
        body: '先收集明确的报告咨询或预付意向，再开发数据库、AI 报告和订阅系统。',
      },
    ],
    businessTitle: '未来这个网站具体卖什么',
    businessItems: [
      '一次性完整机会报告：竞品、目标玩家、首版范围、验证指标和变现测试。',
      '订阅数据库：平台、品类、案例、更新和风险信号的持续追踪。',
      '小团队顾问包：把一个想法拆成可执行的 30 天 MVP 计划。',
    ],
    boundaryTitle: '数据边界：现在能告诉你什么，不能告诉你什么',
    boundaryBody:
      '当前分数只反映项目约束和内容复杂度，不使用虚构的收入、搜索量或成功率。它可以帮助你发现“范围明显过大”，但不能证明市场需求，更不能保证赚钱。页面中的结果不是收入预测、投资建议或平台官方评级。',
    ctaTitle: '愿意付费买完整报告吗？',
    ctaBody:
      '付款页面还没有上线。现在点击下面的按钮会打开一封预填邮件，用来记录真实需求。请写明平台、预算、周期和你最想验证的问题。',
    ctaLabel: '申请完整机会报告',
    ctaNote: '当前仅收集需求，不会自动扣款。',
    faqTitle: '常见问题',
    faqs: [
      {
        question: '这个分数是在预测游戏收入吗？',
        answer: '不是收入预测。它只根据团队、预算、周期、平台和玩法复杂度评估首版交付风险。',
      },
      {
        question: '填写的内容会上传吗？',
        answer: '不会。当前评估完全在浏览器内完成，选择内容不会发送到服务器。',
      },
      {
        question: '现在可以买完整报告吗？',
        answer: '当前没有上线自动支付。可以通过邮件提交需求，后续是否收费交付会单独确认。',
      },
    ],
    back: '返回专题合集',
    browseGames: '浏览现有游戏',
    contact: '查看联系与开发者合作',
  },
  en: {
    metaTitle: 'Game Opportunity Radar: Small-Team MVP Feasibility Screen',
    metaDescription:
      'Screen a game MVP by platform, team, budget, timeline, and genre complexity, then get scope, monetization-test, and risk guidance.',
    eyebrow: 'Game Opportunity Radar · MVP',
    heading: 'Decide what is worth testing before you fund development',
    subheading:
      'This is not an AI prediction of the next hit. It is a transparent project screen: first check whether the initial release can ship, then decide whether a deeper market and competitor report is worth paying for.',
    quickTitle: 'The first version is a content-and-tool page inside Luma Game Hub',
    quickBody:
      'There is no need to split it into a separate site yet. This page first validates three signals: creator traffic, completed evaluations, and explicit requests for a paid full report. If those signals appear, the feature can become a standalone Game Opportunity Radar product.',
    validationTitle: 'The three things that actually need evidence',
    validationSteps: [
      {
        title: '1. Are creators actively choosing a direction?',
        body: 'Look for developers willing to enter a real platform, budget, and schedule rather than merely reading a generic article.',
      },
      {
        title: '2. Can the proposed direction ship?',
        body: 'Reduce the first release to one core loop, one map, and one ending condition instead of treating a large vision as an MVP.',
      },
      {
        title: '3. Will anyone pay for deeper analysis?',
        body: 'Collect explicit report requests or prepayment intent before building a database, AI reports, and subscriptions.',
      },
    ],
    businessTitle: 'What the product could charge for later',
    businessItems: [
      'One-off opportunity reports covering competitors, target players, first-release scope, validation metrics, and monetization tests.',
      'A subscription database tracking platforms, genres, cases, updates, and risk signals.',
      'A small-team advisory package that turns one idea into an executable 30-day MVP plan.',
    ],
    boundaryTitle: 'Evidence boundary: what this can and cannot tell you',
    boundaryBody:
      'The current score reflects project constraints and content complexity only. It does not use invented revenue, search volume, or success-rate data. It can expose an obviously oversized scope, but it cannot prove demand or guarantee profit. The result is not a revenue forecast, investment advice, or an official platform rating.',
    ctaTitle: 'Would you pay for a full report?',
    ctaBody:
      'Checkout is not live. The button below opens a prefilled email so real demand can be recorded. Include the platform, budget, schedule, and the question you most need to validate.',
    ctaLabel: 'Request a full opportunity report',
    ctaNote: 'This currently records demand only and does not charge you automatically.',
    faqTitle: 'Frequently asked questions',
    faqs: [
      {
        question: 'Does this score predict game revenue?',
        answer: 'No. It only screens first-release delivery risk using team, budget, timeline, platform, and genre complexity.',
      },
      {
        question: 'Are my selections uploaded?',
        answer: 'No. The current evaluation runs entirely in the browser and sends no selections to a server.',
      },
      {
        question: 'Can I buy the full report now?',
        answer: 'Automated payment is not live. You can submit a request by email, and any paid delivery would be confirmed separately.',
      },
    ],
    back: 'Back to guides',
    browseGames: 'Browse current games',
    contact: 'View contact and developer collaboration',
  },
} as const;

interface GameOpportunityRadarPageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: GameOpportunityRadarPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'en' ? 'en' : 'zh';
  const content = pageCopy[locale];
  const path = getLocalizedPath(locale, '/guides/game-opportunity-radar');

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords:
      locale === 'zh'
        ? ['游戏机会分析', '游戏 MVP', '独立游戏创业', 'Roblox 游戏创意', 'KK 地图开发']
        : ['game opportunity analysis', 'game MVP', 'indie game ideas', 'Roblox game ideas', 'game market validation'],
    alternates: {
      canonical: path,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc === 'zh' ? 'zh-CN' : 'en-US',
          getLocalizedPath(loc, '/guides/game-opportunity-radar'),
        ]),
      ),
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: path,
      type: 'website',
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

export default async function GameOpportunityRadarPage({
  params,
}: GameOpportunityRadarPageProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = localeParam === 'en' ? 'en' : 'zh';
  const content = pageCopy[locale];
  const pagePath = getLocalizedPath(locale, '/guides/game-opportunity-radar');
  const pageUrl = buildAbsoluteUrl(pagePath);
  const mailSubject =
    locale === 'zh'
      ? 'Game Opportunity Radar 完整机会报告需求'
      : 'Game Opportunity Radar full report request';
  const mailBody =
    locale === 'zh'
      ? '目标平台：\n团队规模：\n首版预算：\n开发周期：\n最想验证的问题：\n'
      : 'Target platform:\nTeam size:\nFirst-release budget:\nDevelopment window:\nQuestion I most need to validate:\n';
  const reportMailto = `mailto:dev@lumagamehub.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: content.metaTitle,
      description: content.metaDescription,
      url: pageUrl,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description:
          locale === 'zh' ? '免费浏览器端 MVP 可交付性初筛' : 'Free browser-based MVP delivery-fit screen',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Luma Game Hub',
        url: getSiteBaseUrl(),
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
          name: locale === 'zh' ? '首页' : 'Home',
          item: buildAbsoluteUrl(getLocalizedPath(locale)),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: locale === 'zh' ? '专题合集' : 'Guides',
          item: buildAbsoluteUrl(getLocalizedPath(locale, '/guides')),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Game Opportunity Radar',
          item: pageUrl,
        },
      ],
    },
  ];

  return (
    <article className="mx-auto w-full max-w-6xl px-6 py-12">
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        />
      ))}

      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href={getLocalizedPath(locale, '/guides')} className="hover:text-primary">
          ← {content.back}
        </Link>
      </nav>

      <header className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {content.eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {content.heading}
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          {content.subheading}
        </p>
      </header>

      <section className="mx-auto mt-10 max-w-4xl rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-foreground">{content.quickTitle}</h2>
        <p className="mt-3 leading-relaxed text-foreground/85">{content.quickBody}</p>
      </section>

      <div className="mt-12">
        <GameOpportunityRadarForm locale={locale} />
      </div>

      <section className="mx-auto mt-16 max-w-5xl">
        <h2 className="text-3xl font-bold text-foreground">{content.validationTitle}</h2>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {content.validationSteps.map((step) => (
            <div key={step.title} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{content.businessTitle}</h2>
          <ul className="mt-6 space-y-4">
            {content.businessItems.map((item) => (
              <li key={item} className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-foreground/85">
                <span aria-hidden="true" className="font-bold text-primary">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-secondary/40 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-foreground">{content.boundaryTitle}</h2>
          <p className="mt-4 leading-relaxed text-foreground/80">{content.boundaryBody}</p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl rounded-3xl border border-primary/30 bg-primary/5 p-7 text-center sm:p-10">
        <h2 className="text-3xl font-bold text-foreground">{content.ctaTitle}</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          {content.ctaBody}
        </p>
        <a
          href={reportMailto}
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {content.ctaLabel}
        </a>
        <p className="mt-3 text-sm text-muted-foreground">{content.ctaNote}</p>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <h2 className="text-3xl font-bold text-foreground">{content.faqTitle}</h2>
        <div className="mt-6 space-y-4">
          {content.faqs.map((faq) => (
            <details key={faq.question} className="rounded-xl border border-border bg-card p-5">
              <summary className="cursor-pointer font-semibold text-foreground">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="mt-16 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-border pt-8 text-sm">
        <Link href={getLocalizedPath(locale, '/games')} className="text-primary hover:underline">
          {content.browseGames}
        </Link>
        <Link href={getLocalizedPath(locale, '/contact')} className="text-primary hover:underline">
          {content.contact}
        </Link>
        <Link href={getLocalizedPath(locale, '/guides')} className="text-primary hover:underline">
          {content.back}
        </Link>
      </footer>
    </article>
  );
}
