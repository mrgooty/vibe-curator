const express = require('express');
const scrapeInstagram = require('../agents/instagramAgent');
const router = express.Router();

router.get('/instagram', async (req, res) => {
  const { tag } = req.query;
  try {
    const data = await scrapeInstagram(tag);
    res.json(data);
  } catch (error) {
    console.error('Instagram scrape failed:', error);
    res.status(500).send('Scraper failed');
  }
});

module.exports = router;
