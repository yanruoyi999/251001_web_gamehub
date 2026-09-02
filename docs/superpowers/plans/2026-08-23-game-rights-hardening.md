# Game Rights Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Luma fail closed on unverified game rights, correct false playability/data/taxonomy signals, and document third-party licensing boundaries.

**Architecture:** Centralize authorization in `quality-policy.ts`; persist auditable rights metadata in the remote schema; make all public surfaces consume the same gate. Keep deterministic CI separate from explicit real-external verification so blocked external traffic can never be reported as playable.

**Tech Stack:** Next.js 15, React 19, TypeScript, Drizzle/PostgreSQL, Vitest, Playwright, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-08-23-game-rights-hardening-design.md`

## Global Constraints

- Work only on `codex/luma-rights-hardening-20260823`; do not merge to `main`.
- Preserve existing public URLs; risky third-party detail URLs may remain reachable as informational/noindex pages.
- Do not infer rights from URL reachability, host, popularity, screenshots, or editorial completeness.
- No new production dependency is required.
- Existing 4399 imported records stay unverified unless explicit evidence exists.

---

### Task 1: Rights policy hard gate

**Files:**
- Modify: `tests/game-quality-policy.test.ts`
- Modify: `lib/games/quality-policy.ts`

**Interfaces:**
- Produces: `EmbedPermissionStatus = 'verified' | 'link-only' | 'unknown' | 'blocked' | 'expired'`
- Produces: `hasVerifiedEmbedPermission(input)` and fail-closed `canRenderGameIframe`, `isCoreIndexableGame`, `shouldIncludeGameInSitemap`, `shouldPromoteGameInCollections`.

- [ ] Write tests asserting only `verified` can render/index/promote; null/unknown/link-only/blocked/expired fail closed.
- [ ] Push tests-only commit and confirm CI/unit tests fail because current policy permits unknown/null.
- [ ] Implement the minimal policy change and run CI until the policy tests pass.

### Task 2: Remote rights schema

**Files:**
- Modify: `db/schema/games.ts`
- Create: `db/migrations/add_game_rights_metadata.sql`
- Modify: service/admin types only where compilation requires the new nullable fields.

**Interfaces:**
- Produces nullable provenance columns defined in the spec.
- Existing `developerName/developerUrl/sourceUrl` remain compatible.

- [ ] Add a schema contract test or compile-time usage test before schema implementation.
- [ ] Add nullable columns and an idempotent SQL migration using `ADD COLUMN IF NOT EXISTS`.
- [ ] Confirm typecheck and existing admin/service tests remain green.

### Task 3: Audit decisions require verified rights

**Files:**
- Modify: `tests/audit-game-quality.test.ts`
- Modify: `scripts/audit-game-quality.ts`

**Interfaces:**
- Consumes: `hasVerifiedEmbedPermission`.
- Produces: unverified rows can only be `review`/`remove`/`merge`, never `keep`.

- [ ] Add a failing test proving a core slug with `unknown` permission cannot be `keep`.
- [ ] Change audit decision logic so rights are a prerequisite rather than a score bonus.
- [ ] Update report wording to distinguish editorial quality from legal/permission clearance.

### Task 4: Deterministic 4399 importer

**Files:**
- Modify: `game_iframes.tsv`
- Modify: `scripts/import-4399-games.ts`
- Create/Modify: `tests/import-4399-games.test.ts`
- Regenerate if needed: `public/data/4399-sample.json`

**Interfaces:**
- Export pure `normalizeTitle`, `buildGames`, and validation helpers for tests.

- [ ] Add failing tests for the known `blumgi-slime`/Monkey Mart mismatch and duplicate generated slugs.
- [ ] Correct the source TSV row so source identity and title agree.
- [ ] Make importer validation reject duplicate/suspicious mappings rather than silently suffixing a bad duplicate.
- [ ] Ensure regenerated checked-in JSON matches intended mappings.

### Task 5: Taxonomy correctness

**Files:**
- Modify: `lib/mock-games.ts`
- Modify/Create: taxonomy tests under `tests/`.

**Interfaces:**
- `buildCategoriesForGame` returns only explicit override categories or deterministic keyword-derived categories.

- [ ] Add a failing test showing unrelated Adam and Eve/Cover Orange entries must not enter Racing because of array position.
- [ ] Remove index-rotated secondary category assignment.
- [ ] Preserve explicit category overrides and deterministic primary matching.

### Task 6: Honest runtime playability reporting

**Files:**
- Modify: `scripts/audit-runtime-quality.ts`
- Modify/Create: `tests/audit-runtime-quality.test.ts`
- Modify: `.github/workflows/ci.yml` only if arguments/labels need adjustment.

**Interfaces:**
- Produce separate `iframeElementVisibleAfterPlay` and `externalFrameLoaded: boolean | null`.
- `null` means not verified because external navigation was intentionally blocked.

- [ ] Add failing tests proving a blocked external request cannot result in `Playable=yes`.
- [ ] Rename/report UI-shell and external-load signals separately.
- [ ] Keep deterministic PR CI isolated from third-party network reliability; mark real playability `not-verified` unless explicit external verification runs.

### Task 7: Player recovery and sandbox hardening

**Files:**
- Modify: `components/game/game-player-facade.tsx`
- Modify/Create: player contract tests under `tests/`.
- Modify: `app/[locale]/games/[slug]/page.tsx` only to pass a verified fallback source when allowed.

**Interfaces:**
- Default sandbox excludes `allow-popups`.
- Player supports loading/error state, retry, and an optional verified source link.

- [ ] Add failing source-contract tests for popup-free sandbox and visible failure/retry copy.
- [ ] Add iframe load timeout/error handling without weakening the rights gate.
- [ ] Never pass unverified public source URLs to the player as a fallback.

### Task 8: Licensing and operator documentation

**Files:**
- Modify: `README.md`
- Create: `THIRD_PARTY_NOTICES.md`
- Modify: `FINAL_EXECUTION_GUIDE.md`
- Modify: `DEPLOYMENT_CHECKLIST.md`
- Modify: `EXTERNAL_LINKS_GUIDE.md`

- [ ] Remove the false `MIT — see LICENSE` statement while no scoped LICENSE exists.
- [ ] Add third-party exclusions and rights-record expectations.
- [ ] Mark 2025 provenance guidance deprecated and remove examples that identify 4399 as the developer/official source.

### Task 9: Full verification and PR

**Files:** no production changes expected.

- [ ] Run/observe `pnpm lint`, `pnpm type-check`, `pnpm check:internal-links`, `pnpm test -- --run`, `pnpm audit:prod`, `pnpm build`, `pnpm test:e2e`, and runtime quality through GitHub CI.
- [ ] Review branch diff for unrelated changes and secrets.
- [ ] Open a PR to `main` but do not merge it.
- [ ] Report any external-rights records still missing as `Coverage gap`, not as verified.
