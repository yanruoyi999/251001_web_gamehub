# Spend Bill Gates Money SEO v1.2 Implementation Plan

> **Execution mode:** implement task-by-task on the isolated feature branch, preserve RED evidence, and merge only after complete verification.

**Goal:** Expand the bilingual game page into a stronger long-tail landing page, improve discovery and sharing metadata, add verified internal/external links, and notify IndexNow only after the formal domain exposes the release.

**Architecture:** Keep the game client untouched. Centralize route and freshness constants in a small SEO module; extend the server page; generate a stable 1200×630 PNG through `ImageResponse`; render contextual links from the localized layout based on pathname; reuse the existing tested IndexNow helpers and CLI.

**Tech Stack:** Next.js 15.5.21, React 19.2.7, TypeScript 5.9.3, Tailwind 3.4.17, next-intl 4.13.1, Vitest 3.2.4, Playwright 1.55.1, pnpm 10.28.0.

## Global constraints

- Feature branch: `feat/spend-bill-gates-money-seo-v1-2-20260804`
- Backup branch: `backup/main-before-bill-gates-seo-v1-2-20260804`
- Do not change game rules, prices, analytics event names, dependencies, global CSS, Tailwind config, database schema, or generic iframe routing.
- Do not claim IndexNow guarantees indexing or that unverified external backlinks exist.
- Verify production against `https://www.lumagamehub.com` and Vercel project `prj_2FOg6BtpI4CAsnfWUCrdIpdJQlWM`.

---

### Task 1: Lock SEO v1.2 contracts with failing tests

- [x] Create `tests/spend-bill-gates-money-seo-v1-2.test.ts`.
- [x] Reuse the existing `tests/indexnow.test.ts` contract for URL and payload validation.
- [x] Push and capture a real RED run.

**RED evidence:** GitHub Actions Run `30837761039`, job `91767002407`: lint, type check, and internal-link audit passed; the new SEO contract failed on the four intentionally missing requirements while 50 files and 161 existing tests passed.

### Task 2: Add shared SEO constants and dedicated social image

- [x] Create `lib/games/spend-bill-gates-money-seo.ts`.
- [x] Create `app/og/spend-bill-gates-money/route.tsx` using `ImageResponse`.
- [x] Generate a stable 1200×630 PNG response with readable title, `$100 BILLION`, mobile/no-download copy, and an unofficial-game notice.

### Task 3: Expand page content and metadata

- [x] Add five bilingual useful content modules.
- [x] Expand FAQ to five localized questions.
- [x] Add natural long-tail query coverage.
- [x] Point Open Graph, Twitter, and `VideoGame.image` to the dedicated PNG route.
- [x] Add `datePublished` and `dateModified` to `VideoGame` JSON-LD.

### Task 4: Add contextual inbound internal links

- [x] Create `components/seo/spend-bill-gates-money-context-links.tsx`.
- [x] Render it from `app/[locale]/layout.tsx`.
- [x] Show it only on the localized homepage and these guides:
  - `games-to-play-when-bored`
  - `best-browser-games-5-minute-break`
  - `free-games-no-ads`
- [x] Use varied localized anchors and `getLocalizedPath()`.
- [x] Preserve the existing `/games` Luma Original entry and catalogue pagination totals.

### Task 5: Improve sitemap, preserve robots, and automate IndexNow

- [x] Refactor standalone sitemap records to support page-specific metadata.
- [x] Emit both game URLs with weekly frequency, priority `0.75`, and shared `lastModified`.
- [x] Preserve crawlable robots rules and sitemap reference.
- [x] Reuse existing `lib/indexnow.ts`, `scripts/submit-indexnow.ts`, package script, tests, and key file `public/9140751f1bbe87e8c99a338470f94cbc.txt`.
- [x] Add `.github/workflows/indexnow.yml` for relevant `main` changes and manual dispatch.
- [x] Make the workflow wait for the formal-domain SEO marker before submitting only the ten changed localized URLs.

### Task 6: Add legitimate GitHub reference and execution record

- [x] Refresh `README.md` to the current stack and add the English canonical game link.
- [x] Create `docs/releases/2026-08-04-spend-bill-gates-money-seo-v1-2.md`.
- [x] Record branch, backup, scope, RED evidence, formal-domain project, IndexNow boundary, Bing data gap, and observation window.

### Task 7: Full verification, review, merge, and production follow-through

- [ ] Run `pnpm lint`.
- [ ] Run `pnpm type-check`.
- [ ] Run `pnpm check:internal-links`.
- [ ] Run `pnpm test`.
- [ ] Run the production dependency audit.
- [ ] Run `pnpm build`.
- [ ] Run Chromium Playwright E2E.
- [ ] Review the complete diff for scope, SEO, accessibility, and routing regressions.
- [ ] Mark PR #15 ready and squash merge to `main`.
- [ ] Verify `251001-web-gamehub-rdg6` receives a READY production deployment.
- [ ] Verify formal Chinese and English pages, robots, sitemap, key file, PNG response, contextual links, and mobile HUD.
- [ ] Confirm the IndexNow workflow receives HTTP 200 or 202 for the changed URL batch.
- [ ] Update the release record with exact final commit, merge, deployment, and notification evidence.
