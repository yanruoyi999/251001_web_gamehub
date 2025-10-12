import { Metadata } from 'next';

interface PrivacyPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const isZh = params.locale === 'zh';
  return {
    title: isZh ? '隐私政策 - GameHub' : 'Privacy Policy - GameHub',
    description: isZh
      ? '了解GameHub如何收集、使用和保护您的个人信息'
      : 'Learn how GameHub collects, uses, and protects your personal information',
  };
}

export default function PrivacyPage({ params }: PrivacyPageProps) {
  const isZh = params.locale === 'zh';

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">
        {isZh ? '隐私政策' : 'Privacy Policy'}
      </h1>

      <div className="prose prose-indigo max-w-none">
        <p className="text-sm text-gray-500">
          {isZh ? '最后更新：2025年1月' : 'Last updated: January 2025'}
        </p>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '1. 信息收集' : '1. Information Collection'}
          </h2>
          <p className="mt-4 text-gray-700">
            {isZh
              ? 'GameHub致力于保护用户隐私。我们收集的信息包括：'
              : 'GameHub is committed to protecting user privacy. The information we collect includes:'}
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
            <li>
              {isZh
                ? '浏览器类型、设备信息和访问时间等技术信息'
                : 'Technical information such as browser type, device information, and access time'}
            </li>
            <li>
              {isZh
                ? '游戏使用数据（如游玩次数、评分）'
                : 'Game usage data (such as play count, ratings)'}
            </li>
            <li>
              {isZh ? 'Cookie和类似技术收集的信息' : 'Information collected via cookies and similar technologies'}
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
            <li>{isZh ? '提供和改进游戏服务' : 'Provide and improve game services'}</li>
            <li>{isZh ? '分析网站使用情况' : 'Analyze website usage'}</li>
            <li>{isZh ? '展示相关广告（通过Google AdSense）' : 'Display relevant ads (via Google AdSense)'}</li>
            <li>{isZh ? '防止欺诈和滥用' : 'Prevent fraud and abuse'}</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '3. Cookies使用' : '3. Cookie Usage'}
          </h2>
          <p className="mt-4 text-gray-700">
            {isZh
              ? '我们使用Cookie来改善用户体验。您可以通过浏览器设置管理Cookie偏好，但禁用Cookie可能影响网站功能。'
              : 'We use cookies to improve user experience. You can manage cookie preferences through browser settings, but disabling cookies may affect website functionality.'}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '4. 第三方服务' : '4. Third-Party Services'}
          </h2>
          <p className="mt-4 text-gray-700">
            {isZh ? '我们使用以下第三方服务：' : 'We use the following third-party services:'}
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
            <li>
              <strong>Google AdSense</strong>:{' '}
              {isZh ? '用于展示广告' : 'For displaying advertisements'} -{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener"
                className="text-indigo-600 hover:text-indigo-500"
              >
                {isZh ? 'Google隐私政策' : 'Google Privacy Policy'}
              </a>
            </li>
            <li>
              <strong>Google Analytics</strong>:{' '}
              {isZh ? '用于网站分析' : 'For website analytics'} -{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener"
                className="text-indigo-600 hover:text-indigo-500"
              >
                {isZh ? 'Google隐私政策' : 'Google Privacy Policy'}
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
              ? '我们采取合理的技术和组织措施保护您的信息，但无法保证100%安全。请妥善保管您的账户信息。'
              : 'We take reasonable technical and organizational measures to protect your information, but cannot guarantee 100% security. Please keep your account information secure.'}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '6. 儿童隐私' : '6. Children\'s Privacy'}
          </h2>
          <p className="mt-4 text-gray-700">
            {isZh
              ? '我们的服务面向13岁及以上用户。我们不会故意收集13岁以下儿童的个人信息。'
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
            {isZh ? '如有隐私相关问题，请通过以下方式联系我们：' : 'For privacy-related questions, please contact us at:'}
          </p>
          <p className="mt-2 text-gray-700">
            {isZh ? '邮箱' : 'Email'}: <a href="mailto:privacy@gamehub.com" className="text-indigo-600 hover:text-indigo-500">privacy@gamehub.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
