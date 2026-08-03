# Spend Bill Gates Money Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual, mobile-first, browser-only Spend Bill Gates Money game as an independent Luma Game Hub route with SEO, analytics, discovery links, tests, and no new dependencies.

**Architecture:** A server page owns metadata, localized editorial copy, JSON-LD, FAQ, disclaimer, and internal links. A focused client component owns game state, feedback, results, sharing, restart, and analytics. Pure data and game rules live in `lib/games/spend-bill-gates-money.ts` so they can be tested without a browser.

**Tech Stack:** Next.js 15.5.21, React 19.2.7, TypeScript, Tailwind CSS 3.4.4, next-intl 4.9.2, Vitest 3.2.4, Playwright, pnpm 10.28.0.

## Global Constraints

- Work only on `feat/spend-bill-gates-money-mvp-20260803`, based on `main`.
- Do not modify `app/[locale]/games/[slug]/page.tsx`, `lib/mock-games.ts`, `tailwind.config.ts`, `app/globals.css`, `package.json`, lockfiles, or database schema.
- Do not add dependencies, databases, authentication, live net-worth APIs, dynamic result images, Canvas, WebGL, Framer Motion, or third-party animation libraries.
- Use integer USD amounts and a fixed initial wealth of `100_000_000_000`.
- Default mobile layout first; only add `md:` enhancements.
- Use `trackInteraction()` and only low-cardinality analytics properties.
- All visible copy, including product text, feedback, result, FAQ, disclaimer, and sharing, must be bilingual.
- The game must state that it is unofficial and not affiliated with or endorsed by Bill Gates, Microsoft, or related organizations.

---

### Task 1: Lock the pure data and game-rule contract

**Files:**
- Create: `tests/spend-bill-gates-money-data.test.ts`
- Create: `lib/games/spend-bill-gates-money.ts`

**Interfaces:**
- Produces: `INITIAL_WEALTH`, `PRODUCTS`, `Product`, `Purchase`, `BillionaireStyle`, `calculateRemainingWealth()`, `upsertPurchase()`, `getCategorySpend()`, `calculateBillionaireStyle()`, `formatCompactUsd()`, `formatFullUsd()`, `getSpentBucket()`.
- Consumes: no project runtime dependencies.

- [ ] **Step 1: Write failing data and rules tests**

Create tests that assert:

```ts
expect(PRODUCTS).toHaveLength(15);
expect(new Set(PRODUCTS.map((product) => product.id)).size).toBe(15);
expect(PRODUCTS.every((product) => Number.isInteger(product.price) && product.price > 0)).toBe(true);
expect(PRODUCTS.every((product) => product.name.zh && product.name.en)).toBe(true);
expect(PRODUCTS.every((product) => product.description.zh && product.description.en)).toBe(true);
expect(calculateRemainingWealth([{ productId: 'space-program', count: 20 }])).toBe(0);
expect(upsertPurchase([], 'private-jet')).toEqual([{ productId: 'private-jet', count: 1 }]);
expect(upsertPurchase([{ productId: 'private-jet', count: 1 }], 'private-jet')).toEqual([{ productId: 'private-jet', count: 2 }]);
expect(calculateBillionaireStyle([{ productId: 'golden-toilet', count: 1 }])).toBe('chaos');
expect(calculateBillionaireStyle([{ productId: 'space-program', count: 1 }])).toBe('empire');
expect(calculateBillionaireStyle([{ productId: 'build-hospitals', count: 2 }])).toBe('world-changer');
expect(calculateBillionaireStyle([])).toBe('visionary');
```

- [ ] **Step 2: Run the focused test and verify RED**

Run in CI or an available project runner:

```bash
pnpm test -- --run tests/spend-bill-gates-money-data.test.ts
```

Expected: failure because the production module does not exist.

- [ ] **Step 3: Implement the minimal pure module**

Create all 15 bilingual product records and deterministic helpers. `calculateRemainingWealth()` must clamp at zero, but the UI must still prevent unaffordable purchases. `calculateBillionaireStyle()` must use category spending amounts, prioritize Golden Toilet, and return `visionary` on ties.

- [ ] **Step 4: Re-run focused tests and verify GREEN**

```bash
pnpm test -- --run tests/spend-bill-gates-money-data.test.ts
```

Expected: all focused tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/games/spend-bill-gates-money.ts tests/spend-bill-gates-money-data.test.ts
git commit -m "feat: add billionaire game data and rules"
```

### Task 2: Build the mobile-first client game

**Files:**
- Create: `tests/spend-bill-gates-money-game.test.ts`
- Create: `components/game/spend-bill-gates-money-game.tsx`

**Interfaces:**
- Consumes: pure exports from `lib/games/spend-bill-gates-money.ts`, `trackInteraction()` from `lib/analytics/events`, locale `'zh' | 'en'`.
- Produces: `SpendBillGatesMoneyGame({ locale })`.

- [ ] **Step 1: Write failing static render tests**

Use `renderToStaticMarkup()` to assert both locales render the localized hero, start button, product names, finish button, disclaimer cue, `aria-live="polite"`, `sticky top-16`, `md:grid-cols-3`, and reduced-motion classes.

- [ ] **Step 2: Verify RED**

```bash
pnpm test -- --run tests/spend-bill-gates-money-game.test.ts
```

Expected: failure because the component does not exist.

- [ ] **Step 3: Implement initial client state and mobile layout**

Implement:

```ts
const [started, setStarted] = React.useState(false);
const [purchases, setPurchases] = React.useState<Purchase[]>([]);
const [finished, setFinished] = React.useState(false);
const [feedback, setFeedback] = React.useState<FeedbackState | null>(null);
const [shareFallback, setShareFallback] = React.useState<string | null>(null);
```

Hero must use a local dark gradient, `min-h-[min(70svh,44rem)]`, a responsive nowrap amount, a 240×56 start button, and reduced-motion-safe breathing animation. Do not modify global CSS.

- [ ] **Step 4: Implement purchase rules and feedback**

For each purchase:

- Look up the product by ID.
- Return immediately if `remaining < product.price`.
- Update count by ID.
- Trigger feedback based only on `product.feedback`.
- Clear feedback after 1500ms and clean up timers on unmount.
- Track `billionaire_product_buy` with allowed properties only.

Use a non-focus-stealing presentational Epic overlay and an `aria-live="polite"` region for normal and legendary feedback.

- [ ] **Step 5: Implement finish, result, sharing, and restart**

- Disable finish until at least one purchase exists.
- Derive identity, total spent, remaining wealth, and purchase list from pure helpers.
- `navigator.share` first; clipboard fallback second; visible copy field third.
- Track finish, share, and restart events.
- Restart restores all initial state.

- [ ] **Step 6: Re-run focused tests and verify GREEN**

```bash
pnpm test -- --run tests/spend-bill-gates-money-game.test.ts
```

Expected: all focused tests pass.

- [ ] **Step 7: Commit**

```bash
git add components/game/spend-bill-gates-money-game.tsx tests/spend-bill-gates-money-game.test.ts
git commit -m "feat: add billionaire spending game interface"
```

### Task 3: Add the independent route, metadata, structured data, FAQ, and disclaimer

**Files:**
- Create: `tests/spend-bill-gates-money-page.test.ts`
- Create: `app/[locale]/games/spend-bill-gates-money/page.tsx`

**Interfaces:**
- Consumes: `SpendBillGatesMoneyGame`, `getLocalizedPath`, `locales`, `buildAbsoluteUrl`, default OG/Twitter images, `serializeJsonLd`.
- Produces: localized static route and metadata for Chinese and English.

- [ ] **Step 1: Write failing page tests**

Read the source and assert it contains:

```ts
'generateStaticParams'
'SpendBillGatesMoneyGame'
"'VideoGame'"
"'FAQPage'"
"'BreadcrumbList'"
'not affiliated with or endorsed by Bill Gates'
'与比尔·盖茨、微软或任何相关组织无关'
'/games/spend-bill-gates-money'
```

Import `generateMetadata()` and assert Chinese and English title, canonical, and hreflang values.

- [ ] **Step 2: Verify RED**

```bash
pnpm test -- --run tests/spend-bill-gates-money-page.test.ts
```

Expected: route module missing.

- [ ] **Step 3: Implement the server page**

Follow the independent route pattern from `monster-survivors`, while following the structured-data pattern from the generic game page. Include:

- `generateStaticParams()` for both locales.
- Locale-normalized page copy.
- Metadata with title, description, canonical, hreflang, OG, Twitter.
- `VideoGame`, `FAQPage`, and `BreadcrumbList` scripts via `serializeJsonLd()`.
- Breadcrumb links, About section, three FAQs, related `/games` and guide links.
- Disclaimer in visible body and FAQ.

- [ ] **Step 4: Re-run focused tests and verify GREEN**

```bash
pnpm test -- --run tests/spend-bill-gates-money-page.test.ts
```

Expected: all focused tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/[locale]/games/spend-bill-gates-money/page.tsx tests/spend-bill-gates-money-page.test.ts
git commit -m "feat: add billionaire game route and SEO"
```

### Task 4: Add sitemap and game-list discovery without touching catalogue totals

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `app/[locale]/games/page.tsx`
- Modify: `tests/spend-bill-gates-money-page.test.ts`

**Interfaces:**
- Consumes: existing `standaloneGamePaths`, `getLocalizedPath()`, existing `Card` and `Button` UI patterns.
- Produces: sitemap entries and a separate Luma Original discovery card.

- [ ] **Step 1: Extend the page test first**

Add source assertions that:

- `app/sitemap.ts` contains `/games/spend-bill-gates-money` exactly once in the source.
- `app/[locale]/games/page.tsx` contains `Luma Original`, `Luma 原创互动游戏`, and `getLocalizedPath(locale, '/games/spend-bill-gates-money')`.
- The card appears before the catalogue game grid and does not alter `total` or `totalPages` calculations.

- [ ] **Step 2: Verify RED**

```bash
pnpm test -- --run tests/spend-bill-gates-money-page.test.ts
```

Expected: discovery and sitemap assertions fail.

- [ ] **Step 3: Implement minimal discovery changes**

- Append one path to `standaloneGamePaths`.
- Add one bilingual featured card above paginated results.
- Do not add a mock game, database row, category, tag, or pagination item.

- [ ] **Step 4: Verify GREEN**

```bash
pnpm test -- --run tests/spend-bill-gates-money-page.test.ts
```

Expected: focused tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/sitemap.ts app/[locale]/games/page.tsx tests/spend-bill-gates-money-page.test.ts
git commit -m "feat: surface billionaire game in discovery"
```

### Task 5: Run complete gates and fix root causes only

**Files:**
- Modify only files required by a proven failing gate.

**Interfaces:**
- Consumes: complete feature branch.
- Produces: a branch proven by CI and Vercel checks.

- [ ] **Step 1: Create a draft PR to trigger pull-request CI**

Base: `main`; head: `feat/spend-bill-gates-money-mvp-20260803`.

- [ ] **Step 2: Run and inspect all gates**

Required CI commands:

```bash
pnpm lint
pnpm type-check
pnpm check:internal-links
pnpm test -- --run
pnpm audit:prod
pnpm build
```

Also inspect Vercel deployment status. If Playwright can run in the available workflow/environment, execute the mobile flow at 375px; otherwise report the E2E coverage gap explicitly rather than claiming it passed.

- [ ] **Step 3: Debug failures systematically**

For each failure:

1. Read the full job log and reproduce from the exact failing command if possible.
2. Identify the root cause and compare with a working project pattern.
3. Add or adjust a regression test first.
4. Make the smallest code correction.
5. Re-run the focused test, then the complete gate.

Do not change dependencies, global styles, catalogue architecture, or unrelated code to bypass failures.

- [ ] **Step 4: Final requirements review**

Verify every requirement in the design spec against the code and test output, including bilingual copy, Header/HUD offset, no horizontal overflow classes, feedback levels, share fallback, disclaimer, sitemap, discovery card, analytics fields, and no forbidden file changes.

- [ ] **Step 5: Final commit and report**

Commit only after fresh verification evidence. Preserve the branch and draft PR for review; do not merge to `main` without explicit approval.
