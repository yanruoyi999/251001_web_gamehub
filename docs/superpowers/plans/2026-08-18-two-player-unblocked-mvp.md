# Two-Player Unblocked MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship one bilingual, legal, self-hosted 2 Player Unblocked collection with at least 3 directly playable local-multiplayer games, precise provenance, demand-loaded runtimes, SEO, internal links, and real play-funnel telemetry.

**Architecture:** Keep the feature isolated from the generic catalogue. A typed collection registry describes licensed games and trust metadata; a dedicated server page renders SEO/schema/content; a small client collection player owns the active runtime iframe and analytics. Third-party runtime files live under `public/games-runtime/<slug>/` with local license notices and no unauthorized external resources.

**Tech Stack:** Next.js 15.5.21, React 19.2.7, TypeScript, next-intl, Vitest, Playwright, static HTML5 runtimes.

**Spec:** `docs/superpowers/specs/2026-08-18-two-player-unblocked-mvp-design.md`

## Global Constraints

- Base from `main@b6cef8ec81bff68c375d742332ed8aa14f2ce4e4`.
- Never ship a third-party runtime without a pinned source revision and preserved license notice.
- No third-party game iframe or mirror is accepted as authorization proof.
- No new duplicate keyword pages in v1.
- No school/company filter-bypass promises.
- No fabricated player counts, ratings, play counts, reviews, or load-time claims.
- Telemetry remains production-host/test isolated and may not block gameplay.
- Do not deploy or merge until branch gates and production-preview checks pass.

---

### Task 1: License whitelist and provenance registry

**Files:**
- Create: `docs/licenses/two-player/WHITELIST.md`
- Create: `docs/licenses/two-player/<approved-slug>.md`
- Create: `lib/games/two-player-unblocked.ts`
- Test: `tests/two-player-unblocked-registry.test.ts`

**Interfaces:**
- Produces `TwoPlayerGame` and `TWO_PLAYER_GAMES` for the page/player.
- Each approved record exposes `slug`, `title`, `genre`, `playerOneControls`, `playerTwoControls`, `runtimePath`, `mobileSupport`, `sourceUrl`, `sourceRevision`, `license`, `licenseNoticePath`, and `provenanceStatus: 'approved'`.

- [ ] Write registry tests that fail until every shipped game is approved, has a local `/games-runtime/` path, pinned revision/original marker, and license notice.
- [ ] Record 10–20 researched candidates with `approved / blocked / needs-review`; use exact upstream repository/license evidence.
- [ ] Approve only candidates whose code/assets chain is clear; use up to two Luma-original games if fewer than five externals qualify.
- [ ] Implement the typed registry minimally to satisfy the tests.
- [ ] Run `pnpm exec vitest run tests/two-player-unblocked-registry.test.ts`.

### Task 2: Self-hosted runtimes

**Files:**
- Create: `public/games-runtime/<slug>/index.html`
- Create: `public/games-runtime/<slug>/game.js`
- Create: `public/games-runtime/<slug>/style.css`
- Create: `public/games-runtime/<slug>/LICENSE.txt`
- Test: `tests/two-player-runtime-boundary.test.ts`

**Interfaces:**
- Consumes each registry `runtimePath`.
- Runtimes communicate readiness/failure to the parent using `postMessage` messages shaped as `{ type: 'luma-game-ready' | 'luma-game-error', gameSlug: string }`.

- [ ] Write failing source-boundary tests: no `http://` or `https://` asset/script/font/audio/game dependencies inside shipped runtime HTML/CSS/JS; license files exist; each runtime posts a ready signal.
- [ ] Vendor approved source at the pinned revision or write Luma-original runtimes; preserve required notices and replace uncertain media with original CSS/canvas visuals.
- [ ] Normalize controls and responsive sizing without altering game identity in a misleading way.
- [ ] Run the focused runtime boundary tests.

### Task 3: Collection player and analytics

**Files:**
- Create: `components/game/two-player-collection-player.tsx`
- Test: `tests/two-player-collection-player.test.ts`

**Interfaces:**
- Props: `{ locale: 'zh' | 'en'; games: TwoPlayerGame[] }`.
- Emits `two_player_game_click`, `game_play_start`, `game_load_success`, `game_load_error`, `game_play_10s`, `game_play_30s`, `game_switch`, `game_fullscreen_toggle` with `game_slug`.

- [ ] Write failing tests for one active iframe only, explicit play-before-load, switch unload, 10s/30s timers, ready/error messages, and stable `game_slug` analytics.
- [ ] Implement the minimal client player using the existing `trackInteraction` adapter.
- [ ] Keep iframe sandboxed and same-origin runtime-only.
- [ ] Add keyboard-visible controls and 44px-priority Play/Switch/Fullscreen targets.
- [ ] Run focused tests.

### Task 4: Dedicated bilingual landing page and schema

**Files:**
- Create: `app/[locale]/games/2-player-unblocked/page.tsx`
- Test: `tests/two-player-unblocked-page.test.ts`

**Interfaces:**
- Renders the collection player and JSON-LD `CollectionPage` + `ItemList`.
- Uses `getLocalizedPath`, `buildAbsoluteUrl`, and existing locale conventions.

- [ ] Write failing tests for metadata, H1, canonical/hreflang, schema, truthful `unblocked` wording, useful sections, and absence of fake metrics.
- [ ] Implement English and Chinese copy with the playable collection above long-form content.
- [ ] Include co-op/same-keyboard/racing/puzzle/quick guidance, control comparison, Chromebook/mobile/account/download notes, and FAQ.
- [ ] Run focused tests.

### Task 5: Sitemap and internal links

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `app/[locale]/games/page.tsx`
- Modify: `lib/seo-landing-content.ts` only for the existing keyboard-only guide contextual link if needed by its current rendering model.
- Test: `tests/two-player-unblocked-discovery.test.ts`

**Interfaces:**
- Adds localized `/games/2-player-unblocked` to sitemap and at least relevant discovery paths.

- [ ] Write failing discovery tests for sitemap inclusion and contextual links from `/games` plus keyboard-only guide.
- [ ] Implement only relevant links; do not force unrelated game-detail inbound links.
- [ ] Run focused and internal-link tests.

### Task 6: Browser regression coverage

**Files:**
- Create: `tests/e2e/two-player-unblocked.spec.ts`

- [ ] Write Playwright flow for HTTP/UI load, no runtime iframe before Play, game start, game switch replacing the prior iframe, fullscreen control, and mobile unsupported copy.
- [ ] Verify simultaneous key controls on the shipped keyboard games where Playwright can dispatch the two key sets.
- [ ] Run Chromium first, then repository browser matrix when available.

### Task 7: Full branch gates and review

- [ ] Run `pnpm lint`.
- [ ] Run `pnpm type-check`.
- [ ] Run `pnpm test -- --run`.
- [ ] Run `pnpm check:internal-links`.
- [ ] Run `pnpm audit:prod`.
- [ ] Run `pnpm build`.
- [ ] Run `pnpm test:e2e` and report all skips separately.
- [ ] Run `git diff --check` when available.
- [ ] Inspect exact branch diff against `main` and confirm no unrelated files, secrets, production writes, IndexNow calls, or third-party runtime URLs.
- [ ] Open a PR only after the exact branch head has passed the available gates; do not merge/deploy without reviewing failures or skips.
