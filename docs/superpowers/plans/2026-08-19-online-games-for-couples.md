# Online Games for Couples Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship one indexable `/games/online-games-for-couples` product page with three original local-only couple interactions, deterministic shareable challenge decks, SEO/schema, contextual internal links, analytics, and browser regression coverage.

**Architecture:** Reuse Luma's existing static localized page, analytics, metadata, sitemap, and Playwright patterns. Keep all couple-game state in one focused client component and a pure prompt/seed module; no database, account, realtime room, or third-party game runtime is introduced.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, next-intl path helpers, Vitest, Playwright, existing Luma analytics helpers.

**Spec:** `docs/superpowers/specs/2026-08-19-online-games-for-couples-design.md`

## Global Constraints

- Build only the #1 keyword opportunity in this branch: `online games for couples`.
- Do not modify homepage recommendations in v1.
- Do not create near-duplicate keyword pages.
- Do not persist names, answers, relationship data, or results.
- Do not add database, websocket, authentication, or third-party game dependencies.
- Challenge URLs may contain only a deterministic challenge code, never answers.
- Keep analytics free of prompt text and personal answers.
- Existing Two-Player SEO and runtime behavior must not regress.

---

### Task 1: Couples contract and deterministic prompt model

**Files:**
- Create: `tests/online-games-for-couples.test.ts`
- Create: `lib/games/online-games-for-couples.ts`

**Interfaces:**
- Produces `COUPLES_GAMES_PATH`, `COUPLE_GAMES`, `normalizeChallengeCode(value)`, and `buildCouplePromptOrder(gameSlug, challengeCode)`.
- `COUPLE_GAMES` exposes three stable slugs: `this-or-that-duo`, `couple-match-quiz`, `quick-couple-challenge`.

- [ ] Write a failing Vitest contract that expects the pure module, three original games, deterministic challenge ordering, and no answer-bearing URL fields.
- [ ] Push the failing test and verify GitHub Actions fails specifically because the module/page does not yet exist.
- [ ] Implement the minimal pure module with fixed original prompt banks and deterministic seeded ordering.
- [ ] Verify the contract passes and all existing unit tests remain green.
- [ ] Commit as `feat: add couples game prompt model`.

### Task 2: Interactive Couples player

**Files:**
- Create: `components/game/online-games-for-couples-player.tsx`
- Extend: `tests/online-games-for-couples.test.ts`

**Interfaces:**
- Consumes `COUPLE_GAMES`, `normalizeChallengeCode`, `buildCouplePromptOrder`.
- Emits analytics events `couples_collection_view`, `couple_game_select`, `couple_game_start`, `couple_game_complete`, `couple_share` through `trackInteraction`.

- [ ] Add failing source/behavior contracts for the three selectable games, local-only state, challenge copy/share, completion event, and answer privacy.
- [ ] Verify RED on the missing player component.
- [ ] Implement a single client component with game picker, challenge code/link, This-or-That two-answer flow, match-quiz completion score, and quick challenge deck.
- [ ] Ensure share links contain only `challenge=<code>` and no answers.
- [ ] Verify unit contracts pass.
- [ ] Commit as `feat: add original couples browser games`.

### Task 3: SEO landing page and schemas

**Files:**
- Create: `app/[locale]/games/online-games-for-couples/page.tsx`
- Extend: `tests/online-games-for-couples.test.ts`

**Interfaces:**
- Canonical route constant: `/games/online-games-for-couples`.
- Page consumes `OnlineGamesForCouplesPlayer` and `COUPLE_GAMES`.

- [ ] Add failing metadata/schema/page-structure tests for H1, primary cluster, canonical, hreflang/x-default, indexability, CollectionPage, ItemList, FAQPage, BreadcrumbList, and interactive block before long-form sections.
- [ ] Verify RED on absent page.
- [ ] Implement bilingual page copy distinguishing same-device and long-distance asynchronous play.
- [ ] Add privacy/local-state statement and comparison table.
- [ ] Verify targeted tests pass.
- [ ] Commit as `feat: publish online games for couples hub`.

### Task 4: Sitemap and contextual internal links

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `app/[locale]/games/page.tsx`
- Modify: `app/[locale]/games/2-player-unblocked/page.tsx`
- Modify one existing no-download guide source in `lib/seo-landing-content.ts` if its related-link model supports a natural contextual link.
- Extend: `tests/online-games-for-couples.test.ts`

**Interfaces:**
- New page receives at least three relevant body/contextual inlinks without changing the homepage.

- [ ] Add failing tests for sitemap membership and the three contextual inlinks.
- [ ] Verify RED.
- [ ] Add the route to sitemap with weekly frequency and priority below `/games` and around the Two-Player hub.
- [ ] Add a concise Couples collection entry to `/games`.
- [ ] Add a clearly differentiated Couples link to Two-Player.
- [ ] Add one relevant guide inlink without unrelated cross-promotion.
- [ ] Run internal-link checks and targeted tests.
- [ ] Commit as `feat: connect couples hub discovery links`.

### Task 5: Browser regression and runtime-quality coverage

**Files:**
- Create: `tests/e2e/online-games-for-couples.spec.ts`
- Modify: `scripts/audit-runtime-quality.ts` only if route sampling is explicit rather than automatic.

**Interfaces:**
- Browser tests verify actual user flows rather than source strings.

- [ ] Add E2E coverage for HTTP 200, no overflow, initial game picker, This-or-That two-player answer/reveal, match-quiz completion, deterministic challenge query reload, share control, and mobile layout.
- [ ] Run the targeted E2E test and fix only observed failures.
- [ ] Ensure telemetry isolation prevents automated visits from polluting production analytics patterns.
- [ ] Add the new route to runtime-quality sampling if required by the current script contract.
- [ ] Commit as `test: cover online couples game flows`.

### Task 6: Full branch verification and review handoff

**Files:**
- No product changes unless a failing gate identifies a real defect.

- [ ] Run/verify `pnpm lint`.
- [ ] Run/verify `pnpm type-check`.
- [ ] Run/verify `pnpm test -- --run`.
- [ ] Run/verify `pnpm check:internal-links`.
- [ ] Run/verify `pnpm audit:prod`.
- [ ] Run/verify `pnpm build`.
- [ ] Run/verify full Playwright suite with skip count reported.
- [ ] Run/verify runtime-quality audit including `/en/games/online-games-for-couples`.
- [ ] Compare branch to latest `main`, review changed files for scope creep, and keep PR Draft until the final review is clean.
