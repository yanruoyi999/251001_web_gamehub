-- 添加SEO外链字段到games表
-- 执行此SQL前请先备份数据库

ALTER TABLE games
ADD COLUMN IF NOT EXISTS developer_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS developer_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS source_url VARCHAR(500);

-- 为现有游戏添加示例外链数据（可选）
-- 这些是常见的游戏开发商和平台

COMMENT ON COLUMN games.developer_name IS '游戏开发者名称';
COMMENT ON COLUMN games.developer_url IS '游戏开发者官网链接（SEO外链）';
COMMENT ON COLUMN games.source_url IS '游戏官方链接/原始链接（SEO外链）';
