# Game Opportunity Radar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual creator-facing Game Opportunity Radar content/tool page inside Luma Game Hub that transparently screens MVP delivery fit and captures measurable interest in a paid full report.

**Architecture:** Keep all scoring and recommendation rules in one pure TypeScript module, render them through a client component, and place that component inside a statically generated guide page. Reuse the existing locale, SEO, analytics, sitemap, and guide-index conventions without adding backend state or dependencies. Keep selected constraint values in browser memory; analytics records only anonymous completion and report-intent events.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, next-intl locale routing, Vitest, existing Vercel Analytics/GA4/Clarity interaction helper.

## Global Constraints

- Do not add authentication, database tables, AI API calls, payment processing, or new dependencies.
- Do not claim revenue prediction, market share, search volume, customer demand, or platform income data.
- Keep platform, team, budget, timeline, and genre selections in browser memory only; never send them to analytics or a server.
- Keep analytics event names within GA4's 40-character event-name limit.
- Support `zh` and `en` routes using existing `getLocalizedPath` conventions.
- Preserve existing unmerged branches and modify only `feat/game-opportunity-radar-mvp-20260730`.
- Do not merge or deploy to production without explicit approval.

---

### Task 1: Define and test the scoring contract

**Files:**
- Create: `tests/game-opportunity-radar.test.ts`
- Create: `lib/game-opportunity-radar.ts`

**Interfaces:**
- Produces: `evaluateGameOpportunity(input, locale): GameOpportunityResult`
- Input fields: `platform`, `team`, `budget`, `timeline`, `genre`
- Result fields: `score`, `band`, `scope`, `monetizationTest`, `risk`, `evidenceNext`, `disclaimer`

- [x] **Step 1:** Write failing tests for a lean solo MVP, an over-scoped MMO, localization, deterministic output, and the 20–95 score clamp.
- [x] **Step 2:** Run the focused tests and verify failure because the production module does not exist.
- [x] **Step 3:** Implement the minimal pure scoring module with typed option sets and transparent additive rules.
- [x] **Step 4:** Run the focused tests and verify all new tests pass.
- [x] **Step 5:** Commit the scoring engine and tests.

### Task 2: Build the browser-only evaluator

**Files:**
- Create: `components/creator/game-opportunity-radar-form.tsx`
- Create: `tests/game-opportunity-radar-form.test.ts`

**Interfaces:**
- Consumes: `evaluateGameOpportunity`, option types, and `Locale`.
- Produces: `<GameOpportunityRadarForm locale={locale} />`.

- [x] **Step 1:** Write failing bilingual render tests for labelled controls, privacy boundary, and non-revenue disclaimer.
- [x] **Step 2:** Run the tests and verify failure because the component does not exist.
- [x] **Step 3:** Render five labelled native selects with useful defaults and a live result area.
- [x] **Step 4:** Show score, band, recommended scope, monetization test, risk, evidence gap, and disclaimer.
- [x] **Step 5:** Keep all selected values local; do not send network requests or persist inputs.
- [x] **Step 6:** Commit the evaluator and tests.

### Task 3: Add the bilingual content page

**Files:**
- Create: `app/[locale]/guides/game-opportunity-radar/page.tsx`
- Create: `tests/game-opportunity-radar-page.test.ts`

**Interfaces:**
- Consumes: `GameOpportunityRadarForm`, `getLocalizedPath`, SEO helpers, and JSON-LD serializer.
- Produces: static routes `/guides/game-opportunity-radar` and `/en/guides/game-opportunity-radar`.

- [x] **Step 1:** Write a failing source contract test for bilingual metadata, evaluator inclusion, report CTA, structured data, and evidence boundary.
- [x] **Step 2:** Add static params and localized metadata with canonical and hreflang entries.
- [x] **Step 3:** Add WebApplication, FAQPage, and BreadcrumbList JSON-LD.
- [x] **Step 4:** Add hero, product explanation, three-step validation framework, data-boundary section, and internal links.
- [x] **Step 5:** Add a mailto CTA to `dev@lumagamehub.com`; do not claim checkout or payment is live.
- [x] **Step 6:** Run the page test and commit the page.

### Task 4: Connect discovery and indexing

**Files:**
- Modify: `app/[locale]/guides/page.tsx`
- Modify: `app/sitemap.ts`
- Create: `tests/game-opportunity-radar-discovery.test.ts`

**Interfaces:**
- Adds one guide-index card and one localized static sitemap path.

- [x] **Step 1:** Write failing guide-index and sitemap discovery tests.
- [x] **Step 2:** Add a bilingual guide card that identifies the page as a creator tool.
- [x] **Step 3:** Add `/guides/game-opportunity-radar` to `staticPaths`.
- [x] **Step 4:** Run the discovery and internal-link checks.
- [x] **Step 5:** Commit the discovery changes.

### Task 5: Make commercial validation measurable

**Files:**
- Modify: `components/creator/game-opportunity-radar-form.tsx`
- Modify: `tests/game-opportunity-radar-form.test.ts`
- Create: `tests/game-opportunity-radar-validation-signals.test.ts`

**Interfaces:**
- Consumes: `trackInteraction(eventName, properties)` from `lib/analytics/events.ts`.
- Produces anonymous events: `game_radar_result_personalized` and `game_radar_report_intent_clicked`.

- [x] **Step 1:** Write failing tests requiring the untouched score to be labelled as a default example and requiring measurable validation events.
- [x] **Step 2:** Run CI #287 and verify the tests fail for the missing behavior.
- [x] **Step 3:** Add bilingual default-example and personalized-result status text.
- [x] **Step 4:** Record one event on the first user change and one event when the report CTA is clicked.
- [x] **Step 5:** Ensure event properties contain only `source` and `locale`, not selected constraint values.
- [x] **Step 6:** Write a failing test enforcing event names no longer than 40 characters; run CI #289 and verify failure against the initial overlong names.
- [x] **Step 7:** Shorten event names to GA4-compatible values and update the privacy disclosure.
- [x] **Step 8:** Update the existing privacy test to assert stable semantics instead of an exact sentence.

### Task 6: Full verification and review

**Files:**
- No additional production files unless verification exposes a defect.

- [x] **Step 1:** Run lint: 0 errors and 98 existing warnings.
- [x] **Step 2:** Run type-check: passed.
- [x] **Step 3:** Run internal-link audit: 29 guides, 200 game slugs, and 23 rendered page files passed.
- [x] **Step 4:** Run unit tests: 43 files and 131 tests passed.
- [x] **Step 5:** Run production dependency audit: no known vulnerabilities.
- [x] **Step 6:** Run production build and confirm both locale routes are generated.
- [x] **Step 7:** Verify Vercel preview deployments are READY on exact head `6e67a6ba2ab310d9bbebbe4fef7574f18ffd8375`.
- [x] **Step 8:** Verify Chinese and English preview routes return HTTP 200 with canonical, hreflang, structured data, example-state label, privacy disclosure, and report CTA.
- [x] **Step 9:** Keep PR #11 as Draft; do not merge or deploy to production.
