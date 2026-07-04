import { Metadata } from 'next';
import Link from 'next/link';

import { getLocalizedPath, locales } from '@/i18n/config';

interface AboutPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const locale = params.locale === 'zh' ? 'zh' : 'en';
  const isZh = locale === 'zh';
  return {
    title: isZh ? '关于 Luma Game Hub 与游戏审核标准' : 'About Luma Game Hub and Our Review Standards',
    description: isZh
      ? '了解 Luma Game Hub 如何筛选免费浏览器游戏、复查第三方嵌入体验，并通过广告或订阅支持长期运营。'
      : 'Learn how Luma Game Hub curates free browser games, reviews third-party embed quality, and funds long-term operations through ads or supporter subscriptions.',
    alternates: {
      canonical: getLocalizedPath(locale, '/about'),
      languages: {
        ...Object.fromEntries(
          locales.map((loc) => [
            loc === 'zh' ? 'zh-CN' : 'en-US',
            getLocalizedPath(loc, '/about'),
          ]),
        ),
        'x-default': '/en/about',
      },
    },
  };
}

export default function AboutPage({ params }: AboutPageProps) {
  const isZh = params.locale === 'zh';
  const localizedPath = (pathname = '') => getLocalizedPath(params.locale, pathname);
  const reviewPrinciples = isZh
    ? [
        '优先收录可直接在浏览器打开的 HTML5 / WebGL 游戏，避免要求安装应用或创建账号的体验。',
        '检查启动流程、控制方式、移动端可用性、明显跳转、遮挡弹窗与第三方广告干扰。',
        '为专题页补充人工说明、设备提示、玩法建议和复查说明，而不是只复制第三方简介。',
        '用户反馈的失效、跳转、过度广告或控制问题会进入优先复查队列。',
      ]
    : [
        'We prioritize HTML5 and WebGL games that open directly in the browser without forcing app installs or account walls.',
        'We review launch flow, controls, mobile usability, redirects, disruptive overlays, and third-party ad interruptions.',
        'Guide pages add editorial notes, device caveats, play tips, and recheck context instead of copying third-party descriptions.',
        'User reports about broken embeds, redirects, excessive ads, or controls are prioritized for re-review.',
      ];

  const monetizationPrinciples = isZh
    ? [
        '广告只应支持运营，不应覆盖主要游戏区域、错误页、空白页或让用户误点。',
        '若启用 AdSense，我们会先确保隐私政策、联系页面、内容导航和 ads.txt 准备完整。',
        '订阅或赞助方向会优先提供低干扰体验、精选清单和问题优先复查，而不是出售虚假的游戏所有权。',
      ]
    : [
        'Advertising should support operations without covering gameplay, error pages, empty pages, or misleading users into clicks.',
        'Before enabling AdSense, we keep privacy, contact, navigation, and ads.txt readiness in place.',
        'Supporter or subscription offers should focus on lower-interruption browsing, curated lists, and priority rechecks—not false ownership claims over third-party games.',
      ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-4 text-4xl font-bold text-gray-900">
        {isZh ? '关于 Luma Game Hub' : 'About Luma Game Hub'}
      </h1>
      <p className="text-lg leading-relaxed text-gray-700">
        {isZh
          ? 'Luma Game Hub 是一个面向浏览器玩家的精选小游戏目录。我们的重点不是堆砌数量，而是让用户更快找到可打开、低干扰、适合当前设备的游戏。'
          : 'Luma Game Hub is a curated browser-game directory. Our goal is not to maximize raw volume, but to help visitors quickly find games that open reliably, create fewer interruptions, and fit their current device.'}
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link href={localizedPath('/games')} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
          <div className="text-2xl">🎮</div>
          <h2 className="mt-3 text-lg font-semibold text-gray-900">{isZh ? '浏览游戏库' : 'Browse the library'}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {isZh ? '按分类、标签、热度和新上线状态寻找可直接游玩的网页游戏。' : 'Find instant-play browser games by category, tag, popularity, and freshness.'}
          </p>
        </Link>
        <Link href={localizedPath('/guides')} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
          <div className="text-2xl">📚</div>
          <h2 className="mt-3 text-lg font-semibold text-gray-900">{isZh ? '查看专题指南' : 'Read guide pages'}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {isZh ? '专题页会说明适合场景、设备限制、复查背景和替代选择。' : 'Guides explain use cases, device caveats, review context, and alternative picks.'}
          </p>
        </Link>
        <Link href={localizedPath('/contact')} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
          <div className="text-2xl">💬</div>
          <h2 className="mt-3 text-lg font-semibold text-gray-900">{isZh ? '提交反馈' : 'Send feedback'}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {isZh ? '报告失效游戏、广告干扰、控制问题，或咨询开发者合作。' : 'Report broken games, ad interruptions, control issues, or developer partnerships.'}
          </p>
        </Link>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">
          {isZh ? '我们如何筛选和复查游戏' : 'How we select and recheck games'}
        </h2>
        <p className="mt-4 text-gray-700">
          {isZh
            ? '许多网页小游戏由第三方发布者托管，因此游戏本体、广告、控制方式和可用性可能随时间改变。我们把 Luma 的价值放在筛选、组织、解释和持续复查上。'
            : 'Many browser games are hosted by third-party publishers, so gameplay, ads, controls, and availability can change over time. Luma adds value through selection, organization, explanation, and rechecks.'}
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
          {reviewPrinciples.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">
          {isZh ? '广告、订阅与独立性' : 'Advertising, subscriptions, and independence'}
        </h2>
        <p className="mt-4 text-gray-700">
          {isZh
            ? 'Luma Game Hub 的长期目标是通过合规广告、合作或用户支持维持运营。无论采用哪种方式，页面都必须先对玩家有实际价值。'
            : 'Luma Game Hub is designed to be funded through compliant ads, partnerships, or user support. Any monetization path must come after real usefulness for players.'}
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
          {monetizationPrinciples.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-lg border border-indigo-100 bg-indigo-50 p-6">
        <h2 className="text-xl font-semibold text-indigo-900">
          {isZh ? '开发者、品牌与赞助合作' : 'Developer, brand, and sponsor partnerships'}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-indigo-800">
          {isZh
            ? '如果您想提交 HTML5 游戏、赞助专题、购买品牌曝光，或讨论订阅支持方案，请通过商务邮箱联系。我们会优先考虑内容健康、移动端友好、低干扰且版权清晰的合作。'
            : 'For HTML5 game submissions, sponsored guide ideas, brand placements, or supporter subscription discussions, contact us by business email. We prioritize family-friendly, mobile-aware, lower-interruption, and clearly licensed collaborations.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="mailto:business@lumagamehub.com?subject=Luma%20Game%20Hub%20partnership" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
            business@lumagamehub.com
          </a>
          <Link href={localizedPath('/privacy')} className="rounded-md border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">
            {isZh ? '查看隐私政策' : 'Review privacy policy'}
          </Link>
        </div>
      </section>
    </div>
  );
}
