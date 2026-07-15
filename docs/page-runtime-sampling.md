# Luma Runtime Quality Sampling

Generated: 2026-07-15T04:17:08.115Z
Base URL: http://127.0.0.1:3030

Scope: mobile Playwright sampling for high-value indexable pages. This is a companion gate for `docs/page-quality-scorecard.md`, adding runtime performance, mobile layout, and actual playable-iframe checks that static scoring cannot prove. TTFB/transport is reported separately; page timing scores use response-relative DCL/FCP/load so one noisy network route does not downgrade every page equally.

## Thresholds

- Sampled pages must score 80 or higher before being treated as hardened index targets.
- Game pages must expose the Play button on mobile, load an iframe after the click, and keep the Luma fullscreen control visible.
- Pages are penalized for missing canonical tags, mobile horizontal overflow, slow load/FCP, excessive transfer size, many requests, and console/page errors.

## Summary

- Sampled pages: 9
- Under 80: 0
- Minimum score: 88

## Samples

| Path | Type | Score | Status | TTFB | DCL after response | Load after response | FCP after response | Transfer | Requests | Canonical | Robots | Mobile overflow | Playable | Fullscreen | Reason |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- | --- |
| /en | static | 88 | 200 | 102ms | 103ms | 148ms | 119ms | 231KB | 25 | yes | index | no | n/a | n/a | 6 console errors |
| /en/games | static | 88 | 200 | 66ms | 19ms | 88ms | 62ms | 216KB | 20 | yes | index | no | n/a | n/a | 6 console errors |
| /en/guides/games-like-ovo | guide | 88 | 200 | 15ms | 12ms | 75ms | 57ms | 183KB | 20 | yes | index | no | n/a | n/a | 6 console errors |
| /en/guides/google-snake-mods | guide | 88 | 200 | 8ms | 13ms | 76ms | 56ms | 191KB | 21 | yes | index | no | n/a | n/a | 6 console errors |
| /en/guides/big-tower-tiny-square-2-walkthrough | guide | 88 | 200 | 14ms | 44ms | 76ms | 54ms | 195KB | 21 | yes | index | no | n/a | n/a | 6 console errors |
| /en/guides/obby-parkour-with-ragdoll-guide | guide | 88 | 200 | 12ms | 14ms | 73ms | 57ms | 183KB | 20 | yes | index | no | n/a | n/a | 6 console errors |
| /en/guides/rail-cart-buddies-guide | guide | 88 | 200 | 11ms | 13ms | 72ms | 53ms | 183KB | 20 | yes | index | no | n/a | n/a | 6 console errors |
| /en/games/drive-mad | game | 88 | 200 | 23ms | 22ms | 93ms | 93ms | 169KB | 21 | yes | index | no | yes | yes | 6 console errors |
| /en/games/duo-vikings | game | 88 | 200 | 18ms | 50ms | 80ms | 62ms | 169KB | 21 | yes | index | no | yes | yes | 6 console errors |
