-- Migration: Add input_hash to sprints
-- Date: 2025-12-14

-- 1. Add column
ALTER TABLE sprints ADD COLUMN input_hash text NOT NULL DEFAULT '';

-- 2. Backfill (Optional for demo, but good practice). 
-- Since we can't easily compute hash in SQL without the logic, we leave it empty or update via app.
-- For now, default '' implies old rows won't hit the cache, which is fine.

-- 3. Add Index
CREATE UNIQUE INDEX IF NOT EXISTS idx_sprints_user_inputhash ON sprints(user_id, input_hash);

-- 4. Remove default if desired (optional)
-- ALTER TABLE sprints ALTER COLUMN input_hash DROP DEFAULT;
