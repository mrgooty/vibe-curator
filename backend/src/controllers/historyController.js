const historyService = require('../services/historyService');

exports.getUserHistory = async (req, res) => {
  try {
    const userId = req.query.userId;
    const history = await historyService.getHistory(userId);
    res.status(200).json({ history });
  } catch (err) {
    console.error('History retrieval failed:', err);
    res.status(500).json({ error: 'History lookup failed.' });
  }
};
