const db = require('../db/db');

exports.save = async (userId, preferences) => {
  const query = `INSERT INTO user_preferences (user_id, data) VALUES ($1, $2)
                 ON CONFLICT (user_id) DO UPDATE SET data = $2`;
  await db.query(query, [userId, preferences]);
};

exports.get = async (userId) => {
  const result = await db.query('SELECT data FROM user_preferences WHERE user_id = $1', [userId]);
  return result.rows[0]?.data || {};
};
