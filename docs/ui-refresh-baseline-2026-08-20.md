# UI Refresh Baseline

Date: 2026-08-20 Asia/Shanghai

## Release state

- Branch: `codex/ui-curated-shelf-20260820`
- Base: `80abea643630510e6cf0ecf05b32dd8740fd3ac6`
- Worktree: `.worktrees/main-level-editor-release-20260815`
- Baseline tests: 85 files, 267 tests passed
- Baseline type-check: passed

## Protected contracts

- Existing public URLs, canonical URLs, hreflang, robots, noindex and sitemap behavior remain unchanged.
- GA4 and Clarity identifiers and existing event names remain unchanged.
- Preview must not send production analytics; production must keep one page view per initial route and SPA navigation.

## Baseline routes

- `/en`
- `/zh`
- `/en/games`
- `/en/guides/google-snake-mods`
- `/en/games/spend-bill-gates-money`
- `/en/games/saved`

## Observed UI risks

- Homepage hero pushes playable content below the first viewport and repeats Spend Bill Gates Money promotion.
- Mobile recommendation and catalogue cards stack too tall for quick scanning.
- The catalogue filter panel delays the first game grid, especially on mobile.
- Consent and feedback controls can overlap the bottom action area.
- The locale layout wraps child pages in a second `main`, creating invalid nested main landmarks.
