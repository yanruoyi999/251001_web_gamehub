# Game Opportunity Radar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual creator-facing Game Opportunity Radar content/tool page inside Luma Game Hub that transparently scores MVP delivery fit and captures requests for a paid full report.

**Architecture:** Keep all scoring and recommendation rules in one pure TypeScript module, render them through a small client component, and place that component inside a statically generated guide page. Reuse the existing locale, SEO, UI, sitemap, and guide-index conventions without adding dependencies or backend state.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, next-intl locale routing, Vitest.

## Global Constraints

- Do not add authentication, database tables, AI API calls, payment processing, or new dependencies.
- Do not claim revenue prediction, market share, search volume, customer demand, or platform income data.
- Keep all user inputs in browser memory only.
- Support `zh` and `en` routes using existing `getLocalizedPath` conventions.
- Preserve existing unmerged branches and modify only the new feature branch.

---

### Task 1: Define and test the scoring contract

**Files:**
- Create: `tests/game-opportunity-radar.test.ts`
- Create: `lib/game-opportunity-radar.ts`

**Interfaces:**
- Produces: `evaluateGameOpportunity(input, locale): GameOpportunityResult`
- Input fields: `platform`, `team`, `budget`, `timeline`, `genre`
- Result fields: `score`, `band`, `scope`, `monetizationTest`, `risk`, `evidenceNext`, `disclaimer`

- [ ] **Step 1: Write failing tests** for a lean solo MVP, an over-scoped MMO, localization, deterministic output, and the 20–95 score clamp.
- [ ] **Step 2: Run** `pnpm test tests/game-opportunity-radar.test.ts` and verify failure because the production module does not exist.
- [ ] **Step 3: Implement the minimal pure scoring module** with typed option sets and transparent additive rules.
- [ ] **Step 4: Run** `pnpm test tests/game-opportunity-radar.test.ts` and verify all new tests pass.
- [ ] **Step 5: Commit** with `feat: add game opportunity scoring model`.

### Task 2: Build the browser-only evaluator

**Files:**
- Create: `components/creator/game-opportunity-radar-form.tsx`

**Interfaces:**
- Consumes: `evaluateGameOpportunity`, option types, and `Locale`.
- Produces: `<GameOpportunityRadarForm locale={locale} />`.

- [ ] **Step 1: Render five labelled native selects** with useful defaults and a live result area.
- [ ] **Step 2: Show score, band, recommended scope, monetization test, risk, evidence gap, and disclaimer.**
- [ ] **Step 3: Keep all state local with `useState`; do not send network requests or persist inputs.**
- [ ] **Step 4: Ensure controls, result changes, and privacy note are accessible and bilingual.**
- [ ] **Step 5: Commit** with `feat: add interactive game opportunity evaluator`.

### Task 3: Add the bilingual content page

**Files:**
- Create: `app/[locale]/guides/game-opportunity-radar/page.tsx`

**Interfaces:**
- Consumes: `GameOpportunityRadarForm`, `getLocalizedPath`, SEO helpers, and JSON-LD serializer.
- Produces: static routes `/guides/game-opportunity-radar` and `/en/guides/game-opportunity-radar`.

- [ ] **Step 1: Add static params and localized metadata** with canonical and hreflang entries.
- [ ] **Step 2: Add WebApplication, FAQPage, and BreadcrumbList JSON-LD.**
- [ ] **Step 3: Add hero, product explanation, three-step validation framework, data-boundary section, and internal links.**
- [ ] **Step 4: Add a mailto CTA to `dev@lumagamehub.com` with a prefilled full-report subject; do not claim checkout or payment is live.**
- [ ] **Step 5: Commit** with `feat: add Game Opportunity Radar guide page`.

### Task 4: Connect discovery and indexing

**Files:**
- Modify: `app/[locale]/guides/page.tsx`
- Modify: `app/sitemap.ts`

**Interfaces:**
- Adds one guide-index card and one localized static sitemap path.

- [ ] **Step 1: Add a bilingual guide card** that clearly identifies the page as a creator tool.
- [ ] **Step 2: Add `/guides/game-opportunity-radar` to `staticPaths`** with weekly frequency and focused priority.
- [ ] **Step 3: Run internal-link and unit checks.**
- [ ] **Step 4: Commit** with `seo: link Game Opportunity Radar into guides`.

### Task 5: Full verification and review

**Files:**
- No production files unless verification exposes a defect.

- [ ] **Step 1: Run** `pnpm test`.
- [ ] **Step 2: Run** `pnpm type-check`.
- [ ] **Step 3: Run** `pnpm lint` and distinguish existing warnings from new errors.
- [ ] **Step 4: Run** `pnpm build` and confirm both locale routes are generated.
- [ ] **Step 5: Run** `pnpm check:internal-links` where the environment permits.
- [ ] **Step 6: Review the branch diff for unsupported commercial claims, unrelated changes, missing localization, and accessibility gaps.
- [ ] **Step 7: Open a draft pull request with exact validation evidence and any coverage gaps.**
