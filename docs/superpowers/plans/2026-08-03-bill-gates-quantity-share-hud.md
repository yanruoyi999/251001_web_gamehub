# Spend Bill Gates Money Interaction Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add reversible product quantities, a truly persistent fortune HUD, and a bilingual channel-based share sheet with practical WeChat fallbacks.

**Architecture:** Keep purchase arithmetic pure in the existing game rules module. Add one pure sharing module for channel ordering and URL construction, plus one focused client ShareSheet component for browser APIs and accessible dialog behavior. The existing game component coordinates state, fixed HUD, analytics, and the new components without changing SEO or catalogue architecture.

**Tech Stack:** Next.js 15.5.21, React 19.2.7, TypeScript, Tailwind CSS 3.4.4, Vitest 3.2.4, Playwright, pnpm 10.28.0.

## Global Constraints

- Work only on `feat/bill-gates-quantity-share-hud-20260803`, based on `main@219fa11a7127483d68b322d88ad61c4845032fed`.
- Preserve `backup/main-before-bill-gates-share-hud-20260803-2330`.
- Do not modify global CSS, Tailwind config, package files, database schema, generic game detail route, mock catalogue, SEO copy, sitemap, product prices, or identity rules.
- Add no dependency, backend route, dynamic OG image, QR library, or WeChat JS-SDK integration.
- All user-visible text and accessibility labels must be bilingual.
- All sharing values must be URL-encoded and external share windows must use `noopener,noreferrer`.
- Use TDD: failing focused test, minimal implementation, focused green, then complete gates.

---

### Task 1: Add reversible purchase arithmetic

**Files:**
- Modify: `tests/spend-bill-gates-money-data.test.ts`
- Modify: `lib/games/spend-bill-gates-money.ts`

**Interfaces:**
- Produces: `decrementPurchase(purchases: Purchase[], productId: string): Purchase[]`.
- Consumes: existing `Purchase`, product lookup, and immutable array rules.

- [ ] **Step 1: Extend the data test with decrement behavior**

Add assertions that decrementing count 2 returns count 1 without mutating input, decrementing count 1 removes the entry, decrementing zero/missing/unknown items returns an equivalent immutable array, and a buy-buy-remove sequence restores one product price in `calculateRemainingWealth()`.

- [ ] **Step 2: Run the focused test and verify RED**

```bash
pnpm test -- --run tests/spend-bill-gates-money-data.test.ts
```

Expected: import/export failure for `decrementPurchase`.

- [ ] **Step 3: Implement the pure decrement helper**

Rules:

```ts
export function decrementPurchase(
  purchases: Purchase[],
  productId: string,
): Purchase[] {
  if (!PRODUCT_BY_ID.has(productId)) return purchases.map((purchase) => ({ ...purchase }));
  const existing = purchases.find((purchase) => purchase.productId === productId);
  if (!existing || existing.count <= 0) return purchases.map((purchase) => ({ ...purchase }));
  if (existing.count === 1) {
    return purchases
      .filter((purchase) => purchase.productId !== productId)
      .map((purchase) => ({ ...purchase }));
  }
  return purchases.map((purchase) =>
    purchase.productId === productId
      ? { ...purchase, count: purchase.count - 1 }
      : { ...purchase },
  );
}
```

- [ ] **Step 4: Re-run focused test and verify GREEN**

```bash
pnpm test -- --run tests/spend-bill-gates-money-data.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add lib/games/spend-bill-gates-money.ts tests/spend-bill-gates-money-data.test.ts
git commit -m "feat: support reversible billionaire purchases"
```

### Task 2: Define deterministic share channels and URLs

**Files:**
- Create: `tests/spend-bill-gates-money-share.test.ts`
- Create: `lib/games/spend-bill-gates-money-share.ts`

**Interfaces:**
- Produces: `ShareChannel`, `ShareMethod`, `getShareChannels(locale)`, `buildExternalShareUrl(channel, text, url, title)`.
- Consumes: `SpendGameLocale`.

- [ ] **Step 1: Write the failing sharing tests**

Assert exact channel order:

```ts
expect(getShareChannels('en').map((item) => item.id)).toEqual([
  'x', 'telegram', 'whatsapp', 'facebook', 'system', 'copy',
]);
expect(getShareChannels('zh').map((item) => item.id)).toEqual([
  'wechat', 'weibo', 'qq', 'telegram', 'x', 'copy', 'system',
]);
```

Assert URL construction includes encoded text and URL for X, Telegram, WhatsApp, Weibo and QQ; Facebook includes encoded URL; `wechat`, `system`, and `copy` return `null` because they require local browser handling.

- [ ] **Step 2: Run focused test and verify RED**

```bash
pnpm test -- --run tests/spend-bill-gates-money-share.test.ts
```

Expected: module missing.

- [ ] **Step 3: Implement the pure sharing module**

Use these endpoints:

```text
X: https://twitter.com/intent/tweet?text=...&url=...
Telegram: https://t.me/share/url?url=...&text=...
WhatsApp: https://wa.me/?text=...
Facebook: https://www.facebook.com/sharer/sharer.php?u=...
Weibo: https://service.weibo.com/share/share.php?url=...&title=...
QQ: https://connect.qq.com/widget/shareqq/index.html?url=...&title=...&summary=...
```

Channel records include bilingual labels, short descriptions, and simple text/icon tokens without importing brand packages.

- [ ] **Step 4: Re-run focused test and verify GREEN**

```bash
pnpm test -- --run tests/spend-bill-gates-money-share.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add lib/games/spend-bill-gates-money-share.ts tests/spend-bill-gates-money-share.test.ts
git commit -m "feat: define billionaire share channels"
```

### Task 3: Build the accessible bilingual ShareSheet

**Files:**
- Create: `components/game/spend-bill-gates-money-share-sheet.tsx`
- Modify: `tests/spend-bill-gates-money-game.test.ts`

**Interfaces:**
- Consumes: locale, `open`, `onClose`, share text/url/title, identity emoji/label, formatted total spent, and `onShare(method)` callback.
- Produces: `SpendBillGatesMoneyShareSheet`.

Component props:

```ts
interface SpendBillGatesMoneyShareSheetProps {
  locale: SpendGameLocale;
  open: boolean;
  onClose: () => void;
  shareText: string;
  shareUrl: string;
  shareTitle: string;
  identityEmoji: string;
  identityLabel: string;
  totalSpentLabel: string;
  totalSpentValue: string;
  onShare: (method: ShareMethod) => void;
}
```

- [ ] **Step 1: Extend static contract tests first**

Assert the new component file exists and contains `role="dialog"`, `aria-modal="true"`, locale channel ordering through `getShareChannels`, Escape handling, focus restoration, `navigator.share`, clipboard fallback, WeChat user-agent detection using `MicroMessenger`, and `window.open` with `noopener,noreferrer`.

- [ ] **Step 2: Run focused test and verify RED**

```bash
pnpm test -- --run tests/spend-bill-gates-money-game.test.ts
```

Expected: missing ShareSheet file/contract.

- [ ] **Step 3: Implement the component**

Behavior:

- When opened, remember `document.activeElement`, focus close button, and lock only the dialog interaction—not page scroll globally.
- Close on Escape or backdrop click; restore opener focus.
- Render as bottom sheet below `sm`, centered max-width dialog at `sm+`.
- Display result preview card before channel buttons.
- External channels call `window.open(buildExternalShareUrl(...), '_blank', 'noopener,noreferrer')`, then `onShare(channel)` and close.
- System calls `navigator.share`; `AbortError` is silent; unsupported/failure uses copy fallback.
- Copy writes `shareText + '\n' + shareUrl`; if clipboard fails, expose a read-only textarea.
- WeChat inside `MicroMessenger`: show instruction panel and record `wechat` without closing so the user can read it.
- WeChat outside the app: use system share when available, otherwise copy and show the desktop/mobile paste instruction.

- [ ] **Step 4: Re-run focused test and verify GREEN**

```bash
pnpm test -- --run tests/spend-bill-gates-money-game.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add components/game/spend-bill-gates-money-share-sheet.tsx tests/spend-bill-gates-money-game.test.ts
git commit -m "feat: add billionaire share sheet"
```

### Task 4: Integrate quantity controls, fixed HUD, and channel sharing

**Files:**
- Modify: `components/game/spend-bill-gates-money-game.tsx`
- Modify: `tests/spend-bill-gates-money-game.test.ts`

**Interfaces:**
- Consumes: `decrementPurchase`, `SpendBillGatesMoneyShareSheet`, and `ShareMethod`.
- Produces: updated `SpendBillGatesMoneyGame` behavior.

- [ ] **Step 1: Strengthen static contract tests before implementation**

Assert source contains:

```text
data-testid={`remove-${product.id}`}
fixed left-0 right-0 top-16 z-40
billionaire-hud-spacer
billionaire-hud-finish
billionaire_product_remove
billionaire_share_open
SpendBillGatesMoneyShareSheet
```

Also replace the obsolete `sticky top-16 z-40` assertion.

- [ ] **Step 2: Run focused test and verify RED**

```bash
pnpm test -- --run tests/spend-bill-gates-money-game.test.ts
```

- [ ] **Step 3: Add remove state flow**

Implement `handleRemove(product)` using the current ref state, return immediately at count zero, call `decrementPurchase`, update ref/state, show a localized refund Toast, and track `billionaire_product_remove` with product id, feedback level, and new purchase count.

Extend feedback state with `action: 'buy' | 'remove'`; only buy actions use Epic/Legendary special feedback.

- [ ] **Step 4: Replace each product BUY-only footer with quantity controls**

Use 44px minimum targets:

```text
[− disabled at 0] [×count] [+ disabled when unaffordable]
```

Keep explicit localized accessible labels such as `Remove one Private Jet` and `Add one Private Jet`.

- [ ] **Step 5: Make HUD fixed with a spacer and result shortcut**

- Fixed HUD exists only while `started && !finished`.
- Add `data-testid="billionaire-hud"` and `data-testid="billionaire-hud-spacer"`.
- Include `billionaire-hud-finish`, disabled until at least one purchase.
- Reuse `handleFinish()`.
- Preserve Header z-index ordering and no-overflow layout.

- [ ] **Step 6: Replace direct share with ShareSheet state**

Add `shareOpen` state. Main share button opens the sheet and tracks `billionaire_share_open`. Build canonical current URL by stripping hash and preserve locale route. Pass preview values and an `onShare` callback that tracks `billionaire_share_click` with channel method.

Remove obsolete direct `handleShare()` logic from the game component; clipboard/manual behavior lives in ShareSheet.

- [ ] **Step 7: Re-run focused tests and verify GREEN**

```bash
pnpm test -- --run tests/spend-bill-gates-money-data.test.ts tests/spend-bill-gates-money-share.test.ts tests/spend-bill-gates-money-game.test.ts
```

- [ ] **Step 8: Commit**

```bash
git add components/game/spend-bill-gates-money-game.tsx tests/spend-bill-gates-money-game.test.ts
git commit -m "feat: improve billionaire game controls and sharing"
```

### Task 5: Upgrade browser regression coverage

**Files:**
- Modify: `tests/e2e/spend-bill-gates-money.spec.ts`

**Interfaces:**
- Consumes: production UI test IDs and channel behavior.
- Produces: mobile and desktop regression evidence.

- [ ] **Step 1: Replace the current single flow with two focused tests**

Mobile 375px test:

- Start game.
- Buy Private Jet twice.
- Assert quantity 2 and balance `$99.9B` or exact derived display.
- Remove once; assert quantity 1 and balance increases.
- Remove again; assert quantity 0 and purchase record disappears.
- Buy Golden Toilet, finish from fixed HUD shortcut, open share sheet.
- Assert English order starts X, Telegram, WhatsApp, Facebook.
- Stub `window.open`, click Telegram, and assert encoded Telegram URL plus `noopener,noreferrer`.

Desktop 1280px test:

- Start game, buy one item, scroll to final product/purchase section.
- Assert HUD bounding box remains directly below Header.
- Finish using HUD button.
- Open share sheet and assert centered dialog.
- Visit Chinese route, finish minimal flow, and assert WeChat, Weibo, QQ appear before Telegram and X.
- Stub clipboard and no system share; click WeChat and assert copy/paste instruction.

- [ ] **Step 2: Run E2E and inspect RED failures**

```bash
pnpm test:e2e -- tests/e2e/spend-bill-gates-money.spec.ts
```

- [ ] **Step 3: Fix only proven implementation or test issues**

Use the exact failing locator/behavior. Do not weaken assertions for required behavior.

- [ ] **Step 4: Re-run E2E and verify GREEN**

```bash
pnpm test:e2e -- tests/e2e/spend-bill-gates-money.spec.ts
```

- [ ] **Step 5: Commit**

```bash
git add tests/e2e/spend-bill-gates-money.spec.ts
git commit -m "test: cover quantity hud and share channels"
```

### Task 6: Complete gates, review, and release

**Files:**
- Modify only files required by a proven failing gate.

- [ ] **Step 1: Open a draft PR to trigger the existing CI and three Vercel previews**

Base `main`; head `feat/bill-gates-quantity-share-hud-20260803`.

- [ ] **Step 2: Run all gates**

```bash
pnpm lint
pnpm type-check
pnpm check:internal-links
pnpm test -- --run
pnpm audit:prod
pnpm build
pnpm test:e2e
```

- [ ] **Step 3: Review changed files and forbidden boundaries**

Confirm no changes outside docs, the game rules/share modules, game/share components, focused tests, and E2E.

- [ ] **Step 4: Verify Vercel previews and perform smoke checks**

Check English and Chinese preview routes, fixed HUD, add/remove, share channel order, Telegram URL, WeChat fallback, metadata preservation, and no horizontal overflow.

- [ ] **Step 5: Update PR verification record**

Record exact head SHA, command results, test counts, Vercel states, backup branch, known non-blocking warnings, and any conditional skip.

- [ ] **Step 6: Merge only after all checks pass**

Squash merge with expected head SHA, then verify `main` production deployments and the formal domain routes.