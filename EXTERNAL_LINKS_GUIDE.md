# DEPRECATED — 外链 SEO 优化指南（历史文档）

- 状态：`Deprecated`
- 弃用日期：2026-08-23
- 原始用途：SEO 外链与游戏来源字段示例

原文将 4399 等平台示例写成开发者/官方来源，并把“存在外链”与 AdSense 准备度绑定。该模型已经废弃。

## 当前来源字段语义

| 字段 | 含义 | 能否作为 iframe 授权 |
| --- | --- | --- |
| Original Developer | 原始开发者 | 否，仍需授权证据 |
| Rights Holder | 当前权利人 | 否，需记录实际许可 |
| Official Game URL | 官方游戏页 | 否，只证明官方页面 |
| Distribution Provider | 获授权的发行/分发方 | 取决于协议 |
| Embed Host | 实际 iframe 主机 | 否 |
| License URL / Evidence | 许可条款或书面证据 | 用于审核 |
| Embed Permission Status | `verified/link-only/unknown/blocked/expired` | 只有 `verified` 允许 iframe |

## 禁止做法

- 不得因为游戏在 4399、GitHub Pages、聚合站或其他网站可访问，就标成“可商用”。
- 不得把镜像/分发平台自动写成开发者。
- 不得把 iframe URL、HTTP 200、截图成功或页面可打开当成授权证据。
- 不得为满足 SEO/AdSense 页面数量而放行 `unknown` 权限内容。

## 当前权威文档

- `docs/superpowers/specs/2026-08-23-game-rights-hardening-design.md`
- `THIRD_PARTY_NOTICES.md`
- `README.md`

历史正文仍可通过 Git 历史查看；从本次弃用起，不再作为运营或版权 SOP。
