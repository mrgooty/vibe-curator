const userService = require('../services/userService');

exports.savePreferences = async (req, res) => {
  try {
    const userId = req.body.userId; // From OAuth or device UUID
    const preferences = req.body.preferences;
    await userService.savePreferences(userId, preferences);
    res.status(200).json({ message: 'Preferences saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPreferences = async (req, res) => {
  try {
    const userId = req.query.userId;
    const data = await userService.getPreferences(userId);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
