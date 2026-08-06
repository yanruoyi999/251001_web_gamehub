# Search Session Interaction Resilience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove guide-card dead clicks and ensure analytics/fullscreen failures cannot block the user’s game flow.

**Architecture:** Keep the existing server-rendered guide and client player architecture. Use a scoped stretched-link pattern to expand the existing localized `Link` hit area across each recommendation card, and make the shared analytics adapter fail-open so all interaction consumers gain the same protection.

**Tech Stack:** Next.js 15.5.21, React 19.2.7, next-intl, Vitest, Playwright.

## Global Constraints

- No new dependency, database, service setup, IndexNow call, or analytics production write.
- Preserve click-to-load iframe behavior, sandbox policy, fullscreen fallback, locale paths, and telemetry isolation.

---

### Task 1: Prove the failure modes

**Files:**
- Modify: `tests/analytics-events.test.ts`
- Create: `tests/game-player-interaction-resilience.test.ts`
- Modify: `tests/e2e/game-browsing.spec.ts`

- [x] Add provider-throw tests that require `trackInteraction` not to throw.
- [x] Add source assertions for full-card links, state-before-telemetry, fullscreen transition guard, and Escape fallback.
- [x] Add Playwright flows for clicking the recommendation image area and native-fullscreen rejection.

### Task 2: Make telemetry fail-open

**Files:**
- Modify: `lib/analytics/events.ts`

- [x] Wrap Vercel, GA4, and Clarity calls independently.
- [x] Keep `source` renamed to `interaction_source` for GA4 attribution.

### Task 3: Remove recommendation dead clicks

**Files:**
- Modify: `components/ui/card.tsx`
- Modify: `app/globals.css`

- [x] Mark Card roots and stretch the existing localized game link across the recommendation card with scoped CSS.
- [x] Preserve visible focus, hover feedback, semantic label, and reduced-motion behavior.

### Task 4: Harden play and fullscreen controls

**Files:**
- Modify: `components/game/game-player-facade.tsx`

- [x] Update loaded state before telemetry.
- [x] Prevent concurrent fullscreen transitions.
- [x] Fall back without throwing when native fullscreen is unavailable or rejected.
- [x] Support Escape exit and a 44px fullscreen target.

### Task 5: Verify and release

- [ ] Run lint, type-check, unit tests, internal links, production audit, build, and Playwright in GitHub Actions.
- [ ] Verify all skips separately.
- [ ] Deploy the exact reviewed commit and smoke-test the two affected guide flows.
