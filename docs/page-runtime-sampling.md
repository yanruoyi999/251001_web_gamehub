# Luma Runtime Quality Sampling

Generated: 2026-08-20T18:01:47.103Z
Base URL: http://localhost:3232

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
| /en | static | 100 | 200 | 78ms | 164ms | 251ms | 158ms | 417KB | 41 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games | static | 100 | 200 | 97ms | 891ms | 892ms | 127ms | 403KB | 34 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games/2-player-unblocked | game | 100 | 200 | 48ms | 128ms | 337ms | 148ms | 208KB | 22 | yes | index, follow | no | yes | yes | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/games-like-ovo | guide | 100 | 200 | 37ms | 93ms | 162ms | 115ms | 287KB | 23 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/google-snake-mods | guide | 100 | 200 | 31ms | 85ms | 144ms | 105ms | 235KB | 21 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/big-tower-tiny-square-2-walkthrough | guide | 100 | 200 | 24ms | 78ms | 138ms | 100ms | 266KB | 23 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/obby-parkour-with-ragdoll-guide | guide | 100 | 200 | 25ms | 64ms | 128ms | 87ms | 265KB | 22 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/rail-cart-buddies-guide | guide | 100 | 200 | 33ms | 81ms | 180ms | 107ms | 262KB | 22 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/guides/telemount-walkthrough | guide | 100 | 200 | 22ms | 79ms | 135ms | 98ms | 262KB | 23 | yes | index | no | n/a | n/a | Mobile runtime sample passed the current performance and playability thresholds. |
| /en/games/drive-mad | game | 96 | 200 | 54ms | 125ms | 175ms | 150ms | 252KB | 22 | yes | index | no | yes | yes | 1 console errors |
| /en/games/duo-vikings | game | 96 | 200 | 53ms | 132ms | 255ms | 175ms | 251KB | 22 | yes | index | no | yes | yes | 1 console errors |
