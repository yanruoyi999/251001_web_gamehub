import { Metadata } from 'next';
import Link from 'next/link';

import { getLocalizedPath, locales } from '@/i18n/config';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam === 'zh' ? 'zh' : 'en';
  const isZh = locale === 'zh';
  return {
    title: isZh ? '联系我们 - Luma Game Hub' : 'Contact Us - Luma Game Hub',
    description: isZh
      ? '联系Luma Game Hub团队 - 反馈建议、商务合作、技术支持'
      : 'Contact Luma Game Hub team - Feedback, partnerships, technical support',
    alternates: {
      canonical: getLocalizedPath(locale, '/contact'),
      languages: {
        ...Object.fromEntries(
          locales.map((loc) => [
            loc === 'zh' ? 'zh-CN' : 'en-US',
            getLocalizedPath(loc, '/contact'),
          ]),
        ),
        'x-default': '/en/contact',
      },
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">
        {isZh ? '联系我们' : 'Contact Us'}
      </h1>

      <div className="prose prose-indigo max-w-none">
        <p className="text-lg text-gray-700">
          {isZh
            ? '感谢您对Luma Game Hub的关注！无论您有任何问题、建议或合作意向，我们都很乐意听取您的意见。'
            : 'Thank you for your interest in Luma Game Hub! Whether you have questions, suggestions, or partnership inquiries, we\'d love to hear from you.'}
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* 一般咨询 */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                <span className="text-2xl">💬</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isZh ? '一般咨询' : 'General Inquiries'}
              </h2>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              {isZh ? '游戏推荐、功能建议、使用问题' : 'Game recommendations, feature suggestions, usage questions'}
            </p>
            <a
              href="mailto:support@lumagamehub.com"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              <span>📧</span> support@lumagamehub.com
            </a>
          </div>

          {/* 商务合作 */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <span className="text-2xl">🤝</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isZh ? '商务合作' : 'Business Partnership'}
              </h2>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              {isZh ? '广告投放、品牌合作、内容授权' : 'Advertising, brand partnerships, content licensing'}
            </p>
            <a
              href="mailto:business@lumagamehub.com"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              <span>📧</span> business@lumagamehub.com
            </a>
          </div>

          {/* 开发者合作 */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <span className="text-2xl">👨‍💻</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isZh ? '开发者合作' : 'Developer Partnership'}
              </h2>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              {isZh ? '游戏提交、技术合作、API对接' : 'Game submissions, technical collaboration, API integration'}
            </p>
            <a
              href="mailto:dev@lumagamehub.com"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              <span>📧</span> dev@lumagamehub.com
            </a>
          </div>

          {/* 技术支持 */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <span className="text-2xl">🔧</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isZh ? '技术支持' : 'Technical Support'}
              </h2>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              {isZh ? '网站Bug反馈、游戏加载问题、浏览器兼容性' : 'Bug reports, game loading issues, browser compatibility'}
            </p>
            <a
              href="mailto:support@lumagamehub.com"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              <span>📧</span> support@lumagamehub.com
            </a>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '📝 提交游戏' : '📝 Submit a Game'}
          </h2>
          <p className="mt-4 text-gray-700">
            {isZh
              ? '如果您是游戏开发者，欢迎将您的HTML5游戏提交到Luma Game Hub平台。我们接受以下类型的游戏：'
              : 'If you\'re a game developer, we welcome your HTML5 games on Luma Game Hub. We accept the following types:'}
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
            <li>{isZh ? 'HTML5/WebGL游戏' : 'HTML5/WebGL games'}</li>
            <li>{isZh ? '支持iframe嵌入' : 'iframe embedding support'}</li>
            <li>{isZh ? '移动端友好' : 'Mobile-friendly'}</li>
            <li>{isZh ? '无恶意代码' : 'No malicious code'}</li>
            <li>{isZh ? '内容健康向上' : 'Family-friendly content'}</li>
          </ul>
          <p className="mt-4 text-gray-700">
            {isZh ? '请发送邮件至' : 'Please email us at'}{' '}
            <a href="mailto:dev@lumagamehub.com" className="text-indigo-600 hover:text-indigo-500">
              dev@lumagamehub.com
            </a>{' '}
            {isZh ? '，并包含以下信息：' : 'with the following information:'}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-gray-600">
            <li>{isZh ? '游戏名称和简介' : 'Game name and description'}</li>
            <li>{isZh ? '游戏演示链接' : 'Game demo link'}</li>
            <li>{isZh ? '开发者信息' : 'Developer information'}</li>
            <li>{isZh ? '截图或宣传视频' : 'Screenshots or promotional video'}</li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '📚 行业资源' : '📚 Industry Resources'}
          </h2>
          <p className="mt-4 text-gray-700">
            {isZh
              ? '想进一步优化您的 HTML5 游戏？以下资源为开发者提供最佳实践、素材与审核指南：'
              : 'Want to refine your HTML5 release? These resources cover best practices, assets, and review guidance:'}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>
              <a
                href="https://developers.google.com/games"
                target="_blank"
                rel="noopener"
                className="text-indigo-600 hover:text-indigo-500"
              >
                {isZh ? 'Google 游戏开发者文档' : 'Google Game Developers documentation'}
              </a>
              {isZh
                ? ' —— 了解跨平台服务、AdSense 合规与盈利策略。'
                : ' — Explore cross-platform services, AdSense compliance, and monetisation strategies.'}
            </li>
            <li>
              <a
                href="https://developer.mozilla.org/en-US/docs/Games"
                target="_blank"
                rel="noopener"
                className="text-indigo-600 hover:text-indigo-500"
              >
                {isZh ? 'MDN Games（Web 游戏开发指南）' : 'MDN Games (Web development guide)'}
              </a>
              {isZh
                ? ' —— 掌握 WebGL 性能优化与输入处理。'
                : ' — Master WebGL performance and input handling.'}
            </li>
            <li>
              <a
                href="https://opengameart.org"
                target="_blank"
                rel="noopener"
                className="text-indigo-600 hover:text-indigo-500"
              >
                {isZh ? 'OpenGameArt（免费游戏素材）' : 'OpenGameArt (Free game assets)'}
              </a>
              {isZh
                ? ' —— 寻找可商用的像素、音效与 UI 资源。'
                : ' — Source CC-licensed sprites, audio, and UI packs.'}
            </li>
            <li>
              <a
                href="https://www.gamedeveloper.com/"
                target="_blank"
                rel="noopener"
                className="text-indigo-600 hover:text-indigo-500"
              >
                {isZh ? 'Game Developer（行业文章与分析）' : 'Game Developer (Industry insights)'}
              </a>
              {isZh
                ? ' —— 跟进运营、变现与设计趋势。'
                : ' — Track business, monetisation, and design trends.'}
            </li>
            <li>
              <a
                href="https://www.gdcvault.com/free/gdc-2019"
                target="_blank"
                rel="noopener"
                className="text-indigo-600 hover:text-indigo-500"
              >
                {isZh ? 'GDC Vault 精选公开课' : 'GDC Vault featured sessions'}
              </a>
              {isZh
                ? ' —— 吸收顶级工作室的设计与市场经验。'
                : ' — Learn from world-class studios on design and market strategy.'}
            </li>
            <li>
              <a
                href="https://gameanalytics.com"
                target="_blank"
                rel="noopener"
                className="text-indigo-600 hover:text-indigo-500"
              >
                {isZh ? 'GameAnalytics（免费游戏数据平台）' : 'GameAnalytics (Free analytics suite)'}
              </a>
              {isZh
                ? ' —— 监控玩家留存与变现表现，指导后续优化。'
                : ' — Track retention and monetisation metrics to inform live ops.'}
            </li>
            <li>
              <a
                href="https://www.indiedb.com"
                target="_blank"
                rel="noopener"
                className="text-indigo-600 hover:text-indigo-500"
              >
                {isZh ? 'Indie DB（独立游戏推广渠道）' : 'Indie DB (Indie promotion hub)'}
              </a>
              {isZh
                ? ' —— 提交作品以获取曝光，并连接独立玩家社区。'
                : ' — Submit builds for exposure and reach engaged indie audiences.'}
            </li>
            <li>
              <a
                href="https://transparency.google/intl/en/our-policies/product-terms/google-adsense/"
                target="_blank"
                rel="noopener"
                className="text-indigo-600 hover:text-indigo-500"
              >
                {isZh ? 'AdSense 计划政策' : 'AdSense Program Policies'}
              </a>
              {isZh
                ? ' —— 确认内容与广告位置符合谷歌最新规范。'
                : ' — Verify your content and ad placements comply with Google rules.'}
            </li>
            <li>
              <a
                href="https://developers.google.com/adsense"
                target="_blank"
                rel="noopener"
                className="text-indigo-600 hover:text-indigo-500"
              >
                {isZh ? 'AdSense 开发者指南' : 'AdSense developer guide'}
              </a>
              {isZh
                ? ' —— 了解 API、自动化报表与与广告单元配置。'
                : ' — Explore APIs, reporting automation, and unit configuration.'}
            </li>
            <li>
              <a
                href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide"
                target="_blank"
                rel="noopener"
                className="text-indigo-600 hover:text-indigo-500"
              >
                {isZh ? 'Google SEO 入门指南' : 'Google SEO starter guide'}
              </a>
              {isZh
                ? ' —— 按官方建议优化结构、标题与内部链接。'
                : ' — Follow official best practices for structure, titles, and internal linking.'}
            </li>
            <li>
              <a
                href="https://pagespeed.web.dev/"
                target="_blank"
                rel="noopener"
                className="text-indigo-600 hover:text-indigo-500"
              >
                {isZh ? 'PageSpeed Insights 性能检测' : 'PageSpeed Insights performance audit'}
              </a>
              {isZh
                ? ' —— 检查核心网页指标并优化加载速度。'
                : ' — Audit Core Web Vitals and improve load speed.'}
            </li>
            <li>
              <a
                href="https://search.google.com/search-console/about"
                target="_blank"
                rel="noopener"
                className="text-indigo-600 hover:text-indigo-500"
              >
                {isZh ? 'Google Search Console 介绍' : 'Google Search Console overview'}
              </a>
              {isZh
                ? ' —— 监控索引状态、搜索展示与抓取问题。'
                : ' — Monitor indexing status, search impressions, and crawl issues.'}
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '🌐 社交媒体' : '🌐 Social Media'}
          </h2>
          <p className="mt-4 text-gray-700">
            {isZh ? '关注我们的社交媒体，获取最新游戏推荐和更新：' : 'Follow us on social media for latest game recommendations and updates:'}
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <span>📦</span> GitHub
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <span>🐦</span> Twitter
            </a>
          </div>
        </section>

        <section className="mt-12 rounded-lg border border-blue-100 bg-blue-50 p-6">
          <h2 className="text-xl font-semibold text-blue-900">
            ⏰ {isZh ? '响应时间' : 'Response Time'}
          </h2>
          <p className="mt-3 text-sm text-blue-800">
            {isZh
              ? '我们通常在1-3个工作日内回复邮件。紧急问题请在邮件标题中注明"紧急"。'
              : 'We typically respond to emails within 1-3 business days. For urgent matters, please mark "URGENT" in the subject line.'}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '其他链接' : 'Other Links'}
          </h2>
          <div className="mt-4 space-y-2">
            <p>
              <Link href={`/${locale}/about`} className="text-indigo-600 hover:text-indigo-500">
                {isZh ? '→ 关于我们' : '→ About Us'}
              </Link>
            </p>
            <p>
              <Link href={`/${locale}/privacy`} className="text-indigo-600 hover:text-indigo-500">
                {isZh ? '→ 隐私政策' : '→ Privacy Policy'}
              </Link>
            </p>
            <p>
              <Link href={`/${locale}/games`} className="text-indigo-600 hover:text-indigo-500">
                {isZh ? '→ 浏览游戏' : '→ Browse Games'}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
