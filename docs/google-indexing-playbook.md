# Google Indexing Playbook

> 快速让生产站点 `25101301` 收录的执行手册，可直接按顺序落实。

## 1. 上线前本地/预览检查
- 确认 `.env` / 部署环境变量里把 `NEXT_PUBLIC_APP_URL`、`NEXT_PUBLIC_SITE_URL` 或 `SITE_URL` 设为真实 HTTPS 站点，例如 `https://25101301.com`。缺省值会导致 sitemap、canonical、OpenGraph 用到 `localhost`。
- 在本地运行 `pnpm lint && pnpm test` 保证构建无阻；通过 `pnpm build && pnpm start` 打开 `/zh`、`/zh/games`、`/zh/search`、`/zh/guides`、`/zh/privacy`、`/zh/about`、`/zh/contact` 等关键路由，确保 200 状态且无 `noindex` 元标签。
- 使用浏览器 SEO 工具（Lighthouse、Ahrefs toolbar 等）确认 `<link rel="canonical">` 指向生产域名；核对结构化数据（`RootLayout` 已输出 `WebSite` JSON-LD）。

## 2. 部署后立即执行
1. **验证域名属性**：在 Google Search Console 新增 `https://25101301.com` 域属性；推荐 DNS TXT 验证，避免未来换服务器反复验证。若使用 Vercel，可在项目设置 > Domains 找到自动生成的 TXT 值。
2. **上传验证文件（可选）**：如需 HTML 验证，把 Google 提供的 `googleXXXXXXXX.html` 文件放到 `public/` 并重新部署。
3. **提交 sitemap**：部署完成后访问 `https://25101301.com/sitemap.xml` 验证为 200；在 Search Console → Sitemap 中提交该地址。现在 sitemap 已包含 `/` 与 `/zh/...` 等页面，Google 会优先抓取。
4. **主动请求索引关键页**：对首页 `/`、主要频道页 `/zh/games`、高价值落地页 `/zh/guides/<slug>` 逐个使用 URL 检查工具点击“请求编入索引”。首次上线建议至少覆盖 10–20 个入口页。

## 3. Search Console API 自动化
- 创建 Google Cloud 项目，启用 *Search Console API*，并在 OAuth 同意屏幕添加自己为测试用户。
- 使用 OAuth Client (Desktop) 获取 `client_id`/`client_secret`，scope 选择 `https://www.googleapis.com/auth/webmasters`.
- 利用脚本（Node/TS）调用：
  ```bash
  pnpm add googleapis
  ```
  ```ts
  import { google } from 'googleapis';

  async function submitSitemap() {
    const auth = new google.auth.OAuth2({ clientId, clientSecret, redirectUri });
    auth.setCredentials({ refresh_token: process.env.GSC_REFRESH_TOKEN });
    const webmasters = google.webmasters({ version: 'v3', auth });
    await webmasters.sitemaps.submit({
      siteUrl: 'https://25101301.com',
      feedpath: 'https://25101301.com/sitemap.xml',
    });
  }
  ```
- 结合 cron（如 Vercel Cron Jobs）每日刷新 sitemap 或监控 `searchanalytics.query` 数据，确认 impressions/clicks 变化。
- 需注意：Google 不允许用 API 主动推送普通网页索引，只有招聘/直播可用 Indexing API；普通页面仍需等待抓取。

## 4. 站内信号强化
- 确保导航、页脚互链，避免孤立页面；对最新游戏/攻略建立专题页，并从首页推荐。
- 为 `/zh/guides` 等内容页加入结构化数据（FAQ、Article）可提升抓取优先级。
- 若有多语言内容，把 `/en/...` 链接加入首页或语言切换器，并在页面头部输出 `hreflang`（Next `metadata.alternates.languages` 已自动处理，确认 `NEXT_PUBLIC_APP_URL` 正确即可生效）。
- 配置服务器返回 `Last-Modified` / `ETag`；Next.js 在生产模式默认启用。适当更新内容时记得触发重新部署，让 sitemap 的 `lastModified` 更新。

## 5. 外部信号与监控
- 在社交媒体、开发者社区发布上线公告，至少获取几条外部链接（Twitter、知乎、少数派、Product Hunt 等）。外链加速发现。
- 用站点日志或第三方监控（Better Stack、Datadog）观察 `Googlebot` User-Agent 的访问频率；首次抓取通常在提交 sitemap 后 24–48 小时内。
- 每天在 Search Console → 抓取统计查看是否出现错误（5xx、403、DNS）。及时修正可避免抓取预算被浪费。

## 6. 常见排查
- 若 72 小时仍未收录：检查是否仍在开发密码保护、Cloudflare 阻断、返回 4xx/5xx、或被 `robots.txt` 限制。`app/robots.ts` 已允许所有路径，仅限制 `/admin` 与 `/api`。
- 使用 `site:25101301.com` 搜索判断收录进展。若仅部分页面收录，优先补充这些页面的内部链接与文字内容，并减少 iframe-only 内容。
- 确保移动端体验良好，避免通过 JS 延迟渲染主要文本；Googlebot 以移动端为主。

执行完上述步骤后，通常 1–2 天可看到初步收录，持续更新内容与外链会让抓取频率稳定提升。
