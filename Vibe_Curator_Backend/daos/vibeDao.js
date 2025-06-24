const db = require('../db/db');

exports.save = async (userId, paths) => {
  const query = `INSERT INTO vibe_history (user_id, data) VALUES ($1, $2)`;
  await db.query(query, [userId, JSON.stringify(paths)]);
};
