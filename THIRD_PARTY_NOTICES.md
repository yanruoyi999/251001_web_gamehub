# Third-Party Notices and Rights Boundaries

Updated: 2026-08-23

The repository-level MIT license applies only to original source code and documentation that Luma Game Hub contributors have the right to license. It does **not** grant rights to third-party games, game code, artwork, screenshots, audio, fonts, names, logos, trademarks, or other content merely because a reference or historical copy exists in this repository.

## Imported game catalogue data

`game_iframes.tsv` and `public/data/4399-sample.json` are provenance/reference datasets. A reachable URL, iframe URL, mirror page, public distribution page, or checked-in catalogue entry is not evidence of commercial-use, advertising, screenshot, or embed permission.

Imported records default to `embedPermissionStatus = unknown`. Under the current publication policy, only records with explicit `verified` embed permission can load a third-party iframe or enter the indexed/recommended catalogue surface.

## Historical game and guide screenshots

Files under `public/game-screenshots/` and `public/guide-screenshots/` were historical captures used during prior QA/editorial work. They are excluded from the Luma MIT license. The current application blocks both `/game-screenshots/*` and `/guide-screenshots/*` from the public production surface, and database-backed game details suppress thumbnails/screenshots unless their separate media permission is `verified`.

The screenshot-capture scripts are also fail-closed: they require an explicit operator opt-in after media rights have been independently verified. Embed permission alone is not screenshot permission.

Do not reuse, republish, regenerate, or treat these historical captures as promotional assets unless a rights record separately verifies screenshot/thumbnail permission.

## Game names and trademarks

Third-party game names, developer names, platform names, logos, and trademarks remain the property of their respective owners. Descriptive references do not imply sponsorship, affiliation, ownership, or authorization.

## Required rights record

Before a third-party game can be treated as publishable inventory, its database/provenance record should document, as applicable:

- original developer
- rights holder
- official game URL
- authorized distribution provider
- license type and license URL
- whether commercial use is allowed
- embed permission status
- whether advertising around the embed is allowed
- screenshot permission
- thumbnail permission
- verification evidence
- verification date

The fields are independent. For example, permission to embed a game does not automatically grant permission to copy screenshots, and permission to link to an official page does not automatically grant iframe permission.

## Dependencies

Third-party software dependencies remain governed by their own licenses and notices. Refer to the dependency packages and lockfile for the applicable upstream license terms.

## Rights questions or takedown requests

If ownership or permission is uncertain, the content must remain fail-closed (`unknown`, `link-only`, `blocked`, or `expired` as applicable) until evidence is reviewed. Rights-holder or takedown requests should be handled through the site's published contact channel and recorded before any content is restored.
