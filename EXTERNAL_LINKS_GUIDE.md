# 外链SEO优化指南

## 已完成的修改

### 1. 数据库扩展
- ✅ 在 `games` 表添加了3个新字段：
  - `developer_name` - 开发者名称
  - `developer_url` - 开发者官网（外链）
  - `source_url` - 游戏官方链接（外链）

### 2. 前端显示
- ✅ 游戏详情页自动显示开发者和官方链接
- ✅ 页脚添加了7个高质量游戏平台外链：
  - Itch.io (独立游戏平台)
  - Kongregate (在线游戏门户)
  - Newgrounds (创意游戏社区)
  - Game Jolt (游戏社区)
  - HTML5 Games (HTML5游戏资源)
  - Phaser (游戏开发框架)
  - PlayCanvas (3D游戏引擎)

### 3. 管理后台
- ✅ 游戏编辑表单增加了SEO外链字段
- ✅ 可以为每个游戏设置开发者和官方链接

## 数据库迁移步骤

### 方法1：使用提供的SQL文件
```bash
# 连接到你的PostgreSQL数据库
psql -h <主机> -U <用户名> -d <数据库名> -f db/migrations/add_seo_links.sql
```

### 方法2：手动执行SQL
```sql
ALTER TABLE games
ADD COLUMN IF NOT EXISTS developer_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS developer_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS source_url VARCHAR(500);
```

## 为现有游戏添加外链数据

### 通过管理后台（推荐）
1. 访问 `/admin/games`
2. 编辑每个游戏
3. 填写以下字段：
   - **Developer Name (SEO)**: 开发者名称
   - **Developer URL (SEO)**: 开发者官网
   - **Source/Official URL (SEO)**: 游戏官方链接

### 示例数据（可参考）
```json
{
  "developerName": "4399 Games",
  "developerUrl": "https://www.4399.com",
  "sourceUrl": "https://www.4399.com/flash/12345.htm"
}
```

## SEO外链最佳实践

### 1. 外链数量建议
- **每个游戏页面**：1-2个外链（开发者+官方链接）
- **全站页脚**：5-10个高质量外链（已添加）
- **总计每页**：6-12个外链

### 2. 外链质量要求
✅ **推荐链接**：
- 知名游戏平台（Steam、Itch.io、Kongregate等）
- 游戏开发商官网
- 游戏技术社区（Phaser、Unity等）
- 权威游戏媒体（IGN、GameSpot等）

❌ **避免链接**：
- 低质量站点
- 垃圾链接网站
- 无关行业网站
- 付费链接（需标记rel="sponsored"）

### 3. 链接属性说明
```html
<!-- 当前使用的属性 -->
<a href="..." target="_blank" rel="noopener">

<!-- 不同场景的建议 -->
rel="noopener"          - 信任的合作伙伴（当前使用）
rel="noopener nofollow" - 用户生成内容
rel="noopener sponsored" - 付费/广告链接
```

## Google AdSense 审核要点

### 已满足的要求 ✅
- [x] 网站有外部链接
- [x] 链接到权威网站
- [x] 外链与内容相关
- [x] 使用HTTPS
- [x] 移动端友好

### 待完善项目 📋
- [ ] 添加隐私政策页面
- [ ] 添加关于我们页面
- [ ] 添加联系方式页面
- [ ] 确保至少20-30个游戏页面
- [ ] 每周定期更新内容

## 外链添加频率建议

### 保守策略（推荐）
- **第1周**：为5-10个游戏添加外链
- **第2周**：再添加10-15个游戏外链
- **第3周**：继续添加剩余游戏外链
- **持续**：新游戏都添加外链

### 激进策略（不推荐）
- 一次性为所有游戏添加外链
- 风险：可能被Google识别为过度优化

## 🔍 外链巡检流程（重要！避免死链）

### 巡检频次与责任人（重要！请严格执行）

| 检查类型 | 频率 | 责任人 | 执行日期 | 预计耗时 | 工具 |
|---------|------|--------|---------|---------|------|
| **全面检查** | 每月1次 | 技术负责人 | 每月1日 | 30分钟 | 自动化脚本 |
| **页脚抽查** | 每周1次 | 内容编辑 | 每周一上午 | 10分钟 | 手动点击 |
| **新游戏外链验证** | 添加时 | 内容编辑 | 游戏上线前 | 2分钟/游戏 | 手动点击 |
| **Search Console检查** | 每周1次 | SEO负责人 | 每周五 | 15分钟 | Google工具 |

**自动化脚本**：
```bash
# 位置：scripts/check-external-links.ts
# 执行命令
pnpm tsx scripts/check-external-links.ts

# 建议：将此命令添加到月度运维计划
```

### 巡检清单模板
```markdown
## 外链巡检记录 - [年月]

### 执行信息
- 执行日期：2025年__月__日
- 执行人：技术负责人/内容编辑
- 检查范围：□ 全部外链  □ 页脚链接  □ 游戏详情页抽查

### 1. 页脚友情链接检查（共7个）
- [ ] Itch.io - https://itch.io - 状态：______
- [ ] Kongregate - https://www.kongregate.com - 状态：______
- [ ] Newgrounds - https://www.newgrounds.com/games - 状态：______
- [ ] Game Jolt - https://gamejolt.com - 状态：______
- [ ] HTML5 Games - https://html5games.com - 状态：______
- [ ] Phaser - https://phaser.io - 状态：______
- [ ] PlayCanvas - https://playcanvas.com - 状态：______

### 2. 游戏详情页外链抽查（至少抽查10个游戏）
| 游戏ID | 游戏名称 | 开发者链接 | 官方链接 | 问题 |
|--------|---------|-----------|---------|------|
| 1      | xxx     | ✅ 正常    | ✅ 正常  | 无   |
| 2      | xxx     | ✅ 正常    | ❌ 404  | 需更新|

### 3. 发现的问题汇总
1. 游戏ID #2 的官方链接返回404
2. （其他问题...）

### 4. 处理措施
1. 已更新游戏#2的source_url为新地址
2. 已在Search Console提交重新抓取

### 5. 下次巡检
预计日期：____年__月__日
```

### 自动化巡检脚本（推荐定期运行）
创建文件 `scripts/check-links.ts`:
```typescript
/**
 * 外链健康检查脚本
 * 用法：pnpm tsx scripts/check-links.ts
 */

const FOOTER_LINKS = [
  { name: 'Itch.io', url: 'https://itch.io' },
  { name: 'Kongregate', url: 'https://www.kongregate.com' },
  { name: 'Newgrounds', url: 'https://www.newgrounds.com/games' },
  { name: 'Game Jolt', url: 'https://gamejolt.com' },
  { name: 'HTML5 Games', url: 'https://html5games.com' },
  { name: 'Phaser', url: 'https://phaser.io' },
  { name: 'PlayCanvas', url: 'https://playcanvas.com' },
];

async function checkLink(url: string): Promise<{ ok: boolean; status?: number }> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(10000)
    });
    return { ok: response.ok, status: response.status };
  } catch (error) {
    return { ok: false };
  }
}

async function main() {
  console.log('🔍 开始检查页脚友情链接...\n');

  let failedCount = 0;

  for (const link of FOOTER_LINKS) {
    const result = await checkLink(link.url);
    const icon = result.ok ? '✅' : '❌';
    console.log(`${icon} ${link.name.padEnd(20)} ${link.url} ${result.status ? `(${result.status})` : '(timeout)'}`);
    if (!result.ok) failedCount++;
  }

  console.log(`\n${failedCount === 0 ? '✅ 所有链接正常' : `⚠️  发现 ${failedCount} 个异常链接`}`);
  process.exit(failedCount > 0 ? 1 : 0);
}

main();
```

### 死链处理SOP
1. **发现阶段**：记录失效链接URL、游戏ID、发现日期
2. **分析原因**：网站关闭 / 暂时故障 / URL变更
3. **查找替代**：
   - 使用Internet Archive查看历史快照
   - 搜索同类型权威替代网站
   - 咨询游戏开发社区
4. **更新链接**：
   - 游戏详情页：通过管理后台修改
   - 页脚链接：修改 `components/layout/Footer.tsx`
5. **验证上线**：确认新链接可访问且内容相关
6. **提交抓取**：在Google Search Console请求重新抓取受影响页面

### 预防措施
- ✅ 优先选择大型平台（不易关闭）
- ✅ 避免个人博客或小网站
- ✅ 定期备份外链清单
- ✅ 在CI/CD中集成链接检查（可选）

## 监控与优化

### 使用Google Search Console
1. 提交网站sitemap
2. **重要**：订阅"手动操作"和"安全问题"邮件通知
3. 每周检查"覆盖率"报告，关注404错误
4. 检查是否有"不自然链接"警告
5. 关注页面索引情况

### Google Analytics监控指标
- 跳出率（避免外链导致过高跳出）
- 页面停留时间
- 自然搜索流量趋势

### 关键SEO指标
- **外链质量分数**（使用Moz/Ahrefs/SEMrush工具）
- **页面索引数量**（Search Console）
- **Crawl错误数**（目标：0个404）
- **自然搜索流量**（Google Analytics）
- **AdSense审核状态**
- **每月死链数量**（目标：0个）

## 常见问题

### Q: 一天添加多少外链比较合理？
A: 建议每天为5-10个游戏添加外链，持续2-3周。

### Q: 外链会影响网站加载速度吗？
A: 不会，外链只是普通的<a>标签，不影响性能。

### Q: 需要定期更新外链吗？
A: 建议每月检查一次，确保链接仍然有效。

### Q: 如果某个外链网站关闭了怎么办？
A: 及时更新或删除失效链接，避免404错误。

## 下一步行动

1. ✅ 执行数据库迁移SQL
2. ⏳ 为现有游戏添加外链（建议分批进行）
3. ⏳ 创建必要的政策页面
4. ⏳ 提交Google AdSense申请
5. ⏳ 监控效果并优化

## 技术支持

如有问题，请参考以下文件：
- 数据库Schema: `db/schema/games.ts`
- 游戏详情页: `app/[locale]/games/[slug]/page.tsx`
- 页脚组件: `components/layout/Footer.tsx`
- 管理表单: `components/admin/game-edit-form.tsx`
