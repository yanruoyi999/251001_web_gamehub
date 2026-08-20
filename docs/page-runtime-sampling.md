# Luma Runtime Quality Sampling

Generated: 2026-08-20T14:31:55.480Z
Base URL: http://127.0.0.1:3217

Scope: mobile Playwright sampling for high-value indexable pages. This is a companion gate for `docs/page-quality-scorecard.md`, adding runtime performance, mobile layout, and actual playable-iframe checks that static scoring cannot prove. Analytics collection is blocked during sampling so automated visits do not contaminate GA4, Clarity, or Vercel telemetry. TTFB/transport is reported separately; page timing scores use response-relative DCL/FCP/load so one noisy network route does not downgrade every page equally.

## Thresholds

- Sampled pages must score 80 or higher before being treated as hardened index targets.
- Game pages must expose the Play button on mobile, load an iframe after the click, and keep the Luma fullscreen control visible.
- Pages are penalized for missing canonical tags, mobile horizontal overflow, slow load/FCP, excessive transfer size, many requests, and console/page errors.

## Summary

- Sampled pages: 11
- Under 80: 0
- Minimum score: 96

## Samples

| Path | Type | Score | Status | TTFB | DCL after response | Load after response | FCP after response | Transfer | Requests | Canonical | Robots | Mobile overflow | Playable | Fullscreen | Reason |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- | --- |
| /en | static | 100 | 200 | 14ms | 64ms | 109ms | 82ms | 377KB | 35 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games | static | 100 | 200 | 21ms | 70ms | 73ms | 51ms | 399KB | 34 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games/2-player-unblocked | game | 100 | 200 | 7ms | 13ms | 80ms | 53ms | 204KB | 22 | yes | index, follow | no | yes | yes | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/games-like-ovo | guide | 100 | 200 | 7ms | 14ms | 79ms | 74ms | 261KB | 22 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/google-snake-mods | guide | 100 | 200 | 7ms | 38ms | 71ms | 46ms | 231KB | 21 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/big-tower-tiny-square-2-walkthrough | guide | 100 | 200 | 6ms | 13ms | 70ms | 46ms | 235KB | 21 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/obby-parkour-with-ragdoll-guide | guide | 100 | 200 | 6ms | 34ms | 67ms | 42ms | 223KB | 20 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/rail-cart-buddies-guide | guide | 100 | 200 | 7ms | 15ms | 77ms | 53ms | 223KB | 20 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/telemount-walkthrough | guide | 100 | 200 | 8ms | 41ms | 76ms | 52ms | 258KB | 23 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games/drive-mad | game | 96 | 200 | 19ms | 17ms | 83ms | 65ms | 248KB | 22 | yes | index | no | yes | yes | 1 console errors |
| /en/games/duo-vikings | game | 96 | 200 | 18ms | 17ms | 83ms | 62ms | 261KB | 24 | yes | index | no | yes | yes | 1 console errors |
