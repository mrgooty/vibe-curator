const db = require('../db/db');

exports.fetch = async (userId) => {
  const query = `SELECT data, created_at FROM vibe_history WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10`;
  const result = await db.query(query, [userId]);
  return result.rows || [];
};
