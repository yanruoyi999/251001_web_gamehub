# Luma Game Rights Hardening Design

Date: 2026-08-23
Baseline: `main@c5abe8b4cb76baddf94ea4f96b88a69a02c6405b`

## Goal

Make game publication, indexing, embedding, screenshots, imports, taxonomy, and runtime verification fail closed around unverified third-party rights while preserving Luma-owned/original content and verified sources.

## Requirements

1. `embedPermissionStatus` is a hard authorization gate, not a scoring signal.
   - `verified`: may be embedded and considered for indexing/collections.
   - `link-only`: may expose a verified public source link but must not load an iframe.
   - `unknown`, `blocked`, `expired`, `null`: must not load an iframe and must not qualify for core indexing/collections/sitemap.
2. Local imported catalogue records from 4399 remain `unknown` unless a per-game rights record explicitly verifies them.
3. Remote database records must carry auditable rights fields. Missing rights metadata must fail closed.
4. Game quality audit cannot return `keep` for unverified embed rights.
5. Runtime audit must distinguish “player shell/iframe element rendered” from “external game actually navigated/loaded”. CI must not describe a blocked network request as playable.
6. The 4399 import pipeline must be deterministic. Re-running the importer must not silently regenerate known title/source mismatches such as `blumgi-slime` → `monkey-mart`.
7. Taxonomy must not assign a synthetic secondary category from array position. Categories must come from explicit overrides or deterministic semantic matching only.
8. Third-party player failures need a visible recoverable state. Unknown sources must not receive unnecessary popup capability.
9. Repository licensing must distinguish Luma-owned code from third-party games, screenshots, trademarks, and assets. README must not claim a missing repository-wide MIT license.
10. Legacy operational docs must not instruct operators to label 4399 as the game developer or official source.

## Data model

Add nullable provenance/rights columns to `games`:

- `originalDeveloper`
- `rightsHolder`
- `officialGameUrl`
- `distributionProvider`
- `licenseType`
- `licenseUrl`
- `commercialUseAllowed`
- `embedPermissionStatus`
- `adsAllowed`
- `screenshotPermission`
- `thumbnailPermission`
- `verificationEvidence`
- `rightsVerifiedAt`

The existing `developerName/developerUrl/sourceUrl` fields remain for compatibility but are no longer sufficient for authorization decisions.

## Policy boundary

Create one normalized rights predicate in `lib/games/quality-policy.ts`. Sitemap, collection promotion, detail-player rendering, audit decisions, and taxonomy all consume the same policy result. No caller may infer authorization from host, URL availability, editorial completeness, screenshot existence, or a core slug allowlist.

## Runtime verification

`audit-runtime-quality` reports two different signals:

- `iframeElementVisibleAfterPlay`: UI/player-shell contract.
- `externalFrameLoaded`: external document navigation/load signal when real external verification is enabled.

The default PR CI remains deterministic and may block external traffic, but then it must report external playability as `not-verified`, never `yes`. A separate explicit mode can verify real third-party loading.

## Import and taxonomy

- Fix the bad `blumgi-slime` source row instead of relying on a hand-edited generated JSON.
- Add importer validation for duplicate generated slugs and suspicious source-path/title disagreement.
- Remove index-rotated secondary categories; a game receives only categories supported by explicit overrides or semantic matching.

## Player security and recovery

- Default sandbox removes `allow-popups`.
- Only a verified per-game capability may opt into popups later; this change does not introduce such a capability yet.
- Add timeout/error UI with retry and optional verified source link.
- The page never passes an unverified source URL as a fallback play route.

## Licensing/docs

- Add `THIRD_PARTY_NOTICES.md` explaining that third-party game code/content, screenshots, names, and trademarks are excluded from any Luma code license unless separately documented.
- README removes the false “MIT — see LICENSE” claim until a scoped code license is intentionally added.
- Legacy SEO/deployment docs are marked deprecated for game provenance and point to the rights model instead of 4399-as-developer examples.

## Tests / acceptance

- Unit tests prove `unknown/null/link-only/blocked/expired` cannot embed or index.
- Audit tests prove unverified core slugs cannot be `keep`.
- Import tests prove source data regenerates the checked-in mapping for the known mismatch and rejects duplicate slugs.
- Taxonomy tests prove Racing does not contain unrelated games through positional secondary categories.
- Runtime audit tests prove blocked external requests are not reported as playable.
- Player tests cover failure state and popup-free sandbox contract.
- Typecheck, lint, unit tests, internal-link audit, production dependency audit, build, and E2E run in CI.
