# Draw a Perfect Circle rights record

- Page: `/games/draw-a-perfect-circle`
- Rights status: approved
- Commercial use: approved
- Third-party code or assets: none
- Verified: 2026-08-30

## Evidence

The scoring logic, date seed, Canvas guide geometry, interface, bilingual copy, colors and telemetry buckets were written as a clean-room Luma implementation for this batch. The page loads no external game runtime, image, font, audio, score service or iframe. It does not reproduce a competitor formula or visual treatment.

Implementation scope: `lib/games/draw-perfect-circle.ts`, `components/game/draw-perfect-circle.tsx`, and the corresponding governed route and tests. Browser-generated lines and the optional result text are the only game output. Raw pointer coordinates remain local.
