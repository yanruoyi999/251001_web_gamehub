# 安全与合规指南

## 1. 安全头部
Next.js 的 `next.config.js` 已配置常见安全 HTTP 头部：
- `Content-Security-Policy`
- `Referrer-Policy`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Permissions-Policy`

部署后可通过 `curl -I` 或浏览器 DevTools 验证响应头是否生效。

## 2. 后台访问
- 使用强密码（16 位以上）并安全保存。
- 建议在生产环境启用域名访问并强制 HTTPS。
- 管理员会话 Cookie 仅在生产环境下启用 `secure` 属性。

## 3. 接口与限流
- `/api/ratings` 采用 Redis 限流，防止刷评。
- `/api/health` 仅暴露基础状态，生产中可使用防火墙或 Auth 保护。

## 4. 数据备份
- 可在 `.secure/` 中编写备份脚本（例如 `wf-psql-daily.sh`），建议部署到服务器定时任务。

## 5. 后续建议
- 引入 Sentry / Logtail 等监控告警。
- Playwright 补充关键流程 E2E；可在 CI 中开启。
- 定期执行依赖审计（`pnpm audit`）。
