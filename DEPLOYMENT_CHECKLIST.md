# DEPRECATED — 外链 SEO 部署清单（历史文档）

- 状态：`Deprecated`
- 弃用日期：2026-08-23
- 原始版本：2025-01-11

此清单曾建议把 4399 写入 `Developer Name` / `Source URL` 并以游戏数量作为 AdSense 准备指标。该来源模型已经废弃，不能作为当前部署或版权验收依据。

## 当前部署前必须满足的游戏权利门禁

- [ ] 第三方游戏存在可核验的 Rights Holder / Original Developer / Distribution Provider 信息
- [ ] `embedPermissionStatus = verified` 后才允许 iframe
- [ ] 商业使用/广告权限已经确认；缺少证据写 `unknown`，不得推断
- [ ] 截图与缩略图权限独立确认
- [ ] 未验证游戏不进入 sitemap、公开游戏列表、分类/标签聚合和推荐面
- [ ] Runtime 报告区分 iframe shell 与真实 external load，不把 DOM iframe 当成“可玩”证明
- [ ] `THIRD_PARTY_NOTICES.md` 与权利记录同步
- [ ] 数据库已应用 `db/migrations/add_game_rights_metadata.sql`

## 当前权威文档

- `docs/superpowers/specs/2026-08-23-game-rights-hardening-design.md`
- `docs/superpowers/plans/2026-08-23-game-rights-hardening.md`
- `THIRD_PARTY_NOTICES.md`

历史正文仍可通过 Git 历史查看；从本次弃用起，不再作为部署 SOP。
