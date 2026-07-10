import { Metadata } from 'next';

import { getLocalizedPath, locales } from '@/i18n/config';

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam === 'zh' ? 'zh' : 'en';
  const isZh = locale === 'zh';
  return {
    title: isZh ? '隐私政策 - Luma Game Hub' : 'Privacy Policy - Luma Game Hub',
    description: isZh
      ? '了解 Luma Game Hub 如何收集、使用和保护个人信息、分析数据与广告 Cookie。'
      : 'Learn how Luma Game Hub collects, uses, and protects personal information, analytics data, and advertising cookies.',
    alternates: {
      canonical: getLocalizedPath(locale, '/privacy'),
      languages: {
        ...Object.fromEntries(
          locales.map((loc) => [
            loc === 'zh' ? 'zh-CN' : 'en-US',
            getLocalizedPath(loc, '/privacy'),
          ]),
        ),
        'x-default': '/en/privacy',
      },
    },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">
        {isZh ? '隐私政策' : 'Privacy Policy'}
      </h1>

      <div className="prose prose-indigo max-w-none">
        <p className="text-sm text-gray-500">
          {isZh ? '最后更新：2026年7月3日' : 'Last updated: July 3, 2026'}
        </p>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '1. 信息收集' : '1. Information Collection'}
          </h2>
          <p className="mt-4 text-gray-700">
            {isZh
              ? 'Luma Game Hub 致力于保护用户隐私。我们收集的信息包括：'
              : 'Luma Game Hub is committed to protecting user privacy. The information we collect includes:'}
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
            <li>
              {isZh
                ? '浏览器类型、设备信息、近似地区、访问时间、引荐来源和页面访问等技术信息。'
                : 'Technical information such as browser type, device information, approximate region, visit time, referral source, and page visits.'}
            </li>
            <li>
              {isZh
                ? '游戏使用数据，例如游玩次数、评分、搜索、语言偏好和页面互动。'
                : 'Game usage data such as play count, ratings, searches, language preference, and page interactions.'}
            </li>
            <li>
              {isZh ? 'Cookie、广告 Cookie 和类似技术收集的信息。' : 'Information collected via cookies, advertising cookies, and similar technologies.'}
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '2. 信息使用' : '2. Information Use'}
          </h2>
          <p className="mt-4 text-gray-700">
            {isZh ? '我们使用收集的信息用于：' : 'We use the collected information to:'}
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
            <li>{isZh ? '提供、维护和改进游戏服务。' : 'Provide, maintain, and improve game services.'}</li>
            <li>{isZh ? '分析网站使用情况、游戏热度、加载质量和搜索需求。' : 'Analyze website usage, game popularity, loading quality, and search demand.'}</li>
            <li>{isZh ? '收集反馈并排查游戏加载、搜索和页面体验问题。' : 'Collect feedback and troubleshoot game loading, search, and page experience issues.'}</li>
            <li>{isZh ? '防止欺诈、滥用、机器人请求和安全风险。' : 'Prevent fraud, abuse, bot traffic, and security risks.'}</li>
            <li>{isZh ? '在启用广告时衡量广告表现、控制广告频率并遵守广告平台规则。' : 'Measure ad performance, manage ad frequency, and comply with advertising platform rules when ads are enabled.'}</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '3. Cookie 和广告 Cookie' : '3. Cookies and Advertising Cookies'}
          </h2>
          <p className="mt-4 text-gray-700">
            {isZh
              ? '我们使用 Cookie 来改善用户体验、保存偏好、分析访问和支持网站运营。您可以通过浏览器设置管理 Cookie 偏好，但禁用 Cookie 可能影响部分网站功能。'
              : 'We use cookies to improve user experience, save preferences, analyze visits, and support site operations. You can manage cookie preferences through browser settings, but disabling cookies may affect some site functionality.'}
          </p>
          <p className="mt-3 text-gray-700">
            {isZh
              ? '如果 Luma Game Hub 启用 Google AdSense 或其他广告服务，广告合作伙伴可能使用 Cookie 或类似技术来投放、衡量和限制广告频次。广告不会被放在错误页、空内容页或会明显干扰游戏和导航的位置。'
              : 'If Luma Game Hub enables Google AdSense or other advertising services, advertising partners may use cookies or similar technologies to serve, measure, and limit ad frequency. Ads should not be placed on error pages, empty-content pages, or positions that clearly interfere with gameplay or navigation.'}
          </p>
          <p className="mt-3 text-sm text-gray-600">
            {isZh ? '了解更多：' : 'Learn more:'}{' '}
            <a
              href="https://www.allaboutcookies.org/"
              target="_blank"
              rel="noopener"
              className="text-indigo-600 hover:text-indigo-500"
            >
              {isZh ? 'All About Cookies 指南' : 'All About Cookies guide'}
            </a>
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '4. 第三方服务' : '4. Third-Party Services'}
          </h2>
          <p className="mt-4 text-gray-700">
            {isZh ? '我们可能使用以下第三方服务：' : 'We may use the following third-party services:'}
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
            <li>
              <strong>Google Analytics</strong>:{' '}
              {isZh ? '用于网站分析、流量来源、页面访问和基础站内行为衡量' : 'For website analytics, traffic sources, page views, and basic site behavior measurement'} -{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" className="text-indigo-600 hover:text-indigo-500">
                {isZh ? 'Google 隐私政策' : 'Google Privacy Policy'}
              </a>
            </li>
            <li>
              <strong>Google AdSense</strong>:{' '}
              {isZh
                ? '在获得批准并启用后，用于展示、衡量和管理广告。广告 Cookie 和个性化广告设置由 Google 及用户浏览器/账号偏好控制。'
                : 'If approved and enabled, for serving, measuring, and managing ads. Advertising cookies and personalized ad settings are controlled by Google and by user browser/account preferences.'} -{' '}
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener" className="text-indigo-600 hover:text-indigo-500">
                {isZh ? 'Google 广告技术说明' : 'Google advertising technologies'}
              </a>
            </li>
            <li>
              <strong>Microsoft Clarity</strong>:{' '}
              {isZh
                ? '用于热图、会话回放和体验问题分析。默认不使用广告存储，并以受限分析模式运行，避免弹窗打断用户。'
                : 'For heatmaps, session recordings, and experience diagnostics. It runs by default with ad storage disabled and limited analytics mode, without interrupting visitors with a banner.'} -{' '}
              <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener" className="text-indigo-600 hover:text-indigo-500">
                {isZh ? 'Microsoft 隐私声明' : 'Microsoft Privacy Statement'}
              </a>
            </li>
            <li>
              <strong>Typeform</strong>:{' '}
              {isZh ? '用于收集用户反馈、游戏问题报告和开发者提交' : 'For user feedback, game issue reports, and developer submissions'} -{' '}
              <a href="https://www.typeform.com/privacy-policy/" target="_blank" rel="noopener" className="text-indigo-600 hover:text-indigo-500">
                {isZh ? 'Typeform 隐私政策' : 'Typeform Privacy Policy'}
              </a>
            </li>
            <li>
              <strong>Cloudinary</strong>:{' '}
              {isZh ? '用于托管和优化图片资源' : 'For hosting and optimising media assets'} -{' '}
              <a href="https://cloudinary.com/privacy" target="_blank" rel="noopener" className="text-indigo-600 hover:text-indigo-500">
                {isZh ? 'Cloudinary 隐私政策' : 'Cloudinary Privacy Policy'}
              </a>
            </li>
            <li>
              <strong>Upstash Redis</strong>:{' '}
              {isZh ? '用于缓存和速率限制' : 'For caching and rate limiting'} -{' '}
              <a href="https://upstash.com/docs/general/legal/privacy" target="_blank" rel="noopener" className="text-indigo-600 hover:text-indigo-500">
                {isZh ? 'Upstash 隐私政策' : 'Upstash Privacy Policy'}
              </a>
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '5. 数据安全' : '5. Data Security'}
          </h2>
          <p className="mt-4 text-gray-700">
            {isZh
              ? '我们采取合理的技术和组织措施保护您的信息，但无法保证 100% 安全。请妥善保管您的账户信息。'
              : 'We take reasonable technical and organizational measures to protect your information, but cannot guarantee 100% security. Please keep your account information secure.'}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '6. 儿童隐私' : "6. Children's Privacy"}
          </h2>
          <p className="mt-4 text-gray-700">
            {isZh
              ? '我们的服务面向 13 岁及以上用户。我们不会故意收集 13 岁以下儿童的个人信息。'
              : 'Our services are intended for users aged 13 and above. We do not knowingly collect personal information from children under 13.'}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '7. 您的权利' : '7. Your Rights'}
          </h2>
          <p className="mt-4 text-gray-700">
            {isZh ? '您有权：' : 'You have the right to:'}
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
            <li>{isZh ? '访问您的个人信息' : 'Access your personal information'}</li>
            <li>{isZh ? '更正不准确的信息' : 'Correct inaccurate information'}</li>
            <li>{isZh ? '请求删除您的信息' : 'Request deletion of your information'}</li>
            <li>{isZh ? '反对或限制某些数据处理' : 'Object to or restrict certain data processing'}</li>
            <li>{isZh ? '通过浏览器或 Google 账号设置管理广告和 Cookie 偏好' : 'Manage advertising and cookie preferences through browser or Google account settings'}</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '8. 政策更新' : '8. Policy Updates'}
          </h2>
          <p className="mt-4 text-gray-700">
            {isZh
              ? '我们可能会不时更新本隐私政策。重大变更将在网站上发布通知。'
              : 'We may update this privacy policy from time to time. Significant changes will be posted on the website.'}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '9. 联系我们' : '9. Contact Us'}
          </h2>
          <p className="mt-4 text-gray-700">
            {isZh ? '如有隐私、Cookie 或广告相关问题，请通过以下方式联系我们：' : 'For privacy, cookie, or advertising-related questions, please contact us at:'}
          </p>
          <p className="mt-2 text-gray-700">
            {isZh ? '邮箱' : 'Email'}: <a href="mailto:privacy@lumagamehub.com" className="text-indigo-600 hover:text-indigo-500">privacy@lumagamehub.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
