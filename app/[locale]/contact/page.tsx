import { Metadata } from 'next';
import Link from 'next/link';

interface ContactPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const isZh = params.locale === 'zh';
  return {
    title: isZh ? '联系我们 - GameHub' : 'Contact Us - GameHub',
    description: isZh
      ? '联系GameHub团队 - 反馈建议、商务合作、技术支持'
      : 'Contact GameHub team - Feedback, partnerships, technical support',
  };
}

export default function ContactPage({ params }: ContactPageProps) {
  const isZh = params.locale === 'zh';

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">
        {isZh ? '联系我们' : 'Contact Us'}
      </h1>

      <div className="prose prose-indigo max-w-none">
        <p className="text-lg text-gray-700">
          {isZh
            ? '感谢您对GameHub的关注！无论您有任何问题、建议或合作意向，我们都很乐意听取您的意见。'
            : 'Thank you for your interest in GameHub! Whether you have questions, suggestions, or partnership inquiries, we\'d love to hear from you.'}
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
              href="mailto:support@gamehub.com"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              <span>📧</span> support@gamehub.com
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
              href="mailto:business@gamehub.com"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              <span>📧</span> business@gamehub.com
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
              href="mailto:dev@gamehub.com"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              <span>📧</span> dev@gamehub.com
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
              href="mailto:support@gamehub.com"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              <span>📧</span> support@gamehub.com
            </a>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isZh ? '📝 提交游戏' : '📝 Submit a Game'}
          </h2>
          <p className="mt-4 text-gray-700">
            {isZh
              ? '如果您是游戏开发者，欢迎将您的HTML5游戏提交到GameHub平台。我们接受以下类型的游戏：'
              : 'If you\'re a game developer, we welcome your HTML5 games on GameHub. We accept the following types:'}
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
            <a href="mailto:dev@gamehub.com" className="text-indigo-600 hover:text-indigo-500">
              dev@gamehub.com
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
              ? '想进一步优化您的 HTML5 游戏？以下资源为开发者提供最佳实践与审核指南：'
              : 'Want to refine your HTML5 release? This resource shares best practices and review guidelines:'}
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
              <Link href={`/${params.locale}/about`} className="text-indigo-600 hover:text-indigo-500">
                {isZh ? '→ 关于我们' : '→ About Us'}
              </Link>
            </p>
            <p>
              <Link href={`/${params.locale}/privacy`} className="text-indigo-600 hover:text-indigo-500">
                {isZh ? '→ 隐私政策' : '→ Privacy Policy'}
              </Link>
            </p>
            <p>
              <Link href={`/${params.locale}/games`} className="text-indigo-600 hover:text-indigo-500">
                {isZh ? '→ 浏览游戏' : '→ Browse Games'}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
