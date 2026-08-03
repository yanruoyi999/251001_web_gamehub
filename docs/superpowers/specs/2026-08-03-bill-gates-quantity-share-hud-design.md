# Spend Bill Gates Money 交互升级设计说明

## 目标

在已上线 MVP 上修复三个真实使用问题：商品数量只能增加不能减少、用户滚动后看不到余额与进度、分享缺少明确渠道和适合中外用户的界面。

本轮采用已确认的方案 A：前端渠道弹窗 + 微信实用降级，不接入公众号 JS-SDK，不新增后端或依赖。

## 边界

- 基线：`main@219fa11a7127483d68b322d88ad61c4845032fed`。
- 功能分支：`feat/bill-gates-quantity-share-hud-20260803`。
- 备份：`backup/main-before-bill-gates-share-hud-20260803-2330`。
- 不修改通用 iframe 游戏页、mock catalogue、全局 CSS、Tailwind 配置、依赖和数据库。
- 保持中英文路由、SEO、结构化数据和现有游戏规则不变。

## 1. 数量加减与退款

每张商品卡底部使用三段式数量控制：

```text
[ − ]   ×数量   [ + ]
```

规则：

- `+` 等价于现有购买，余额足够时数量加 1。
- `−` 在数量大于 0 时数量减 1，并通过派生计算退回完整商品价格。
- 数量减到 0 时从购买记录中移除。
- 数量不得为负数；余额不得超过初始 1000 亿美元。
- `−` 在数量为 0 时禁用；`+` 在余额不足时禁用。
- 移除商品只显示轻量退款 Toast，不触发 Epic 全屏反馈。
- 新增低基数事件 `billionaire_product_remove`，字段限制与购买事件一致。

纯逻辑由独立模块提供，避免继续扩大原商品规则文件：

```text
lib/games/spend-bill-gates-money-purchases.ts
```

```ts
decrementPurchase(purchases: Purchase[], productId: string): Purchase[]
```

## 2. 全程可见的财富 HUD

游戏开始且尚未进入结果页时，财富 HUD 改为真正固定：

```text
fixed top-16 left-0 right-0 z-40
```

要求：

- 避开现有 `h-16 z-50` Header。
- HUD 下方插入等高占位，页面不跳动。
- 滚动完整商品区和购买记录时始终可见。
- HUD 显示余额、剩余百分比和紧凑“查看结果”按钮。
- 查看结果按钮在未购买商品时禁用；购买后可从任意滚动位置完成游戏。
- 进入结果页后隐藏固定 HUD，结果卡本身显示总花费与剩余金额。
- 320px 起不产生横向溢出。

## 3. 分享渠道弹窗

点击结果页“分享结果”后，先打开站内分享界面，而不是立即调用系统分享。

- 手机：底部 Sheet。
- 桌面：居中 Dialog。
- 顶部显示结果预览卡：身份 emoji、身份标签、总花费和挑战文案。
- 支持 Escape、关闭按钮、遮罩点击、初始焦点和关闭后焦点恢复。
- `role="dialog"`、`aria-modal="true"`，不新增组件依赖。

### 英文默认排序

1. X
2. Telegram
3. WhatsApp
4. Facebook
5. System Share
6. Copy Result

### 中文默认排序

1. 微信
2. 微博
3. QQ
4. Telegram
5. X
6. 复制结果
7. 系统分享

### 渠道行为

- X：打开 Web Intent，预填结果文字和页面 URL。
- Telegram：使用 `https://t.me/share/url?url={url}&text={text}`。
- WhatsApp：使用 `https://wa.me/?text={text+url}`。
- Facebook：使用 sharer URL，仅传页面 URL。
- 微博、QQ：使用其网页分享 URL，传本地化标题、结果文字和页面 URL。
- 所有外部分享使用 `window.open(..., '_blank', 'noopener,noreferrer')`。
- Copy Result：复制结果文字和 canonical 页面 URL；失败时显示可手动复制文本。
- System Share：支持时调用 `navigator.share`；不支持时走复制降级。

### 微信实用降级

- 微信内浏览器：显示“点击右上角菜单发送给朋友或分享到朋友圈”的本地化提示。
- 其他移动浏览器且支持 `navigator.share`：调用系统分享，用户可在系统面板选择微信。
- 桌面端或不支持系统分享：复制结果文字和 URL，并提示打开微信粘贴。
- 不声称网页可以直接指定微信联系人。
- 不接入公众号 AppID、JS 安全域名或签名服务；为未来 JS-SDK 留清晰边界，但不写空接口。

## 4. 埋点

保留现有事件，并新增：

- `billionaire_product_remove`
- `billionaire_share_open`

`billionaire_share_click` 改为在用户选择具体渠道时触发，`share_method` 允许：

```text
x, telegram, whatsapp, facebook, wechat, weibo, qq, system, clipboard, manual
```

仍不发送完整购买清单、自由文本或用户唯一标识。

## 5. 文件边界

新增：

- `lib/games/spend-bill-gates-money-purchases.ts`：不可变的减少数量与移除购买纯函数。
- `lib/games/spend-bill-gates-money-share.ts`：渠道排序、分享 URL 构造和类型。
- `components/game/spend-bill-gates-money-share-sheet.tsx`：可访问的双语分享 Sheet/Dialog。
- `tests/spend-bill-gates-money-share.test.ts`：分享 URL 与渠道排序。

修改：

- `components/game/spend-bill-gates-money-game.tsx`：加减控制、固定 HUD、分享弹窗接入。
- `tests/spend-bill-gates-money-data.test.ts`：退款与移除规则。
- `tests/spend-bill-gates-money-game.test.ts`：静态 UI 契约。
- `tests/e2e/spend-bill-gates-money.spec.ts`：移动端与桌面端主流程回归。

## 6. 验收

- 买 2 件后减 1 件，数量、余额、总花费、身份和购买记录同步更新。
- 减到 0 后商品从购买记录移除，余额恢复；不能继续减。
- 桌面端滚动到最后一张商品时，Header 下方仍能看到 HUD。
- HUD 的结果按钮可直接进入结果页。
- 中英文分享弹窗渠道顺序正确。
- X、Telegram 等 URL 正确编码并在新窗口打开。
- 微信内、移动系统分享、桌面复制三种路径都有明确反馈。
- 分享弹窗键盘可用、可关闭、焦点恢复。
- lint、type-check、internal links、Vitest、audit、build、Chromium E2E 全部通过。

## 明确不做

- 不生成动态结果图片。
- 不接入微信公众号 JS-SDK。
- 不添加二维码库或第三方分享组件。
- 不更改商品价格、身份规则、SEO 文案或 sitemap。