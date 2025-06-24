CREATE TABLE user_preferences (
  user_id TEXT PRIMARY KEY,
  data JSONB
);

CREATE TABLE vibe_history (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
