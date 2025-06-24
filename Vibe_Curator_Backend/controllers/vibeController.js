const vibeService = require('../services/vibeService');

exports.generateVibes = async (req, res) => {
  try {
    const { userId, location, preferences } = req.body;

    const vibePaths = await vibeService.generateVibePaths(userId, location, preferences);
    res.status(200).json({ paths: vibePaths });
  } catch (err) {
    console.error('Vibe generation failed:', err);
    res.status(500).json({ error: 'Vibe engine crashed. Maybe too many vibes.' });
  }
};
