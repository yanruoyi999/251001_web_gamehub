# Two-Player Game License Whitelist

Reviewed 2026-08-18 for the first Luma `2 Player Unblocked Games` MVP. This file is an engineering provenance record, not legal advice. `approved` means the evidence inspected is sufficient for this branch's intended use; `needs-review` means do not ship yet.

| Candidate | Source | License evidence | Asset/dependency review | Commercial/self-host/modification | Status | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| Two-Player-Pong | `sleepyrob0t/Two-Player-Pong` | MIT, copyright James Nikolson, `LICENSE` | Repository contains only `index.html`, `index.js`, `style.css`, README and LICENSE; reviewed HTML/JS contains no external script/image/audio/font URL | MIT text expressly permits use/copy/modify/distribute/sublicense/sell with notice retained | **approved** | Vendor pinned commit `a8f4034e49d875a26d5b6b83833429f28453f9e4`; retain full MIT notice; add only Luma integration hooks/styles needed for sandboxed hosting. |
| Two Player Snake | `Nika86/Two-player-snake` | MIT-style license, copyright Nikoloz Tsimakuridze, `LICENSE.md` | Repository includes `Assets/background_images` and `Assets/menu_assets`; no separate asset provenance was found in the reviewed top-level README/license | Code license is permissive, but third-party status of bundled images is not independently established | **needs-review** | Do not vendor assets. Could later approve code-only with all visual assets replaced by Luma originals after a focused source audit. |
| Connect Four Two Player | `bocaletto-luca/Connect-Four-Two-Player` | GPL-3.0 `LICENSE` | Small HTML/JS project, but GPL distribution/source obligations require separate product review | Commercial use is possible under GPL, but redistribution/modification obligations are intentionally not accepted automatically by this MVP | **needs-review** | Keep out of v1 until GPL obligations are reviewed and deliberately accepted. |
| Dice Duel | `P1cq/Dice-Duel` | MIT, copyright Mohamed Ayman, `LICENSE` | Repository includes `images/`, `soundEffects/` and a PNG flowchart; asset-specific provenance not established in the reviewed license/top level | Code license is permissive; media chain not yet closed | **needs-review** | Do not ship until every image/audio source is verified or replaced with Luma originals. |
| Tic-Tac-Toe JavaScript | `FelipeEnne/Tic-Tac-Toe-JavaScript` | MIT, copyright Felipe Enne Mendes Ribeiro, `LICENSE` | Repository contains an `images/` directory plus package dependencies; asset chain not independently verified | Code license is permissive; bundled image provenance still needs review | **needs-review** | Could become a later approved turn-based game after replacing or verifying images. |
| Two Players Tank Game | `tung2389/Two-players-tank-game` | GitHub identifies an MIT license; repository has `LICENSE` | Node/client/controller project with a broader dependency/runtime surface; not a drop-in static self-host runtime | License is permissive, but dependency and asset/runtime provenance is not yet closed | **needs-review** | Not appropriate for first static MVP without a deeper dependency/source audit. |
| Elements Battle | `notarseniy/ElementsBattle` | Repository contains MIT `LICENSE` | Webpack/Babel application with client tree and npm dependencies; bundled media/dependency scope not fully audited | MIT code is permissive, but full distributable closure is not established | **needs-review** | Keep out of v1. |
| TwoPlayerGames | `tridpt/TwoPlayerGames` | GitHub repository search reports MIT | Multi-game repository; larger asset footprint and individual-game provenance require per-game inspection | Do not infer that every bundled asset is covered solely from repository metadata | **needs-review** | Evaluate individual games separately if the first MVP needs expansion. |
| JHEMM Fighters | `team-jhemm-fighters/jhemm-fighters` | GitHub repository search reports MIT | Fighting-game presentation is asset-heavy; character/art/audio provenance not reviewed | Code license alone is not sufficient for the whole shipped experience | **needs-review** | Exclude from v1. |
| Fource | `NicNol/fource` | GitHub repository search reports MIT | Not yet audited file-by-file for media, fonts or external runtime resources | Permission appears permissive at repository level; distributable closure not yet established | **needs-review** | Exclude until a focused audit. |
| TwoPlayerSnake | `aurobindodebnath/TwoPlayerSnake` | **No LICENSE file present in reviewed top-level repository contents** | JS/Style plus image; README alone is not redistribution permission | No explicit license means no permission is assumed | **blocked** | Do not copy, modify or self-host. |
| Summer Rider | market/competitor reference only | No Luma authorization evidence | Existing third-party game/IP | No permission established | **blocked** | Research demand only; never copy name/source/art/assets or create an unauthorized playable page. |

## Evidence inspected

- `sleepyrob0t/Two-Player-Pong` MIT license: https://github.com/sleepyrob0t/Two-Player-Pong/blob/main/LICENSE
- `sleepyrob0t/Two-Player-Pong` pinned revision: https://github.com/sleepyrob0t/Two-Player-Pong/commit/a8f4034e49d875a26d5b6b83833429f28453f9e4
- `Nika86/Two-player-snake` license: https://github.com/Nika86/Two-player-snake/blob/master/LICENSE.md
- `Nika86/Two-player-snake` assets tree: https://github.com/Nika86/Two-player-snake/tree/master/Assets
- `bocaletto-luca/Connect-Four-Two-Player` GPL-3.0 license: https://github.com/bocaletto-luca/Connect-Four-Two-Player/blob/main/LICENSE
- `P1cq/Dice-Duel` MIT license: https://github.com/P1cq/Dice-Duel/blob/main/LICENSE
- `FelipeEnne/Tic-Tac-Toe-JavaScript` MIT license: https://github.com/FelipeEnne/Tic-Tac-Toe-JavaScript/blob/development/LICENSE
- `aurobindodebnath/TwoPlayerSnake` reviewed top-level contents: https://github.com/aurobindodebnath/TwoPlayerSnake

## MVP quantity decision

Only one external game is currently `approved` without additional media/dependency work. Per the approved fallback rule, v1 therefore ships:

1. **Classic Pong Duel** — approved MIT upstream, pinned and self-hosted.
2. **Key Sprint Duel** — Luma Original, original code/visuals, same-keyboard racing.
3. **Grid Claim Duel** — Luma Original, original code/visuals, local two-player puzzle/territory game.

This satisfies the minimum 3-game legal MVP while keeping the two-original fallback cap. No external candidate is promoted merely to reach five games.
