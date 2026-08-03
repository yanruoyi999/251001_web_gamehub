# Spend Bill Gates Money 独立游戏页设计说明

## 目标

在 Luma Game Hub 内新增一个双语、移动端优先、完全在浏览器本地运行的独立互动游戏页，用固定的 1000 亿美元作为游戏资产，让用户购买 15 种商品、获得分级反馈、生成亿万富翁身份结果并分享。

该版本是 2 天级 MVP。目标是验证真实搜索流量、游戏停留、完成率和分享意愿，不包含登录、数据库、排行榜、动态 OG 图片、多人玩法、实时名人净资产或第三方 iframe。

## 现有项目约束

- 仓库：`yanruoyi999/251001_web_gamehub`
- 基线分支：`main`
- 功能分支：`feat/spend-bill-gates-money-mvp-20260803`
- Next.js 15.5.21、React 19.2.7、Tailwind CSS 3.4.4、next-intl 4.9.2、pnpm 10.28.0。
- 路由位于 `app/[locale]/...`；默认中文无前缀，英文使用 `/en`。
- 页面继承现有 `Header`、`Footer`、主题、GA4、Clarity、Vercel Analytics 和国际化布局。
- 不修改通用 iframe 游戏页、mock catalogue、全局样式、Tailwind 配置、依赖或数据库。

## 路由与文件边界

新增：

- `app/[locale]/games/spend-bill-gates-money/page.tsx`：服务器页面、双语文案、metadata、JSON-LD、FAQ 和相关内链。
- `components/game/spend-bill-gates-money-game.tsx`：客户端游戏状态、购买、反馈、结果、分享、重玩和埋点。
- `lib/games/spend-bill-gates-money.ts`：15 个商品、类型、余额计算、消费统计、身份计算和金额格式化。
- `tests/spend-bill-gates-money-data.test.ts`：纯逻辑和数据约束。
- `tests/spend-bill-gates-money-page.test.ts`：页面、SEO、结构化数据、发现入口和 sitemap 静态回归。
- `tests/spend-bill-gates-money-game.test.ts`：客户端组件双语与可访问性静态渲染回归。

修改：

- `app/sitemap.ts`：只在 `standaloneGamePaths` 中增加一次 `/games/spend-bill-gates-money`。
- `app/[locale]/games/page.tsx`：在现有分页结果上方增加不计入 `total`/`totalPages` 的 Luma Original 卡片。

## 数据模型

```ts
export type Locale = 'zh' | 'en';

export interface LocalizedText {
  zh: string;
  en: string;
}

export type ProductCategory = 'luxury' | 'power' | 'world' | 'viral';
export type FeedbackLevel = 'normal' | 'epic' | 'legendary';

export interface Product {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  emoji: string;
  category: ProductCategory;
  feedback: FeedbackLevel;
  toast?: LocalizedText;
}

export interface Purchase {
  productId: string;
  count: number;
}
```

金额全部使用整数美元。初始财富为 `100_000_000_000`。

## 商品与反馈

普通反馈：私人飞机、超级游艇、私人岛屿、豪华庄园、超跑收藏、资助气候研究。

Epic 反馈：NBA 球队、足球俱乐部、摩天大楼、太空计划、100 所学校、医院。

Legendary 反馈：黄金马桶、一万名私人厨师、月球陨石坑命名权。

渲染和反馈必须完全依据 `feedback` 字段，不依据数组位置。

## 游戏规则

- 商品可重复购买，按 `productId` 累计数量。
- 余额不得低于零；余额不足时购买按钮禁用，不触发反馈或埋点。
- 至少购买一件商品后才允许结束。
- 点击结束后显示身份、总花费、剩余资产和购买列表。
- 点击重玩后恢复初始财富并清空全部状态。
- Golden Toilet 优先判定为 Chaos Billionaire / 混沌富豪。
- 其他身份按类别累计消费金额判断：luxury → Luxury King，power → Empire Builder，world → World Changer。
- viral 最高、全部为零或最高金额并列时返回 The Visionary / 远见者。

## 页面与交互

### Hero

- 高度不超过 `70svh`。
- 深蓝到近黑局部渐变，不修改全站主题。
- 金额使用 `clamp(2.1rem, 10vw, 4.5rem)`、`white-space: nowrap`、`tabular-nums`。
- 启动按钮宽 240px、高 56px，使用局部 CSS 动画或 Tailwind arbitrary animation；在 `prefers-reduced-motion` 下禁用。
- 320px、375px、390px 和桌面视口均不得产生横向滚动。

### 财富 HUD

- 使用 `sticky top-16 z-40`，避开现有 `h-16 z-50` Header。
- 显示紧凑金额和剩余比例进度条。

### 商品区

- 默认单列，`md:grid-cols-3`。
- 卡片为深色圆角矩形；Epic 使用金色边框和标签；Legendary 使用独立标签。
- 每张卡显示 emoji、双语名称、价格、简短描述、数量和购买按钮。

### 购买反馈

- Normal：`aria-live="polite"` 顶部 toast，1.5 秒后消失。
- Epic：视觉居中的遮罩反馈，但不移动或劫持键盘焦点。
- Legendary：显示数据文件中的幽默 toast。
- 减少动态效果偏好下不执行缩放、抖动或呼吸动画。

### 结果与分享

- 结果显示本地化身份、总花费、剩余资产和购买清单。
- 优先使用 `navigator.share` 分享本地化文字和当前 URL。
- 不支持 Web Share API 时复制到剪贴板；再次失败时显示可手动复制文本。
- MVP 只使用固定站点 OG 图片，不生成用户专属图片。

## 国际化

商品、描述、按钮、状态、反馈、身份、结果、FAQ、免责声明和分享文本均由 `locale` 选择中英文。

URL：

- 中文：`/games/spend-bill-gates-money`
- 英文：`/en/games/spend-bill-gates-money`

## SEO 与信任边界

页面生成：

- 双语 title 和 description。
- canonical 与 `zh-CN`/`en-US` hreflang。
- Open Graph 与 Twitter Card。
- `VideoGame`、`FAQPage`、`BreadcrumbList` JSON-LD。
- FAQ 说明名人净资产每天变化，1000 亿美元只是固定玩法金额。
- 页面正文和 FAQ 均明确：非官方、与 Bill Gates、Microsoft 或相关组织无关联或背书关系。

## 发现入口

在 `/games` 分页结果前增加 Luma Original 卡片，链接使用 `getLocalizedPath(locale, '/games/spend-bill-gates-money')`。该卡不修改 catalogue 数据、结果总数或分页计算。

## Analytics

客户端使用 `trackInteraction()`，只发送低基数字段：

- `billionaire_game_start`
- `billionaire_product_buy`
- `billionaire_game_finish`
- `billionaire_share_click`
- `billionaire_game_restart`

允许参数：`source`、`locale`、`product_id`、`feedback_level`、`identity`、`share_method`、`purchase_count`、`spent_bucket`。不发送完整购买清单、个人信息、自由文本或用户唯一标识。

## 测试与验收

- 商品数量、唯一 ID、正整数价格、反馈等级和本地化字段完整。
- 余额不为负、重复购买累计正确、身份规则稳定、Golden Toilet 优先级正确。
- 页面包含双语 metadata、canonical、hreflang、三类 JSON-LD、FAQ 和免责声明。
- sitemap 只增加一次独立路径，由 locale 循环生成两条 URL。
- 游戏列表存在独立入口且不改变分页结果。
- 组件支持中英文、`aria-live`、reduced motion、开始、购买、结束、分享降级与重玩。
- 门禁：lint、type-check、internal links、Vitest、production audit、production build；若 E2E 环境可用，再验证移动端主流程。

## 明确不做

- 不读取或展示实时净资产。
- 不使用名人照片或暗示官方合作。
- 不新增依赖、数据库、登录、排行榜、动态 OG、Canvas、WebGL、Framer Motion 或第三方动画库。
- 不修改现有通用游戏详情页、mock catalogue 或全局样式。
