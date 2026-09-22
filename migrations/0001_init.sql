CREATE TABLE IF NOT EXISTS user_state (
  user_email TEXT PRIMARY KEY,
  payload TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_state_updated_at
  ON user_state(updated_at);
