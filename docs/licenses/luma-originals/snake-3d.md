# Luma Snake 3D provenance

- Status: `verified-current-implementation`
- Runtime slug: `snake-3d`
- Product page: `/[locale]/games/snake-3d`
- Developer: Luma Game Hub
- Rights holder: Luma Game Hub project for the repository-authored game implementation; the exact legal entity behind the project was not independently verified in this audit.
- Code origin: the dedicated Snake 3D page, client game component, rules module, tests, SEO helper and OG route were introduced directly in this repository by commit `72e01ad9200da1c1b82fd3f2891a1c3d7f167764` (`feat: add gated Luma Snake 3D game`, 2026-08-16). No upstream Snake game repository is recorded in that release commit or in the current implementation.
- Renderer: `three@0.185.1`.
- Renderer license: MIT. Three.js is a rendering dependency, not the source of the game design/content.
- Renderer license source: `https://github.com/mrdoob/three.js/blob/dev/LICENSE` (verified 2026-08-23; copyright notice states 2010-2026 three.js authors).
- Gameplay graphics: procedural Three.js primitives/materials created by the local game component; no third-party gameplay image pack is required by the current scene.
- Audio assets: none. Snake V2 uses Web Audio API synthesized feedback tones when sound is enabled; no external audio files are shipped for gameplay feedback.
- Commercial use: the repository-authored implementation is treated as a Luma Original project asset; Three.js commercial use is permitted by its MIT license subject to retaining the MIT notice where required.
- Runtime hosting: self-hosted application code.
- Third-party iframe: no.
- External runtime game URL: no.
- Account/download required: no/no.
- Local persistence: browser localStorage for best score and sound preference only.
- Verification date: `2026-08-23`.

## Evidence boundary

This record documents the provenance visible from the repository history and the current source tree. It is not an independent legal title opinion. In particular, it does not infer ownership from the Three.js dependency: Three.js is third-party MIT software used only as the renderer.
