# Original Sorting Games Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one copyright-safe `/games/sorting-games` core SEO asset with three Luma-original browser sorting games, deterministic challenge sharing, contextual discovery, analytics, and full CI gates.

**Architecture:** Follow the existing Couples/Two-Player pattern: a focused data/model module, one client player component, one localized SSG page, and explicit discovery/quality tests. All gameplay is local React state; no third-party runtime, external assets, database, account, or realtime backend.

**Tech Stack:** Next.js 15.5.21 App Router, React 19.2.7, TypeScript, next-intl, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-20-original-sorting-games-hub-design.md`

## Global Constraints

- One core `/games/sorting-games` intent page only in this release.
- All game code, rules copy, visuals, and generated levels must be Luma-original.
- No third-party iframe, source code, images, audio, logos, levels, or branded game titles.
- Do not modify homepage recommendations.
- No database, API, account, localStorage game persistence, or realtime room.
- Shared URLs may contain only a six-character challenge code.
- Exact final head must pass lint, type-check, internal links, unit, dependency audit, build, E2E, and runtime-quality.

---

### Task 1: Sorting game registry and deterministic model

**Files:**
- Create: `lib/games/sorting-games.ts`
- Create: `tests/sorting-games.test.ts`

**Interfaces:**
- Produces: `SORTING_GAMES_PATH`, `SORTING_GAMES`, `normalizeSortingChallengeCode()`, `createSortingChallengeCode()`, `buildNumberSprint()`, `buildColorStackPuzzle()`, and shape definitions.

- [ ] **Step 1: Write failing model tests**

Assert exactly three original games, stable slugs, normalized six-character challenge codes, deterministic outputs for the same seed, different outputs for representative different seeds, and no third-party URL/source/license fields.

- [ ] **Step 2: Verify RED in CI**

Expected: new tests fail because `lib/games/sorting-games.ts` does not exist.

- [ ] **Step 3: Implement minimal deterministic model**

Use an internal seeded PRNG and Fisher-Yates shuffle. Keep generated puzzle data plain TypeScript arrays/objects with no network dependency.

- [ ] **Step 4: Verify GREEN**

Expected: sorting model tests pass while all existing tests remain green.

- [ ] **Step 5: Commit**

Commit message: `feat: add original sorting game model`

### Task 2: Local-only Sorting Games player

**Files:**
- Create: `components/game/sorting-games-player.tsx`
- Extend: `tests/sorting-games.test.ts`

**Interfaces:**
- Consumes model exports from Task 1.
- Produces DOM contracts: `data-sorting-game`, `data-sorting-start`, `data-sorting-challenge-code`, `data-sorting-complete`, `data-number-tile`, `data-color-stack`, and `data-shape-card`.

- [ ] **Step 1: Add failing source/privacy contracts**

Assert the player exposes all three game slugs and analytics event names, contains no `fetch(` for gameplay, no localStorage persistence, no external runtime URL, and builds share URLs using only `challenge=`.

- [ ] **Step 2: Verify RED**

Expected: player file missing.

- [ ] **Step 3: Implement minimal player**

Implement game selection, deterministic challenge code hydration from `window.location.search`, start/reset/switch/share, Number Order Sprint, Color Stack Sort, and Shape Shelf Sort in local component state.

- [ ] **Step 4: Verify GREEN**

Expected: source/privacy contracts pass.

- [ ] **Step 5: Commit**

Commit message: `feat: add original sorting games player`

### Task 3: SEO core page and schemas

**Files:**
- Create: `app/[locale]/games/sorting-games/page.tsx`
- Extend: `tests/sorting-games.test.ts`

**Interfaces:**
- Route: localized `/games/sorting-games`.
- Renders player plus CollectionPage, ItemList, VideoGame, BreadcrumbList, and FAQPage JSON-LD.

- [ ] **Step 1: Add failing page contract**

Assert exact English H1 `Sorting Games Online`, canonical/hreflang metadata, three original game names, FAQ headings, privacy/no-download copy, schemas, and at least two relevant outgoing internal links.

- [ ] **Step 2: Verify RED**

Expected: page file missing.

- [ ] **Step 3: Implement page**

Use existing localized metadata/JSON-LD helpers and place playable UI before long-form explanatory content.

- [ ] **Step 4: Verify GREEN**

Expected: page contract passes.

- [ ] **Step 5: Commit**

Commit message: `feat: add sorting games SEO hub`

### Task 4: Sitemap and contextual discovery

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `app/[locale]/games/page.tsx`
- Modify one relevant guide/layout selected after reading current branch structure.
- Create: `tests/sorting-games-discovery.test.ts`

**Interfaces:**
- Produces sitemap presence and two to three contextual SSR links.

- [ ] **Step 1: Add failing discovery tests**

Require Sorting Games in sitemap and contextual links from `/games` plus one puzzle/no-download context. Assert homepage source does not add `sorting-games`.

- [ ] **Step 2: Verify RED**

Expected: sitemap/link assertions fail.

- [ ] **Step 3: Implement minimal discovery**

Add only contextually relevant links. Do not place Sorting Games in shared sitewide layouts or homepage curation.

- [ ] **Step 4: Verify GREEN**

Expected: discovery tests and internal-link audit pass.

- [ ] **Step 5: Commit**

Commit message: `feat: add sorting games discovery`

### Task 5: Page-quality and runtime-quality registration

**Files:**
- Modify: `scripts/audit-page-quality.ts`
- Modify: `scripts/audit-runtime-quality.ts`
- Create: `tests/sorting-games-page-quality-gate.test.ts`
- Create: `tests/sorting-games-runtime-quality-gate.test.ts`

**Interfaces:**
- Static quality threshold >= 80.
- Runtime sample `/en/games/sorting-games`.

- [ ] **Step 1: Add failing gate-registration tests**

Assert both audit scripts explicitly include Sorting Games.

- [ ] **Step 2: Verify RED**

Expected: both tests fail before registration.

- [ ] **Step 3: Register page**

Add the route to both static and runtime gates without weakening thresholds.

- [ ] **Step 4: Verify GREEN**

Expected: gate-registration tests pass.

- [ ] **Step 5: Commit**

Commit message: `test: gate sorting games quality`

### Task 6: Browser behavior E2E

**Files:**
- Create: `tests/e2e/sorting-games.spec.ts`

**Interfaces:**
- Uses existing Playwright project matrix and telemetry-isolation fixtures.

- [ ] **Step 1: Write E2E contracts**

Cover HTTP/heading/no-overflow, three-game switch, complete Number Order Sprint, same `?challenge=SORT88` deterministic first state after reload, and absence of third-party iframes.

- [ ] **Step 2: Run E2E and debug only root causes**

Expected: tests may expose timing/state issues; fix production code minimally without loosening assertions.

- [ ] **Step 3: Commit**

Commit message: `test: cover sorting games browser behavior`

### Task 7: Final verification and PR readiness

**Files:**
- Update PR body with exact final head and verification evidence.

- [ ] **Step 1: Run full CI on exact head**

Required successful steps: lint, type-check, internal links, unit tests, production dependency audit, production build, Playwright, local production server, runtime-quality.

- [ ] **Step 2: Inspect final PR diff**

Confirm no homepage change, no external game URLs/assets, no third-party branded names, no database/API changes, and no unrelated refactor.

- [ ] **Step 3: Record exact counts**

Report exact unit file/test counts, E2E passed/skipped counts, static build pages, and runtime-quality execution evidence.

- [ ] **Step 4: Keep unmerged until explicitly authorized**

Do not merge or deploy from this implementation plan without a separate explicit instruction.