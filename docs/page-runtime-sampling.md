# Luma Runtime Quality Sampling

Methodology updated: 2026-08-23

The previous checked-in snapshot used a `Playable=yes` column even though deterministic CI intentionally aborted third-party frame navigation and only verified that an `<iframe>` element became visible. That snapshot is retired because it could be misread as evidence that an external game actually loaded.

## Current methodology

The runtime audit now reports two separate signals:

- **Iframe shell** — whether the Luma player UI creates and displays the iframe element after the user presses Play.
- **External load** — whether an external child frame actually navigates when explicit external verification is enabled.

Deterministic pull-request CI keeps third-party document traffic isolated from external reliability. In that mode, `External load` is reported as **`not-verified`**, never as `yes`.

Real third-party loading can be checked explicitly with:

```bash
pnpm audit:runtime-quality -- --base-url <target> --verify-external-frames
```

A successful shell check is not copyright, commercial-use, iframe-permission, or AdSense authorization evidence.

## Current rights boundary

Legacy 4399 imports carry `embedPermissionStatus = unknown`, so they are no longer runtime-playability samples, public catalogue targets, sitemap targets, or iframe targets. Runtime iframe sampling should focus on Luma-owned or separately verified game routes.

## CI threshold

The normal runtime quality gate still checks HTTP status, canonical metadata, mobile overflow, page performance, console errors, Play-button visibility, iframe-shell visibility where applicable, and fullscreen controls. External game loading is evaluated only when the explicit network-enabled mode is used.
