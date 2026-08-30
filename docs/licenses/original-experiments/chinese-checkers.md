# Chinese Checkers rights record

- Page: `/games/chinese-checkers`
- Rights status: approved
- Commercial use: approved
- Third-party code or assets: none
- Verified: 2026-08-30

## Evidence

The implementation uses only traditional game mechanics as factual rules: adjacent steps, non-capturing jumps, chained jump reachability and moving ten pieces into the opposite camp. All rule explanations are independently written. The 121-hole coordinate model, legal-move validator, deterministic AI ranking, board rendering, colors and bilingual interface are original Luma work.

Implementation scope: `lib/games/chinese-checkers.ts`, `components/game/chinese-checkers.tsx`, and the corresponding governed route and tests. No commercial board image, app code, opponent engine, animation, sound, trademark artwork, screenshot or iframe is included.

## Rules review provenance

Rules cross-check: the builder consumed the accepted task 16 brief and its fixed SERP evidence set; it did not start a new external research cycle after the governance stop. The upstream 2026-08-27 review records independent playable and rules surfaces and fixes this MVP to adjacent steps, non-capturing chained jumps, a 121-hole board and an all-ten-pieces target-camp win.

- Rule source 1: Coolmath Games Chinese Checkers description in the task 16 fixed Top20 evidence set.
- Rule source 2: Ducksters Chinese Checkers rules description in the same independent task 16 evidence set.

Builder evidence paths: `/Users/yanruoyi/ai-native/ops/daily-longtail-research/user-research/evidence/2026-08-27-task16-luna-correction/chinese-checkers-page-brief.md` and `live-semrush-serp-rerun.md`. No wording, image, code or asset was copied from either surface.
