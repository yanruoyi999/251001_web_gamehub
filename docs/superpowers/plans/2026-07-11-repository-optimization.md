# Luma Game Hub Repository Optimization Plan

> 日期：2026-07-11
> 范围：本地 `main`、`origin/main`、开放 PR、远端历史分支、生产路由、目录数据、测试与运维脚本
> 原则：先修真实性和索引面，再修体验与性能，最后清理依赖和历史分支。

## 0. 已验证基线

- 本地 `HEAD` 与 `origin/main` 均为 `0a1bbf5`，不存在待拉取或待推送的代码差异。
- 仓库共 251 个跟踪文件；主要复杂度集中在：
  - `lib/games/editorial-content.ts`：约 5,252 行。
  - `lib/seo-landing-content.ts`：约 5,017 行。
  - `app/[locale]/games/[slug]/page.tsx`：约 1,089 行。
  - `app/[locale]/games/page.tsx`：约 619 行。
  - `services/game.service.ts`：约 553 行。
- 当前本地用户改动：`docs/google-adsense-end-to-end-sop.md`、`package.json`，以及未跟踪的知识库文件。执行本计划时必须保留并逐项确认差异。
- 验证通过：`pnpm type-check`、54 个 Vitest 测试、`pnpm check:internal-links`、ESLint 0 error。
- ESLint 有 96 个 warning，均集中在 seed/运维脚本的 `console` 输出，不阻塞生产构建。
- `pnpm audit:prod` 无已知生产依赖漏洞；不做一次性大版本升级。

## 1. 优先级总览

| 优先级 | 工作包 | 主要风险 | 完成定义 |
| --- | --- | --- | --- |
| P0 | 目录与来源真实性 | 虚构指标、错误来源标签、重复 iframe | 所有公开字段均有证据或明确省略 |
| P0 | 公开索引面做减法 | 107 个 noindex/薄内容页仍可发现或播放 | 只公开可验证、具原创内容的页面 |
| P0 | 技术 SEO 闸门 | 搜索页、样例页、sitemap、canonical 错误 | sitemap 只含可索引 canonical URL |
| P0 | 本地目录 API 封口 | 本地模式仍暴露写接口 | 所有写接口在 local mode 返回 404 |
| P1 | 内容注册表与质量审计 | 两个 5,000 行文件难维护，审计误报 | 内容拆分、schema 校验、审计可信 |
| P1 | 移动端发现与首页体验 | 移动端无主导航/搜索，首屏不像游戏站 | 首屏直接发现游戏，移动导航完整 |
| P1 | 缓存与加载性能 | 核心游戏页 private/no-store | 核心本地页可静态生成或 ISR |
| P1 | 隐私、Consent、AdSense 准备 | 声明与真实服务不一致 | 隐私说明准确，广告前接入认证 CMP |
| P2 | 文档、依赖、死代码、远端分支 | 维护成本与误合并风险 | 文档单一事实源，分支与依赖收敛 |

## 2. P0：目录数据真实性和来源模型

**目标：** 停止在页面、API 和结构化数据中把推断值当作事实。

**主要文件：**

- `public/data/4399-sample.json`
- `lib/mock-games.ts`
- `lib/games/imported-4399.ts`
- `lib/games/fallback-list.ts`
- `lib/games/fallback-search.ts`
- `lib/games/fallback-detail.ts`
- `scripts/check-external-links.ts`
- `scripts/audit-game-quality.ts`
- `tests/fallback-games.test.ts`
- `tests/api-games-route.test.ts`

**实施步骤：**

1. 先为目录条目增加显式字段：`sourceType`、`sourceHost`、`sourcePageUrl`、`embedHost`、`developerVerified`、`embedPermissionStatus`、`reviewStatus`。
2. 将 `4399` 和 `ad-freegames.github.io` 定义为分发/镜像来源，不再显示成“官方站点”或“开发者”。
3. 删除按数组位置或 ID 生成的 `featured`、`isNew`、`isHot`、分类、标签、发布日期、游玩次数和评分。
4. 只有存在真实数据时才返回 `publishedAt`、`playCount`、`rating`；UI、API、JSON-LD 对缺失值统一省略。
5. 修复 Adam and Eve 7/8 共用同一 iframe 的重复映射；无法确认正确来源时先下线其中一页。
6. 修改外链检查器：local mode 不等待数据库；把 HTTP 可访问、来源身份、嵌入授权分开报告；样本按风险和来源分层，不只检查前十条。
7. 修改质量审计，让原创内容覆盖从 `editorial-content.ts` 和 SEO 内容注册表计算，不再只检查导入数据中的短描述。

**测试先行：**

1. 增加测试，断言不存在两个公开 slug 共用同一 embed URL。
2. 增加测试，断言未验证开发者不会被渲染为官方开发者。
3. 增加 API 测试，断言缺失指标不会被填入推断值。
4. 增加审计测试，断言有完整 editorial 内容的页面不会被误判为薄内容。

**验收命令：**

```bash
pnpm test -- --run
pnpm check:links
pnpm check:internal-links
pnpm type-check
```

## 3. P0：公开目录和高风险页面做减法

**目标：** 将“能导入”与“值得公开、值得索引”分离。

**主要文件：**

- `lib/games/catalog-quality.ts`
- `lib/games/fallback-list.ts`
- `lib/games/fallback-search.ts`
- `app/[locale]/games/page.tsx`
- `app/[locale]/games/[slug]/page.tsx`
- `app/[locale]/search/page.tsx`
- `app/sitemap.ts`
- `docs/game-quality-audit.md`

**实施步骤：**

1. 先修正审计口径，再生成一份逐 slug 决策表，禁止按当前误报结果直接批量删除。
2. 默认公开条件改为：来源可解释、iframe 可用、非 manual-review、具原创 editorial 内容、无明显 IP/暴力/成人/赌博风险。
3. `catalogue-only` 不再进入主目录、站内搜索、分类页、标签页或 sitemap；保留内部候选数据供后续制作。
4. `manual-review` 页面停止加载 iframe，按证据选择 `404`、`410` 或安全说明页；不能只做 `noindex` 后继续提供游戏。
5. 第一阶段把当前约 181 个可发现游戏收敛到约 44 个已有 editorial 支撑的核心页，再逐页补证据扩回，而不是追求数量。
6. 对已有搜索信号但被下线的 URL 使用 308 跳转到最相近的合法页面；没有等价内容时返回 410，避免全部跳首页。

**测试先行：**

1. 目录、搜索、分类和 sitemap 只包含 `public/indexable` 条目。
2. manual-review slug 不渲染播放器。
3. 每个跳转的目标必须是 200、canonical 且内容相关。

**验收命令：**

```bash
pnpm test -- --run
pnpm check:internal-links
pnpm build
```

## 4. P0：技术 SEO 闸门

**目标：** 让 Google 只抓取有独立价值的 canonical 页面。

**主要文件：**

- `app/[locale]/search/page.tsx`
- `app/[locale]/games/4399-sample/page.tsx`
- `app/sitemap.ts`
- `app/llms.txt/route.ts`
- `app/[locale]/layout.tsx`
- `lib/games/editorial-content.ts`
- `lib/seo-landing-content.ts`
- `next.config.mjs`

**实施步骤：**

1. 为站内搜索页增加专属 metadata、正确 canonical 和 `noindex,follow`，并从 sitemap、`llms.txt` 移除。
2. 删除或在生产环境 `notFound()` 处理 `/[locale]/games/4399-sample`，移除所有入口和嵌入内容。
3. sitemap 只输出可索引 canonical URL；移除搜索页、候选页、manual-review、catalogue-only 和调试页。
4. 使用稳定内容更新时间，避免 `new Date()` 导致 sitemap 每次构建全量变更。
5. 修正首页重复品牌标题，并将过长标题/description 控制在清晰、自然、非堆词的范围。
6. 清理 `unblocked`、school/work/restricted network 等无法验证的可访问性承诺。只保留安全解释语境；需要改 slug 时建立逐页 308 映射。
7. 更新 `llms.txt`，删除“页面包含评分”等不符合当前产品事实的描述，只列核心游戏、指南和政策页。
8. 将 `best-new-browser-games-july-2026` 改成有更新机制的月度页面，或合并到 evergreen 集合并设置 308，避免时间陈旧页面长期留在索引中。

**官方依据：**

- Google 建议 sitemap 只放希望出现在搜索结果中的页面，并优先放 canonical URL。
- `noindex` 必须让 Googlebot 可以抓到，不能只在 `robots.txt` 中阻止抓取。

**验收命令：**

```bash
pnpm check:internal-links
pnpm build
curl -s https://www.lumagamehub.com/sitemap.xml
curl -s https://www.lumagamehub.com/en/search?q=drive
```

随后在 GSC URL Inspection 中人工确认搜索页为 `noindex`、核心页 canonical 正确。

## 5. P0：local mode API 完整封口

**目标：** 生产以静态本地目录运行时，不暴露任何无效管理写入口。

**主要文件：**

- `app/api/games/route.ts`
- `app/api/games/[id]/route.ts`
- `lib/games/catalog-mode.ts`
- `tests/local-catalogue-api.test.ts`
- `tests/api-games-route.test.ts`

**实施步骤：**

1. `POST /api/games` 在 local mode 返回 404。
2. `PATCH`、`DELETE /api/games/[id]` 在 local mode 返回 404。
3. 保留必要的只读 API，但响应不得包含虚构指标或内部审核字段。
4. 抽取一个共享的 local-mode route guard，避免各路由遗漏。

**验收命令：**

```bash
pnpm test -- --run tests/local-catalogue-api.test.ts tests/api-games-route.test.ts
pnpm type-check
```

## 6. P1：内容注册表模块化与质量门槛

**目标：** 让新增攻略可以独立评审、测试和回滚，避免继续扩张两个 5,000 行文件。

**主要文件：**

- `lib/games/editorial-content.ts`
- `lib/seo-landing-content.ts`
- 新目录 `content/games/`
- 新目录 `content/guides/`
- 新文件 `lib/content/schema.ts`
- `app/[locale]/games/[slug]/page.tsx`
- `app/[locale]/guides/[slug]/page.tsx`
- `scripts/audit-game-quality.ts`

**实施步骤：**

1. 先建立 typed schema 和注册表加载器，再按主题小批量迁移，避免一次性重写。
2. 每个游戏/指南独立文件，至少包含：metadata、quick answer、原创介绍、controls/how-to、tips、FAQ、related links、来源与实测日期。
3. 质量门槛按页面类型设置，不只按字数：必须回答具体玩家问题，FAQ 不重复正文，相关链接语义相关。
4. 将 `quick-play-guide`、`no-download-games` 等独立实现合并进统一注册表；薄而重复的页面通过 308 合并。
5. 为 title、description、H1、FAQ 问答重复、无效内部链接、过期日期增加静态验证。

**验收命令：**

```bash
pnpm test -- --run
pnpm check:internal-links
pnpm type-check
pnpm build
```

## 7. P1：移动端发现路径和首页改造

**目标：** 首屏直接提供可玩的核心内容，减少移动端死路，提高页/会话和滚动深度。

**主要文件：**

- `app/[locale]/layout.tsx`
- `app/[locale]/page.tsx`
- `components/feedback/TypeformFeedbackButton.tsx`
- 现有游戏卡片、搜索和导航组件
- `tests/e2e/` 下新增移动端流程测试

**实施步骤：**

1. 增加移动端菜单和搜索入口，保留 Games、Guides、核心分类、About/Contact/Privacy。
2. 首页移除占满一屏的通用营销 hero；改为紧凑标题、搜索、6 个精选真实游戏、热门指南和分类入口。
3. 真实游戏缩略图优先，避免通用 emoji/功能说明卡片占据首屏。
4. 检查 Typeform 固定按钮在 320/375/390px 宽度下是否遮挡内容，必要时改为图标按钮并加 tooltip。
5. 核心流程覆盖：打开首页、搜索、进入游戏页、启动播放器、进入相关攻略、返回目录。

**验收命令：**

```bash
pnpm build
pnpm test:e2e
```

并用 Playwright 在 390x844、768x1024、1440x900 截图，检查文字、导航、播放器和固定按钮无重叠。

## 8. P1：静态生成、缓存与 iframe 加载

**目标：** 利用 local catalogue 的确定性，减少核心页 TTFB 和服务端动态开销。

**主要文件：**

- `app/[locale]/games/[slug]/page.tsx`
- `app/[locale]/games/page.tsx`
- `app/[locale]/games/solitaire/page.tsx`
- `app/[locale]/games/monster-survivors/page.tsx`
- `app/sitemap.ts`
- `components/games/GamePlayerFacade.tsx`
- `scripts/patch-static-locale-html.ts`

**实施步骤：**

1. 为核心 local-mode 游戏页增加 `generateStaticParams` 和稳定 `revalidate`；候选页不生成。
2. 目录、分类、标签和 sitemap 使用本地数据静态生成或 ISR，不再走无效数据库回退。
3. 合并 Solitaire、Monster Survivors 的重复页面逻辑到共享游戏详情模板。
4. iframe 继续延迟加载，但改为逐来源/逐游戏能力清单；默认 sandbox，仅对经验证确有需要的来源开放能力。
5. 为 iframe 错误、超时、移动端不支持提供明确回退，不自动重试或加载未知脚本。
6. 单独评估并最终移除 `patch-static-locale-html.ts` 的构建产物改写；在移除前先建立英文/中文 `<html lang>` 回归测试。

**验收命令：**

```bash
pnpm build
pnpm test:e2e
curl -I https://www.lumagamehub.com/en/games/drive-mad
```

验收指标：核心静态页不再返回 `private, no-store`；部署后比较首页、目录、核心游戏页的 TTFB 和 LCP。

## 9. P1：隐私、Analytics Consent 与 AdSense 闸门

**目标：** 页面声明与实际部署一致；在获得真实 publisher ID 前不加载广告脚本。

**主要文件：**

- `components/analytics/ClarityConsent.tsx`
- `app/[locale]/privacy/page.tsx`
- `app/[locale]/layout.tsx`
- `docs/google-adsense-end-to-end-sop.md`
- `docs/setup/external-services.md`

**实施步骤：**

1. 隐私页仅声明生产实际启用的 GA4、Clarity、Typeform 和 iframe 第三方服务；删除当前未使用的账户、评分、计数、Upstash、Cloudinary 等笼统声明，或标注仅在启用相应功能时适用。
2. 为分析 cookie 提供可再次打开的偏好控制，不把默认 `granted` 当作永久决定。
3. 只有用户提供真实 `ca-pub-...` 后，才新增生产域限定、单实例、环境变量驱动的 AdSense script；不创建诱导点击容器。
4. 面向 EEA、英国和瑞士投放个性化广告前，选择 Google 认证且支持 IAB TCF 的 CMP。Google 的 TCF v2.3 迁移期限已过，接入时必须再次按官方文档验证版本。
5. AdSense 申请前重新跑内容/来源闸门。Google 官方明确指出，自动生成或缺少原创丰富内容的页面不应放广告。

**验收命令：**

```bash
pnpm test -- --run
pnpm build
rg "ca-pub-|adsbygoogle" app components public
```

未提供 publisher ID 时，最后一条搜索应无真实 ID，且开发环境网络面板不应请求 AdSense。

## 10. P2：文档、依赖、死代码和仓库卫生

**目标：** 降低维护噪音，不与 P0/P1 业务修复混在同一提交。

**主要文件：**

- `README.md`
- `docs/setup/deployment.md`
- 根目录历史说明文档
- `components/ui-old/`
- `package.json`
- `pnpm-lock.yaml`
- 已跟踪 `.DS_Store` 和无关 text clipping 文件

**实施步骤：**

1. 更新 README：实际为 Next.js 15、React 19、local catalogue、生产 admin 关闭；删除已失效的必需 DB/Redis/admin 说明。
2. 将历史 `FINAL_EXECUTION_GUIDE.md`、`FIXES_APPLIED.md`、`SEO_ENHANCEMENT_README.md` 等整合到 `docs/archive/` 或删除，保留一个当前部署与运维入口。
3. 删除已确认无引用的 `components/ui-old/`、`.DS_Store`、无关 text clipping、非空目录中的冗余 `.gitkeep`。
4. 使用 `knip` 结果逐项复核后删除真正未使用的 `zod`、`@radix-ui/react-select` 和 UI 文件；CLI/动态导入文件不能按报告盲删。
5. 依赖分批更新：先无破坏性小版本并完整验证；Next 16、Tailwind 4、ESLint 10、TypeScript 7 分别开独立任务，不在内容优化期间升级。
6. 将脚本目录的 `console` 配置为允许或引入轻量 logger，把 96 个预期 warning 变成干净基线。

**验收命令：**

```bash
pnpm audit:prod
pnpm dlx knip
pnpm lint
pnpm type-check
pnpm test -- --run
pnpm build
```

## 11. P2：远端 PR 和分支治理

**目标：** 避免旧自动化分支误覆盖当前统一内容模型。

**当前状态：**

- Draft PR #4、#5、#6、#7 均基于旧页面实现或已被主线后续改动部分取代。
- 多个远端自动化分支落后 `main` 约 70-93 个提交，不能整体合并。
- 最新 GitHub Actions 对 `0a1bbf5` 已通过。

**实施步骤：**

1. 对 #4 标记为 superseded 并关闭，因为核心安全/审核工作已在主线的后续提交中落地。
2. 对 #5/#6/#7 只抽取经过真实需求和来源复核的文案思路，迁入新的内容注册表；不要 cherry-pick 整个旧页面。
3. 在用户确认后，为需要留档的旧分支建立单一 archive tag，再删除已合并和明确废弃的远端自动化分支。
4. 保留所有破坏性远端操作的清单和恢复点；分支删除不与代码修复提交混合。

## 12. 监测数据驱动的后续 SEO/GEO

完成 P0 后再扩内容，避免给薄页面继续增加索引入口。

1. 继续优先已有信号页：`drive-mad-walkthrough`、`google-snake-mods`、`best-free-iphone-games`。
2. 每次只根据 GSC 的真实 query/impression/position 选择 1-3 个长尾主题，优先关卡、控制、具体失败原因、移动端差异、保存机制、替代游戏。
3. GEO 内容采用可抽取结构：首段直接答案、步骤、条件/限制、FAQ、更新时间和来源，不虚构关卡或掉落信息。
4. 新页面必须先完成实测笔记和版权/嵌入证据，再进入索引；没有足够独立价值时补到已有指南，不新建 URL。
5. 每 14 天比较 GSC CTR/平均排名、GA4 landing engagement、Clarity scroll/dead click；未见搜索信号且与其他页重叠的页面继续合并。

## 13. 建议执行顺序

### 未来 24 小时

1. 完成目录真实性 schema、去除虚构指标、修复重复 iframe。
2. 修复 search metadata/noindex/sitemap，并移除生产 sample 页面。
3. 封闭 local mode 下遗漏的游戏写 API。

### 第 2-3 天

1. 修正质量审计口径，生成逐 slug 保留/下线/合并清单。
2. 收敛公开目录和 sitemap，禁用 manual-review 播放器。
3. 清理误导性的 `unblocked` 与学校/工作网络承诺。

### 第 4-7 天

1. 增加移动端导航与搜索，改造首页首屏。
2. 静态生成核心游戏页，修正缓存策略和 iframe 能力清单。
3. 修正 Privacy 与分析 consent，更新 README。

### 第 2 周

1. 分批拆分内容注册表，合并重复薄指南。
2. 根据真实 GSC/GA4/Clarity 数据优化现有长尾页。
3. 清理死代码、依赖、历史文档和远端旧分支。

## 14. 全局完成闸门

每个工作包都必须满足：

```bash
pnpm lint
pnpm type-check
pnpm test -- --run
pnpm check:internal-links
pnpm audit:prod
pnpm build
```

部署后还需人工检查：

- 首页、目录、3 个核心游戏页、3 个指南页、About、Contact、Privacy 均为 200。
- sitemap 不含 search、sample、manual-review、catalogue-only。
- 移动端导航、搜索、iframe 和反馈按钮无重叠。
- GSC canonical/noindex 与预期一致。
- 未提供真实 publisher ID 时，无 AdSense script、slot 或 `ads.txt` 占位值。
