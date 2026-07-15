# Luma Game Hub 接入 Google AdSense 端到端 SOP

更新时间：2026-07-01
适用项目：`/Users/yanruoyi/ai-native/active/251001_web_游戏聚合网站`
线上主域名：`https://www.lumagamehub.com`

## 0. 总原则

AdSense 不是“装一段广告代码”就结束。对游戏聚合站来说，真正流程是：

```text
可合法展示的游戏内容
-> 可索引、可玩、可导航的网站
-> 有原创说明/攻略/分类价值
-> 有基础信任页和隐私披露
-> 有真实搜索/访问数据
-> 申请 AdSense site review
-> 通过后接 ads.txt、广告位、CMP、持续合规巡检
```

Google 官方核心要求包括：站点要有高质量、原创、能吸引用户的内容；遵守 AdSense Program Policies / Google Publisher Policies；申请人符合年龄等账号要求；AdSense crawler 能访问站点；广告展示不能制造误点、诱导点击或放在不合适的位置。

官方没有公开保证“多少篇文章、多少页面、多少流量一定通过”。本文中的页面数、时间和数据门槛是 Luma 自己的内部质量线，不是 Google 官方承诺。

## 1. Phase 1：立项和内容合法性

目标：先确认这个游戏聚合站能长期被广告网络接受，不要一开始就埋版权、低质或违规内容风险。

### 1.1 游戏来源规则

每个游戏进入站点前，必须记录：

- 游戏名
- slug
- iframe / playable URL
- source URL
- developer name
- developer URL
- thumbnail / screenshot 来源
- 是否可嵌入
- 是否有明显版权、商标、盗版、ROM、成人、赌博、仇恨或危险内容风险

默认不收：

- 未授权 ROM / 模拟器盗版
- 明显复制知名 IP 的山寨游戏
- 成人、赌博、血腥猎奇、仇恨或极端暴力内容
- 需要下载可执行文件的游戏
- iframe 中弹大量广告、诱导下载或跳转的游戏
- 无法稳定加载、移动端不可玩的游戏

### 1.2 游戏聚合站的内容定位

Luma 不能只是 iframe 列表。每个重点游戏页至少要有：

- 游戏简介：不是复制来源站原文。
- How to play：操作、目标、胜利条件。
- Controls：键盘 / 鼠标 / 触屏。
- Tips：2-5 条真实玩法建议。
- FAQ：围绕搜索意图回答。
- Similar games：站内相关游戏。
- Category / tags：进入合集页。
- 真实截图或可识别缩略图。
- 官方来源或开发者链接。

内部目标：

- 首批申请前至少 30 个质量合格游戏详情页。
- 至少 5-10 个有真实搜索意图的 guide / collection 页面。
- 首页、分类页、标签页、游戏详情页、攻略页之间有清晰内链。

## 2. Phase 2：技术底座

目标：让 Google crawler、AdSense crawler 和真实用户都能稳定访问。

### 2.1 域名和部署

必须完成：

- 主域名固定为 `https://www.lumagamehub.com`。
- 根域 `https://lumagamehub.com` 永久跳转到 `www`。
- 旧域名不再作为 production alias。
- HTTPS 正常。
- Vercel 最新 production deployment 为 `Ready`。
- 生产首页、游戏列表、游戏详情、攻略、分类、标签、政策页均 200。

验收命令示例：

```bash
curl -I https://www.lumagamehub.com
curl -I https://www.lumagamehub.com/en
curl -I https://www.lumagamehub.com/en/games
curl -I https://www.lumagamehub.com/en/guides/google-snake-mods
curl -I https://www.lumagamehub.com/robots.txt
curl -I https://www.lumagamehub.com/sitemap.xml
```

### 2.2 SEO 基础

必须确认：

- `robots.txt` 允许核心页面抓取，屏蔽 `/admin`、`/api` 等无内容路径。
- `robots.txt` 包含 sitemap URL。
- `sitemap.xml` 包含首页、游戏页、分类页、标签页、攻略页、信任页。
- canonical 不指向重定向路径。
- `hreflang` 中英文路径正确。
- 默认中文路径不泄漏 `/zh` 旧规范 URL。
- 每页 title / description 和实际内容匹配。
- OG / Twitter 图存在，不是空图或破图。
- 结构化数据合理使用：`WebSite`、`BreadcrumbList`、`VideoGame` / `Game`、`Article`、`FAQPage`。

当前已知状态：

- Luma 已有 GSC domain property。
- sitemap 已提交。
- `gamepapa.online` 已从生产 alias 移除。
- `/en/guides/google-snake-mods` 已从 `private no-store` 修成可缓存。
- 部分游戏详情页仍需逐个根据真实访问优先处理 no-store / MISS。

### 2.3 性能和可玩性

AdSense 审核不只看技术分，但页面卡、空、不可玩会显著降低站点质量。

申请前必须抽样：

- 首页移动端和桌面端无明显布局错位。
- 游戏 iframe 能加载。
- Play 按钮不诱导误点广告。
- 首屏有内容，不是只有广告位或空壳。
- 游戏页没有全屏弹窗挡住内容。
- Vercel runtime 近 24h 无持续 5xx。
- 高访问页不要每次请求都慢查 DB / Redis。

重点抽样页面：

- `/en`
- `/en/games`
- `/en/guides/google-snake-mods`
- `/en/games/solitaire`
- `/en/guides/adam-and-eve-walkthrough`
- `/en/guides/best-free-iphone-games`
- 根据 GSC / Vercel 最新数据新增页面

## 3. Phase 3：信任页和合规页

目标：让用户和审核员知道站点是谁、做什么、怎么联系、怎么处理数据。

必须可访问：

- `/en/about`
- `/en/contact`
- `/en/privacy`
- 中文对应页面

### 3.1 About

必须说明：

- Luma Game Hub 是精选免费浏览器游戏站。
- 游戏可在线玩，不要求下载。
- 网站如何挑选游戏。
- 对开发者提交游戏的态度。
- 不承诺拥有所有第三方游戏版权。
- 有清晰站内导航到游戏、攻略、分类和联系方式。

### 3.2 Contact

必须包含：

- 联系邮箱。
- 游戏提交说明。
- 版权/移除请求入口。
- 合作和反馈入口。
- 不使用虚假的公司、地址或团队信息。

### 3.3 Privacy

必须披露：

- Vercel Analytics / Microsoft Clarity / Google Analytics（如果启用）/ Google AdSense（启用后）。
- cookie、本地存储或类似技术。
- 广告和第三方服务可能收集的信息。
- 用户联系邮箱。
- 未成年人和家庭向内容的基本说明。
- 最后更新时间。

## 4. Phase 4：数据与监控

目标：在申请前证明站点不是空壳，且能发现问题。

### 4.1 必接数据源

- Google Search Console
- Vercel Analytics
- Microsoft Clarity
- Vercel runtime logs
- 本地 `ops/daily-growth` 复盘文件

可选：

- GA4：不是必需。如果没有明确用途，可以继续以 Vercel Analytics + Clarity 为主。

### 4.2 每日检查

继续使用 `3-seo` 自动化。每天记录：

- GSC clicks / impressions / CTR / avg position
- top queries
- top pages
- Vercel visitors / page views / referrers / countries / devices
- Clarity non-bot sessions / bots excluded / recordings / heatmaps / dead clicks
- runtime errors / 404 / slow pages
- 可玩性抽样
- sitemap / robots / canonical 抽样

没有读到后台数据时，必须写“未获取到”，不能伪造。

### 4.3 申请 AdSense 前内部数据门槛

这些不是 Google 官方要求，是 Luma 内部建议门槛：

- 主域名稳定运行至少 2-4 周。
- GSC 至少能看到自然曝光，最好已有自然点击。
- Clarity 能看到 non-bot sessions。
- Vercel Analytics 能看到真实访客和页面访问。
- 高曝光页面不出现大面积 404 / 5xx。
- 至少 30 个高质量游戏页 + 5-10 个 guide / collection 页。
- About / Contact / Privacy 均线上可访问。
- 首页、游戏列表、至少 10 个详情页、至少 3 个攻略页移动端可用。

当前 Luma 已有真实 SEO 信号：本地记录显示 GSC 最新已存为 16 clicks / 930 impressions，Clarity 最新已存为 4 个 non-bot sessions。后续申请前要读取最新后台数据确认趋势。

## 5. Phase 5：AdSense 申请前总检查

申请前逐项确认。

### 5.1 官方资格

- 申请人年满 18 岁。
- 申请人拥有并控制网站。
- 可以改网站 HTML `<head>`。
- 网站内容符合 AdSense Program Policies 和 Google Publisher Policies。
- 站点不在登录墙后。
- robots.txt 不阻止 AdSense crawler。

### 5.2 内容质量

- 无空页面、占位页面、coming soon 页面。
- 无复制粘贴来源站大段文案。
- 游戏介绍、玩法、FAQ 和攻略为本站原创表达。
- 游戏 iframe 可玩。
- 页面导航清晰。
- 站内搜索空结果页不放广告。
- 404、隐私页、联系页、关于页不作为广告重点页。

### 5.3 游戏版权和风险

逐个检查高流量游戏：

- 是否有官方来源或可信来源。
- 是否有 source / developer 记录。
- 是否明显侵犯商标或版权。
- 是否有恶意跳转或下载诱导。
- 是否适合广告环境。

发现风险时：

- 下架或降权。
- 移除 sitemap。
- 从首页 / 分类 / guide 内链中移除。
- 记录在 daily-growth review。

### 5.4 技术检查

必须通过：

```bash
pnpm type-check
pnpm lint
pnpm test -- --runInBand
pnpm build
```

线上抽查：

```bash
curl -I https://www.lumagamehub.com
curl -I https://www.lumagamehub.com/en/about
curl -I https://www.lumagamehub.com/en/contact
curl -I https://www.lumagamehub.com/en/privacy
curl -I https://www.lumagamehub.com/sitemap.xml
curl -I https://www.lumagamehub.com/robots.txt
```

## 6. Phase 6：连接 AdSense 并请求审核

必须由用户在 Google AdSense 后台完成账号、付款地址、电话或身份相关步骤。Codex 只能协助代码接入和验证。

### 6.1 添加网站

在 AdSense 后台：

1. 登录 AdSense。
2. 添加站点：`https://www.lumagamehub.com`。
3. 按后台提示选择连接方式。

Google 官方提供几种连接方式：

- AdSense code snippet：把脚本放到 `<head>`。
- meta tag：把 `google-adsense-account` meta 放到 `<head>`。
- ads.txt snippet：放到根目录 `ads.txt`。

推荐先用 meta tag 或 AdSense code snippet 做站点连接。审核通过后再完整接广告位和 ads.txt。

### 6.2 Next.js 接入方式

建议用环境变量控制，不要把 publisher ID 硬编码到多个地方：

```text
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT=ca-pub-xxxxxxxxxxxxxxxx
```

#### 当前接入准备状态（2026-07-04）

- 当前代码和生产 HTML 尚未检测到 `adsbygoogle` script、`google-adsense-account` meta 或真实 `ca-pub-...` publisher ID。
- 在用户提供真实 AdSense publisher ID 前，禁止写入占位 ID、伪造 `ads.txt` seller line 或上线任何广告容器。
- 用户需要提供的最小信息：AdSense 后台显示的 publisher ID，格式应为 `ca-pub-xxxxxxxxxxxxxxxx`。
- 拿到真实 ID 后，先写入 Vercel Production/Preview/Development 环境变量，再在 root layout 中按 production 环境条件输出一次 meta/script，并用生产 HTML 抽查确认没有重复加载。

在 root layout 或 locale layout 的 `<head>` 内输出：

```html
<meta name="google-adsense-account" content="ca-pub-xxxxxxxxxxxxxxxx">
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
  crossorigin="anonymous">
</script>
```

注意：

- 只在 production 且 env 存在时输出。
- 不在本地测试环境误加载。
- 不要重复加载脚本。
- 不要让 CSP 阻挡 `pagead2.googlesyndication.com`、`googlesyndication.com`、`googleads.g.doubleclick.net` 等 AdSense 相关域名。

### 6.3 请求审核

在 AdSense 后台：

1. 确认代码或 meta 已部署生产。
2. 确认首页和有流量页面能访问到代码。
3. 点击 Verify。
4. 点击 Request review。

官方说明：site review 通常几天，某些情况可能需要 2-4 周。审核期间不要把站点关掉、加登录、频繁换域名或大规模改结构。

## 7. Phase 7：审核等待期

等待期间每天做：

- 检查 AdSense site status。
- 检查生产站是否 200。
- 检查 robots 是否误拦截。
- 检查 GSC coverage / indexing。
- 检查 Vercel 5xx / 404。
- 持续更新内容，但不要大规模制造薄页。
- 不要点击自己的广告或测试广告点击。
- 不要诱导用户“支持我们点击广告”。

如果长时间卡住：

- 确认 AdSense 代码在有内容、有访问的页面上。
- 确认不是只放在无人访问的页面。
- 确认 robots.txt 允许 crawler。
- 确认没有登录墙、地区阻挡、防火墙或反爬阻挡。
- 检查是否错误提交了根域而实际使用 `www`。

如果被拒：

按拒绝原因归类处理：

- Low value content：增加原创玩法、攻略、FAQ、真实截图、分类策展，删除薄页。
- Policy violation：移除违规游戏或内容。
- Navigation issue：修菜单、面包屑、内链和移动端。
- Crawler issue：修 robots、CSP、防火墙、重定向。
- Copyright / IP risk：下架风险游戏，补版权/移除请求说明。

处理后再申请复审，不要原样重复提交。

## 8. Phase 8：通过后接 ads.txt 和广告展示

通过后再做广告展示，不要一开始就全站堆广告。

### 8.1 ads.txt

在 AdSense 后台复制自己的 publisher line，格式类似：

```text
google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
```

放到：

```text
public/ads.txt
```

上线后验证：

```bash
curl https://www.lumagamehub.com/ads.txt
```

AdSense 里 ads.txt 状态更新可能需要几天，低请求量站点甚至更久。

### 8.2 广告策略

优先保守：

- 先用 Auto ads 小流量观察，或只放 1-2 个手动广告位。
- 不在游戏 iframe 上方紧贴 Play 按钮放广告。
- 不把广告伪装成游戏按钮、下载按钮、继续按钮。
- 不在弹窗、悬浮误点、邮件、软件内放 AdSense code。
- 不在无内容页、搜索空结果页、404、admin、API、隐私页重点展示。

推荐初始广告位：

- Desktop：右侧栏或正文后半段。
- Mobile：内容段落之间，离 Play 按钮和游戏控制区保持距离。
- Guide 页：攻略正文中段和结尾。
- Game detail：游戏说明后、FAQ 前或相关游戏前。

不要做：

- “Click ads to support us”
- 箭头/动画引导广告
- 广告与游戏开始按钮并排混淆
- 页面内容少于广告
- 自动刷新制造展示
- 自己或让朋友点击广告

### 8.3 CMP / 隐私消息

如果向 EEA、UK、Switzerland 用户投放个性化广告，需要使用 Google-certified CMP，并符合 IAB TCF 要求。可选：

- 使用 AdSense 后台的 Google CMP / European regulations message。
- 使用 Google 认证的第三方 CMP。

如果不确定地区流量，先在 AdSense 的 Privacy & messaging 中配置 Google 的欧洲法规消息，避免后续广告服务受限。

## 9. Phase 9：上线后持续运营

每日：

- 看 AdSense dashboard、Policy center。
- 看 Vercel / GSC / Clarity 是否因广告加载导致体验下降。
- 看是否有无效点击、异常国家、异常 referrer。

每周：

- 抽样 10 个有广告页面，确认没有误点风险。
- 检查高访问页广告密度。
- 检查 Core Web Vitals / 移动端体验。
- 看 AdSense page RPM、impressions、viewability。
- 看 GSC 点击是否因广告影响下降。

每月：

- 全站版权/来源抽样。
- 外链死链检查。
- 删除或 noindex 无价值页面。
- 更新高曝光 guide。
- 根据真实查询新增 1-3 个高质量 guide，而不是批量灌水。

## 10. 申请前最终一页清单

提交 AdSense site review 前，必须全部为 yes：

- [ ] `https://www.lumagamehub.com` 为唯一主域名。
- [ ] 根域跳转到 `www`。
- [ ] sitemap 200 且提交到 GSC。
- [ ] robots 200 且不阻挡核心页面和 AdSense crawler。
- [ ] About / Contact / Privacy 中英文可访问。
- [ ] 首页、游戏列表、重点游戏页、重点 guide 页移动端正常。
- [ ] 至少 30 个游戏详情页有原创说明和可玩内容。
- [ ] 至少 5-10 个 guide / collection 页面有真实搜索意图。
- [ ] 无明显版权、成人、赌博、危险、恶意下载内容。
- [ ] 高风险 iframe 已下架或降权。
- [ ] GSC 有曝光，最好已有点击。
- [ ] Clarity 有 non-bot sessions。
- [ ] Vercel logs 无持续 5xx。
- [ ] `pnpm type-check`、`pnpm lint`、`pnpm test -- --runInBand`、`pnpm build` 通过。
- [ ] AdSense 代码或 meta 只在 production 加载。
- [ ] 用户已完成 AdSense 账号、付款地址、电话/身份等后台步骤。

## 11. 官方参考

- AdSense eligibility requirements: https://support.google.com/adsense/answer/9724
- Make sure your site's pages are ready for AdSense: https://support.google.com/adsense/answer/7299563
- Connect your site to AdSense: https://support.google.com/adsense/answer/7584263
- AdSense Program policies: https://support.google.com/adsense/answer/48182
- Google Publisher Policies: https://support.google.com/adsense/answer/10502938
- Ads.txt guide: https://support.google.com/adsense/answer/12171612
- Google consent management requirements: https://support.google.com/adsense/answer/13554116
