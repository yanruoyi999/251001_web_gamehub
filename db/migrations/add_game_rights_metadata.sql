-- Auditable game provenance / rights metadata.
-- Existing rows intentionally default to unknown; publication gates must fail closed.

ALTER TABLE games
  ADD COLUMN IF NOT EXISTS original_developer VARCHAR(255),
  ADD COLUMN IF NOT EXISTS rights_holder VARCHAR(255),
  ADD COLUMN IF NOT EXISTS official_game_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS distribution_provider VARCHAR(255),
  ADD COLUMN IF NOT EXISTS license_type VARCHAR(100),
  ADD COLUMN IF NOT EXISTS license_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS commercial_use_allowed BOOLEAN,
  ADD COLUMN IF NOT EXISTS embed_permission_status VARCHAR(20) DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS ads_allowed BOOLEAN,
  ADD COLUMN IF NOT EXISTS screenshot_permission VARCHAR(20) DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS thumbnail_permission VARCHAR(20) DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS verification_evidence TEXT,
  ADD COLUMN IF NOT EXISTS rights_verified_at TIMESTAMP;

UPDATE games
SET embed_permission_status = 'unknown'
WHERE embed_permission_status IS NULL;

UPDATE games
SET screenshot_permission = 'unknown'
WHERE screenshot_permission IS NULL;

UPDATE games
SET thumbnail_permission = 'unknown'
WHERE thumbnail_permission IS NULL;
