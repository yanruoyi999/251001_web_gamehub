# DEPRECATED — 外链 SEO 最终执行指南（历史文档）

- 状态：`Deprecated`
- 弃用日期：2026-08-23
- 原始版本：2025-01-11

本文件原先把 4399 等公开游戏平台/镜像来源示例写成 `Developer` 或 `Official Source`，这一做法已经废弃，**不得再用于游戏版权、来源、嵌入或 AdSense 上线判断**。

## 当前规则

1. `Developer`、`Rights Holder`、`Official Game URL`、`Distribution Provider`、`Embed Host` 必须分开记录。
2. URL 可访问、游戏平台收录、公开 iframe、镜像页面、截图或历史 SEO 外链都不构成商业/嵌入授权证据。
3. 只有 `embedPermissionStatus = verified` 的第三方游戏才能加载 iframe，并进入 sitemap、公开游戏列表和推荐面。
4. `unknown`、`link-only`、`blocked`、`expired` 默认 fail-closed。
5. 截图/缩略图权限与 iframe 权限独立审核。
6. 不得为了 SEO 或 AdSense 数量要求把未确认来源的游戏标成“官方开发者”或“官方来源”。

## 当前权威文档

- `docs/superpowers/specs/2026-08-23-game-rights-hardening-design.md`
- `docs/superpowers/plans/2026-08-23-game-rights-hardening.md`
- `THIRD_PARTY_NOTICES.md`
- `README.md`

历史正文仍可通过 Git 历史查看；从本次弃用起，不再作为执行 SOP。
