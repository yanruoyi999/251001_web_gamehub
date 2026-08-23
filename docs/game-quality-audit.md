# Luma Game Quality Audit

Updated for rights hardening: 2026-08-23

## Current checked-in catalogue state

The checked-in `public/data/4399-sample.json` contains 200 legacy imported records. Those imported records currently carry `embedPermissionStatus = unknown` when materialized by `lib/mock-games.ts`.

Under the fail-closed rights policy introduced on this branch:

- Total legacy imported records: **200**
- Verified core-indexed imported games: **0**
- Verified catalogue-only imported games: **0**
- Rights/content review imported games: **200**
- Imported game pages eligible for sitemap/recommendation/iframe: **0**
- Imported game pages forced to noindex: **200**

This is intentional. A core slug, working URL, local screenshot, editorial coverage, or prior runtime success is not authorization evidence.

## Publication rule

A third-party game can move out of `review` only after its rights/provenance record explicitly verifies the required permission. At minimum, iframe publication requires `embedPermissionStatus = verified`. Screenshot and thumbnail permission are independent.

## Regeneration

Run:

```bash
pnpm audit:game-quality
```

The generated detailed report is a quality/provenance audit, not legal advice. Do not rewrite `unknown` records to `verified` merely to improve page counts or AdSense readiness.

## Legacy data warning

Some historical entries in the checked-in JSON were generated from dirty source rows. The importer now quarantines known identity mismatches (including the historic `blumgi-slime`, Fancy Pants World 2, and truck-loader/G-Switch mismatches) and rejects duplicate generated slugs instead of silently suffixing them. Existing legacy records remain fail-closed until replaced by clean, verified provenance.
