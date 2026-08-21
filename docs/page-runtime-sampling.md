# Luma Runtime Quality Sampling

Generated: 2026-08-21T04:14:22.621Z
Base URL: http://localhost:3232

Scope: mobile Playwright sampling for high-value indexable pages. This is a companion gate for `docs/page-quality-scorecard.md`, adding runtime performance, mobile layout, and actual playable-iframe checks that static scoring cannot prove. Analytics collection is blocked during sampling so automated visits do not contaminate GA4, Clarity, or Vercel telemetry. TTFB/transport is reported separately; page timing scores use response-relative DCL/FCP/load so one noisy network route does not downgrade every page equally.

## Thresholds

- Sampled pages must score 80 or higher before being treated as hardened index targets.
- Game pages must expose the Play button on mobile, load an iframe after the click, and keep the Luma fullscreen control visible.
- Pages are penalized for missing canonical tags, mobile horizontal overflow, slow load/FCP, excessive transfer size, many requests, and console/page errors.

## Summary

- Sampled pages: 11
- Under 80: 0
- Minimum score: 100

## Samples

| Path | Type | Score | Status | TTFB | DCL after response | Load after response | FCP after response | Transfer | Requests | Canonical | Robots | Mobile overflow | Playable | Fullscreen | Reason |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- | --- |
| /en | static | 100 | 200 | 20ms | 102ms | 152ms | 105ms | 415KB | 41 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games | static | 100 | 200 | 23ms | 44ms | 79ms | 57ms | 402KB | 34 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games/2-player-unblocked | game | 100 | 200 | 13ms | 14ms | 85ms | 55ms | 207KB | 22 | yes | index, follow | no | yes | yes | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/games-like-ovo | guide | 100 | 200 | 11ms | 36ms | 71ms | 49ms | 284KB | 23 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/google-snake-mods | guide | 100 | 200 | 7ms | 41ms | 73ms | 49ms | 233KB | 21 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/big-tower-tiny-square-2-walkthrough | guide | 100 | 200 | 12ms | 16ms | 78ms | 53ms | 264KB | 23 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/obby-parkour-with-ragdoll-guide | guide | 100 | 200 | 11ms | 14ms | 78ms | 53ms | 240KB | 22 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/rail-cart-buddies-guide | guide | 100 | 200 | 11ms | 16ms | 88ms | 85ms | 260KB | 22 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/telemount-walkthrough | guide | 100 | 200 | 11ms | 16ms | 79ms | 53ms | 260KB | 23 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games/drive-mad | game | 100 | 200 | 19ms | 65ms | 98ms | 77ms | 252KB | 22 | yes | index | no | yes | yes | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games/duo-vikings | game | 100 | 200 | 21ms | 55ms | 90ms | 68ms | 251KB | 22 | yes | index | no | yes | yes | Mobile runtime sample passed the current performance and playability thresholds. |
