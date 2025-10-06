# 项目发布前检查清单

- [ ] 确认 `.env` / 环境变量在生产平台配置完整（数据库、Redis、Cloudinary、Meilisearch 等）
- [ ] 运行 `pnpm lint && pnpm type-check && pnpm test` 无报错
- [ ] 执行 `curl https://your-domain/api/health` 或访问 `/api/health` 确认返回 `status: ok`
- [ ] 使用 `pnpm ops:status` 巡检依赖服务状态
- [ ] 管理后台测试：登录、游戏上下架、评分审核流程
- [ ] 前台测试：多语言切换、游戏列表/详情、评分提交
- [ ] 备份策略：确认数据库备份与 Cloudinary/Meilisearch 的恢复方案
- [ ] 部署完成后开启监控与日志（Vercel/Sentry/Logtail 等）
