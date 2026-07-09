import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLocalizedPath, locales, type Locale } from '@/i18n/config';
import { buildAbsoluteUrl, DEFAULT_OPEN_GRAPH_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo';

export const dynamic = 'force-static';
export const revalidate = 86400;

interface PageProps {
  params: { locale: string };
}

const sections = {
  en: [
    {
      title: 'Quick answer: control the boost before you control the speed',
      body:
        'Blumgi Rocket is easier when you treat the rocket as a physics tool, not a normal race car. Short boosts help you set the car angle, while long boosts are best saved for ramps, wide gaps, and straight recovery sections.',
      bullets: [
        'Tap boost before a ramp to set your takeoff angle instead of blasting at the last second.',
        'Release boost before landing so the wheels settle flat instead of bouncing into a flip.',
        'If a jump keeps failing, reduce speed first; most crashes come from too much boost, not too little.',
      ],
    },
    {
      title: 'How to read each ramp',
      body:
        'Before using boost, look at the ramp shape. A steep ramp wants a short launch and early release. A long ramp usually wants steady acceleration. A broken or floating platform wants patience because landing flat matters more than reaching maximum speed.',
      bullets: [
        'Steep ramps: short boost, then release early in the air.',
        'Long ramps: build speed before the ramp and avoid turning in midair.',
        'Tiny platforms: land slow and level, then boost again after the car stabilizes.',
      ],
    },
    {
      title: 'Landing tips for hard stages',
      body:
        'The landing is where most Blumgi Rocket runs fail. If the car lands nose-first, release boost earlier. If it lands on the rear and flips backward, add a tiny correction before touchdown. The goal is not a perfect stunt; the goal is four wheels touching the next surface.',
      bullets: [
        'Watch the nose angle, not only the distance of the jump.',
        'Use tiny midair taps instead of holding boost until the car spins.',
        'After landing, pause for half a beat before the next full boost.',
      ],
    },
    {
      title: 'When to switch to a similar game',
      body:
        'If you like Blumgi Rocket for boost momentum, try Drive Mad for heavier throttle control. If you like the correction practice, try Balance Duel. If you like hard retries but want platforming instead of vehicles, try Big Tower Tiny Square.',
    },
  ],
  zh: [
    {
      title: '快速答案：先控制推进，再追求速度',
      body:
        'Blumgi Rocket 不适合当普通赛车玩。你要把火箭推进当成物理工具：短促推进用来调整车身角度，长按推进只适合坡道、大缺口和直线恢复。',
      bullets: [
        '上坡前轻点推进，先把起跳角度摆好，不要临到坡口才猛冲。',
        '落地前松开推进，让轮子先贴住地面，避免弹起来翻车。',
        '如果同一个跳跃反复失败，先减速；很多失败不是速度不够，而是推进过头。',
      ],
    },
    {
      title: '怎么读懂每一种坡道',
      body:
        '用推进之前，先看坡道形状。陡坡需要短促起跳和提前松手；长坡适合提前加速；破碎平台和悬空平台则更看重平稳落地，而不是冲到最快。',
      bullets: [
        '陡坡：短推进，起跳后早点松。',
        '长坡：进坡前积累速度，空中少乱修正。',
        '小平台：慢一点、平一点落地，车身稳定后再推进。',
      ],
    },
    {
      title: '难关落地技巧',
      body:
        'Blumgi Rocket 多数失败发生在落地。如果车头先砸地，说明你松推进太晚；如果车尾着地后后翻，说明落地前需要一点小修正。目标不是做漂亮特技，而是四个轮子稳稳接到下一段路。',
      bullets: [
        '看车头角度，不要只盯跳跃距离。',
        '空中用轻点修正，不要一直按到车身乱转。',
        '落地后等半拍，再进入下一次长推进。',
      ],
    },
    {
      title: '什么时候换一款类似游戏',
      body:
        '如果你喜欢 Blumgi Rocket 的推进和惯性，可以去玩 Drive Mad 练更重的油门控制；如果你喜欢平衡修正，试 Balance Duel；如果你喜欢高难重试但想换成平台跳跃，试 Big Tower Tiny Square。',
    },
  ],
};

const relatedLinks = [
  { href: '/games/blumgi-rocket', label: 'Blumgi Rocket' },
  { href: '/guides/drive-mad-walkthrough', label: 'Drive Mad Walkthrough' },
  { href: '/games/drive-mad', label: 'Drive Mad' },
  { href: '/games/balance-duel', label: 'Balance Duel' },
  { href: '/games/big-tower-tiny-square', label: 'Big Tower Tiny Square' },
  { href: '/guides/quick-play-guide', label: 'Quick Play Guide' },
];

const faqs = {
  en: [
    {
      question: 'How do you get better at Blumgi Rocket?',
      answer:
        'Use short boost taps to control the car angle, release boost before landing, and treat each ramp as a physics puzzle rather than a normal race section.',
    },
    {
      question: 'Why does the car flip after landing?',
      answer:
        'The car usually flips because the boost is held too long or the nose angle is too steep. Release earlier and aim for a flatter four-wheel landing.',
    },
    {
      question: 'What should I play after Blumgi Rocket?',
      answer:
        'Try Drive Mad if you want more throttle-and-balance driving, Balance Duel for correction practice, or Big Tower Tiny Square for hard fast-retry platforming.',
    },
  ],
  zh: [
    {
      question: 'Blumgi Rocket 怎么玩得更稳?',
      answer:
        '用短促推进控制车身角度，落地前松开推进，并把每个坡道当成物理解谜，而不是普通赛车路段。',
    },
    {
      question: '为什么车子一落地就翻?',
      answer:
        '通常是推进按太久，或者车头角度太陡。早点松推进，让车身更平，尽量四轮同时接地。',
    },
    {
      question: '玩完 Blumgi Rocket 还适合玩什么?',
      answer:
        '想继续练油门和平衡可以玩 Drive Mad；想练小幅修正可以玩 Balance Duel；想换成高难平台重试可以玩 Big Tower Tiny Square。',
    },
  ],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const locale = (params.locale as Locale) ?? 'zh';
  const isZh = locale === 'zh';
  const path = getLocalizedPath(locale, '/guides/blumgi-rocket-tips');
  const title = isZh
    ? 'Blumgi Rocket 攻略：推进、落地与难关技巧'
    : 'Blumgi Rocket Guide: Boost, Landing, and Hard Level Tips';
  const description = isZh
    ? 'Blumgi Rocket 怎么玩更稳？这篇长尾攻略讲清推进节奏、坡道判断、落地角度和难关重试技巧，并推荐类似 Drive Mad 的物理驾驶游戏。'
    : 'A practical Blumgi Rocket guide covering boost timing, ramp reading, landing control, hard level tips, and similar physics-driving games like Drive Mad.';

  return {
    title,
    description,
    keywords: isZh
      ? ['Blumgi Rocket 攻略', 'Blumgi Rocket 技巧', 'Blumgi Rocket 怎么玩', '物理驾驶小游戏']
      : ['Blumgi Rocket guide', 'Blumgi Rocket tips', 'Blumgi Rocket how to play', 'physics driving games'],
    alternates: {
      canonical: path,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc === 'zh' ? 'zh-CN' : 'en-US',
          getLocalizedPath(loc, '/guides/blumgi-rocket-tips'),
        ]),
      ),
    },
    openGraph: {
      title,
      description,
      url: path,
      type: 'article',
      images: DEFAULT_OPEN_GRAPH_IMAGES,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: DEFAULT_TWITTER_IMAGES,
    },
  };
}

export default function BlumgiRocketTipsPage({ params }: PageProps) {
  const locale = (params.locale as Locale) ?? 'zh';
  const isZh = locale === 'zh';
  const content = isZh ? sections.zh : sections.en;
  const faqItems = isZh ? faqs.zh : faqs.en;
  const pageUrl = buildAbsoluteUrl(getLocalizedPath(locale, '/guides/blumgi-rocket-tips'));
  const headline = isZh
    ? 'Blumgi Rocket 攻略：推进、落地与难关技巧'
    : 'Blumgi Rocket Guide: Boost, Landing, and Hard Level Tips';
  const description = isZh
    ? '这篇攻略把 Blumgi Rocket 的核心拆成三个动作：起跳前怎么推进、空中怎么修正、落地前什么时候松手。'
    : 'This guide breaks Blumgi Rocket into three skills: when to boost before takeoff, how to correct in the air, and when to release before landing.';
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline,
      description,
      mainEntityOfPage: pageUrl,
      inLanguage: isZh ? 'zh-CN' : 'en-US',
      author: {
        '@type': 'Organization',
        name: 'Luma Game Hub Editorial',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Luma Game Hub',
        url: buildAbsoluteUrl(getLocalizedPath(locale)),
      },
      articleSection: 'Browser Games',
      keywords: isZh
        ? 'Blumgi Rocket 攻略, Blumgi Rocket 技巧, 物理驾驶小游戏'
        : 'Blumgi Rocket guide, Blumgi Rocket tips, physics driving games',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <article className="mx-auto w-full max-w-5xl px-6 py-12">
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href={getLocalizedPath(locale, '/games/blumgi-rocket')} className="hover:text-primary">
          {isZh ? '← 返回 Blumgi Rocket 游戏页' : '← Back to Blumgi Rocket'}
        </Link>
      </nav>

      <header className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Blumgi Rocket guide</p>
        <h1 className="mt-2 text-4xl font-bold text-foreground">{headline}</h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">{description}</p>
      </header>

      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {isZh ? '快速答案' : 'Quick answer'}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          {content[0].title}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-foreground/90">{content[0].body}</p>
        {content[0].bullets ? (
          <ul className="mt-4 grid gap-2 text-sm text-foreground/80 md:grid-cols-3">
            {content[0].bullets.map((item) => (
              <li key={item} className="rounded-xl border border-border bg-background/80 p-3">
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm font-medium">
          <a href="#tips" className="rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-sm transition hover:bg-primary/90">
            {isZh ? '看完整技巧' : 'Read all tips'}
          </a>
          <Link href={getLocalizedPath(locale, '/games/blumgi-rocket')} className="rounded-full border border-primary/30 bg-background px-4 py-2 text-primary transition hover:bg-primary/10">
            {isZh ? '先打开游戏页' : 'Open the game'}
          </Link>
          <a href="#related" className="rounded-full border border-border bg-background px-4 py-2 text-foreground transition hover:bg-secondary">
            {isZh ? '看相关游戏' : 'Related games'}
          </a>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-4 text-base leading-relaxed text-foreground/90">
        <p>
          {isZh
            ? 'Blumgi Rocket 和 Drive Mad 属于同一类让人反复重试的物理驾驶游戏。它们看起来像赛车，真正考验的却是角度、惯性、落地和什么时候松手。'
            : 'Blumgi Rocket and Drive Mad belong to the same retry-heavy physics-driving family. They look like racing games, but the real test is angle, momentum, landing control, and knowing when to release.'}
        </p>
        <p>
          {isZh
            ? '如果你只会一直按推进，很快就会发现车子不是飞过头，就是落地翻车。下面按坡道、空中修正和落地三个环节拆解。'
            : 'If you only hold boost, the car will either overshoot or flip on landing. The sections below break the game into ramp reading, midair correction, and landing control.'}
        </p>
      </section>

      <section id="tips" className="mt-12 space-y-10 scroll-mt-24">
        {content.slice(1).map((section) => (
          <div key={section.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>
            <p className="mt-3 text-base text-foreground/90">{section.body}</p>
            {section.bullets ? (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </section>

      <section id="related" className="mt-16 rounded-2xl border border-primary/20 bg-primary/5 p-6 scroll-mt-24">
        <h2 className="text-2xl font-semibold text-foreground">
          {isZh ? '推荐的站内浏览路径' : 'Recommended internal path'}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          {isZh
            ? '先看攻略，再进入游戏页试玩；如果你喜欢同类手感，可以继续看 Drive Mad、Balance Duel 和 Big Tower Tiny Square。'
            : 'Read the guide, open the game page, then continue to Drive Mad, Balance Duel, or Big Tower Tiny Square if you like the same physics-retry feel.'}
        </p>
        <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
          {relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={getLocalizedPath(locale, link.href)}
              className="rounded-xl border border-border bg-background p-4 font-medium text-primary transition hover:bg-secondary"
            >
              {link.label} →
            </Link>
          ))}
        </div>
      </section>

      <section id="faq" className="mt-16 rounded-2xl border border-border bg-secondary p-8 scroll-mt-24">
        <h2 className="text-2xl font-semibold text-foreground">
          {isZh ? '常见问题' : 'Frequently Asked Questions'}
        </h2>
        <dl className="mt-6 space-y-6">
          {faqItems.map((faq) => (
            <div key={faq.question} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <dt className="text-base font-semibold text-foreground">{faq.question}</dt>
              <dd className="mt-2 text-sm text-foreground/90">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12 text-center">
        <Button asChild size="lg" className="bg-primary text-primary-foreground shadow-md transition hover:bg-primary/90">
          <Link href={getLocalizedPath(locale, '/games/blumgi-rocket')}>
            {isZh ? '打开 Blumgi Rocket 游戏页' : 'Open Blumgi Rocket'}
          </Link>
        </Button>
        <p className="mt-3 text-sm text-muted-foreground">
          {isZh
            ? '这篇攻略用于承接 Blumgi Rocket 长尾搜索，并把用户导向相关站内游戏和攻略。'
            : 'This guide captures Blumgi Rocket long-tail searches and routes users into related internal games and guides.'}
        </p>
      </section>
    </article>
  );
}
