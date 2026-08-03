# Spend Bill Gates Money SEO v1.2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the bilingual game page into a stronger long-tail landing page, improve discovery and sharing metadata, add verified internal/external links, and notify IndexNow after release.

**Architecture:** Keep the game client untouched. Centralize route, update-date, social image, IndexNow key, and changed URL constants in a small SEO module. Extend the existing server page and common guide renderer, then add a dependency-free IndexNow script and focused source-contract tests.

**Tech Stack:** Next.js 15.5.21, React 19.2.7, TypeScript, Tailwind 3.4.4, next-intl 4.9.2, Vitest 3.2.4, Playwright, pnpm 10.28.0.

## Global Constraints

- Work only on `feat/spend-bill-gates-money-seo-v1-2-20260804` until merge.
- Preserve `backup/main-before-bill-gates-seo-v1-2-20260804`.
- Do not change game rules, prices, analytics event names, dependencies, global CSS, Tailwind config, database schema, or generic iframe game routing.
- Do not claim IndexNow guarantees indexing or that unverified external backlinks exist.
- Use the custom production domain `https://www.lumagamehub.com` and Vercel project `prj_2FOg6BtpI4CAsnfWUCrdIpdJQlWM` for final release verification.

---

### Task 1: Lock SEO v1.2 contracts with failing tests

**Files:**
- Create: `tests/spend-bill-gates-money-seo-v1-2.test.ts`
- Create: `tests/indexnow.test.ts`

**Interfaces:**
- Consumes: existing page, homepage, guide renderer, sitemap, robots, and README source.
- Produces: source-level acceptance contracts for later tasks.

- [ ] **Step 1: Write the failing SEO source test**

The test reads repository files and requires:

```ts
expect(gamePage).toContain('spend bill gates money game online');
expect(gamePage).toContain('Can I play Spend Bill Gates Money on mobile?');
expect(gamePage).toContain('/og/spend-bill-gates-money.png');
expect(homePage).toContain('/games/spend-bill-gates-money');
expect(guidePage).toContain('SPEND_BILL_GATES_MONEY_GUIDE_LINK_SLUGS');
expect(sitemap).toContain('SPEND_BILL_GATES_MONEY_UPDATED_AT');
expect(readme).toContain('https://www.lumagamehub.com/en/games/spend-bill-gates-money');
```

- [ ] **Step 2: Write the failing IndexNow test**

Require a pure module exporting:

```ts
export function normalizeIndexNowUrls(urls: string[], host: string): string[];
export function createIndexNowPayload(urls: string[]): IndexNowPayload;
```

Test duplicate removal, HTTPS/host validation, and the protocol limit.

- [ ] **Step 3: Push and verify RED in GitHub Actions**

Expected: tests fail because SEO constants, new content, social image, and IndexNow module do not yet exist.

### Task 2: Add shared SEO constants and dedicated OG image

**Files:**
- Create: `lib/games/spend-bill-gates-money-seo.ts`
- Create: `public/og/spend-bill-gates-money.png`

**Interfaces:**
- Produces:

```ts
export const SPEND_BILL_GATES_MONEY_PATH: '/games/spend-bill-gates-money';
export const SPEND_BILL_GATES_MONEY_UPDATED_AT: '2026-08-04T00:00:00.000Z';
export const SPEND_BILL_GATES_MONEY_OG_IMAGE: '/og/spend-bill-gates-money.png';
export const SPEND_BILL_GATES_MONEY_GUIDE_LINK_SLUGS: readonly string[];
```

- [ ] **Step 1: Implement constants**
- [ ] **Step 2: Add a 1200×630 PNG with readable title, `$100 BILLION`, and an unofficial-game line**
- [ ] **Step 3: Run focused tests and commit**

### Task 3: Expand page content and metadata

**Files:**
- Modify: `app/[locale]/games/spend-bill-gates-money/page.tsx`

**Interfaces:**
- Consumes constants from Task 2.

- [ ] **Step 1: Add five bilingual useful content modules**
- [ ] **Step 2: Expand FAQ to five questions**
- [ ] **Step 3: Expand natural long-tail keyword coverage without duplicate paragraphs**
- [ ] **Step 4: Point Open Graph and Twitter metadata to the dedicated PNG**
- [ ] **Step 5: Add `datePublished` and `dateModified` to `VideoGame` JSON-LD**
- [ ] **Step 6: Run page tests and commit**

### Task 4: Add contextual inbound internal links

**Files:**
- Modify: `app/[locale]/page.tsx`
- Modify: `app/[locale]/guides/[slug]/page.tsx`

**Interfaces:**
- Consumes `SPEND_BILL_GATES_MONEY_GUIDE_LINK_SLUGS` and route constants.

- [ ] **Step 1: Add a bilingual Luma Original card or contextual block on the homepage**
- [ ] **Step 2: Add a contextual callout only for the three approved guide slugs**
- [ ] **Step 3: Use varied localized anchor text and `getLocalizedPath()`**
- [ ] **Step 4: Run internal-link and focused tests, then commit**

### Task 5: Improve sitemap, preserve robots, and add IndexNow

**Files:**
- Modify: `app/sitemap.ts`
- Create: `lib/indexnow.ts`
- Create: `scripts/submit-indexnow.ts`
- Create: `public/4accfd418d9633ccd239a4ed51d4f6b4.txt`
- Create: `.github/workflows/indexnow.yml`

**Interfaces:**

```ts
export interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

export function normalizeIndexNowUrls(urls: string[], host?: string): string[];
export function createIndexNowPayload(urls: string[]): IndexNowPayload;
```

- [ ] **Step 1: Refactor standalone sitemap records to support per-page metadata**
- [ ] **Step 2: Emit the game with weekly frequency, priority 0.75, and shared lastModified**
- [ ] **Step 3: Implement pure IndexNow validation and payload helpers**
- [ ] **Step 4: Implement the Node submission script using global `fetch`**
- [ ] **Step 5: Add root verification key file**
- [ ] **Step 6: Add a workflow for relevant `main` path changes and manual dispatch**
- [ ] **Step 7: Verify robots remains unchanged and points to sitemap**
- [ ] **Step 8: Run tests and commit**

### Task 6: Add legitimate GitHub reference and execution record

**Files:**
- Modify: `README.md`
- Create: `docs/releases/2026-08-04-spend-bill-gates-money-seo-v1-2.md`

- [ ] **Step 1: Add one contextual README link to the English canonical page**
- [ ] **Step 2: Record branch, backup, scope, test evidence, Vercel project, IndexNow status, Bing data gaps, and next review date**
- [ ] **Step 3: Run all static tests and commit**

### Task 7: Full verification, review, merge, and production follow-through

- [ ] **Step 1: Run `pnpm lint`**
- [ ] **Step 2: Run `pnpm type-check`**
- [ ] **Step 3: Run `pnpm check:internal-links`**
- [ ] **Step 4: Run `pnpm test`**
- [ ] **Step 5: Run `pnpm audit --prod` or the repository production audit command**
- [ ] **Step 6: Run `pnpm build`**
- [ ] **Step 7: Run `pnpm test:e2e`**
- [ ] **Step 8: Review the complete diff for scope and accessibility regressions**
- [ ] **Step 9: Mark PR ready and squash merge to `main`**
- [ ] **Step 10: Verify the custom-domain Vercel project receives a READY production deployment**
- [ ] **Step 11: Verify both localized formal URLs, robots, sitemap, key file, OG image, and the new client/server content**
- [ ] **Step 12: Submit the changed URL batch to IndexNow and record HTTP status**
- [ ] **Step 13: Update the release record with exact merge and deployment evidence**
