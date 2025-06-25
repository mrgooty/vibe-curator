const express = require('express');
const scrapeInstagram = require('../agents/instagramAgent');
const { scrapeTikTok, scrapeTikTokUser } = require('../agents/tiktokAgent');
const { 
  getEnhancedInstagramData, 
  getEnhancedTikTokData, 
  getEnhancedTikTokUserData,
  performCrossPlatformAnalysis 
} = require('../services/enhancedApifyService');

const router = express.Router();

// Basic Instagram scraping
router.get('/instagram', async (req, res) => {
  const { tag } = req.query;
  try {
    const data = await scrapeInstagram(tag);
    res.json(data);
  } catch (error) {
    console.error('Instagram scrape failed:', error);
    res.status(500).json({ error: 'Instagram scraping failed', message: error.message });
  }
});

// Enhanced Instagram scraping with AI analysis
router.get('/instagram/enhanced', async (req, res) => {
  const { tag, includeAI } = req.query;
  try {
    const options = { includeAIAnalysis: includeAI !== 'false' };
    const data = await getEnhancedInstagramData(tag, options);
    res.json(data);
  } catch (error) {
    console.error('Enhanced Instagram analysis failed:', error);
    res.status(500).json({ error: 'Enhanced Instagram analysis failed', message: error.message });
  }
});

// Basic TikTok hashtag scraping
router.get('/tiktok', async (req, res) => {
  const { hashtag, limit } = req.query;
  try {
    const data = await scrapeTikTok(hashtag, parseInt(limit) || 50);
    res.json(data);
  } catch (error) {
    console.error('TikTok scrape failed:', error);
    res.status(500).json({ error: 'TikTok scraping failed', message: error.message });
  }
});

// Enhanced TikTok hashtag scraping with AI analysis
router.get('/tiktok/enhanced', async (req, res) => {
  const { hashtag, limit, includeAI } = req.query;
  try {
    const options = { 
      limit: parseInt(limit) || 50,
      includeAIAnalysis: includeAI !== 'false' 
    };
    const data = await getEnhancedTikTokData(hashtag, options);
    res.json(data);
  } catch (error) {
    console.error('Enhanced TikTok analysis failed:', error);
    res.status(500).json({ error: 'Enhanced TikTok analysis failed', message: error.message });
  }
});

// TikTok user profile scraping
router.get('/tiktok/user', async (req, res) => {
  const { username } = req.query;
  try {
    const data = await scrapeTikTokUser(username);
    res.json(data);
  } catch (error) {
    console.error('TikTok user scrape failed:', error);
    res.status(500).json({ error: 'TikTok user scraping failed', message: error.message });
  }
});

// Enhanced TikTok user profile scraping with AI analysis
router.get('/tiktok/user/enhanced', async (req, res) => {
  const { username, includeAI } = req.query;
  try {
    const options = { includeAIAnalysis: includeAI !== 'false' };
    const data = await getEnhancedTikTokUserData(username, options);
    res.json(data);
  } catch (error) {
    console.error('Enhanced TikTok user analysis failed:', error);
    res.status(500).json({ error: 'Enhanced TikTok user analysis failed', message: error.message });
  }
});

// Cross-platform analysis
router.post('/cross-platform', async (req, res) => {
  const { platforms, options } = req.body;
  try {
    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({ error: 'Platforms array is required' });
    }
    
    const data = await performCrossPlatformAnalysis(platforms, options || {});
    res.json(data);
  } catch (error) {
    console.error('Cross-platform analysis failed:', error);
    res.status(500).json({ error: 'Cross-platform analysis failed', message: error.message });
  }
});

// Health check for Apify services
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    services: ['instagram', 'tiktok', 'cross-platform'],
    timestamp: new Date().toISOString() 
  });
});

module.exports = router;
