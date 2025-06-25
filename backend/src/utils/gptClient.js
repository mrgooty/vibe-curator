const { OpenAI } = require('openai');
const { analyzeVibeWithLangChain } = require('../../ai/langchainClient');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Legacy GPT client function - maintained for backward compatibility
 * @param {Object} rawData - Raw data to analyze
 * @returns {Promise<Object>} Vibe summary
 */
exports.getVibeSummary = async (rawData) => {
  const prompt = `
  You're a Vibe Curator AI. Based on this social media + travel data, summarize top vibe themes, activities, and generate a suggested path for a user. Respond as structured JSON.

  Data: 
  ${JSON.stringify(rawData)}

  Respond with:
  {
    "title": "...",
    "duration": "...",
    "route": [{ "lat": ..., "lon": ..., "title": "..." }],
    "vibeTags": ["...", "..."],
    "images": ["..."],
    "summary": "..."
  }
  `;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7
  });

  return JSON.parse(completion.choices[0].message.content);
};

/**
 * Enhanced vibe analysis using LangChain integration
 * @param {Object} rawData - Raw data to analyze
 * @param {string} preferences - Optional user preferences
 * @returns {Promise<Object>} Enhanced vibe summary
 */
exports.getEnhancedVibeSummary = async (rawData, preferences = '') => {
  try {
    // Use LangChain for enhanced analysis
    const result = await analyzeVibeWithLangChain(rawData, preferences);
    return result;
  } catch (error) {
    console.error('Enhanced vibe analysis failed, falling back to legacy method:', error);
    // Fallback to legacy method if LangChain fails
    return exports.getVibeSummary(rawData);
  }
};

/**
 * Generate content insights using OpenAI
 * @param {Object} content - Content to analyze
 * @returns {Promise<Object>} Content insights
 */
exports.generateContentInsights = async (content) => {
  const prompt = `
  Analyze the following social media content and provide insights:

  Content: ${JSON.stringify(content)}

  Please provide insights in the following JSON format:
  {
    "engagement_potential": "high|medium|low",
    "content_themes": ["theme1", "theme2"],
    "target_audience": "description",
    "optimization_suggestions": ["suggestion1", "suggestion2"],
    "trending_elements": ["element1", "element2"],
    "sentiment_score": 0.5
  }
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Content insights generation failed:', error);
    throw new Error(`Content insights generation failed: ${error.message}`);
  }
};

/**
 * Generate hashtag recommendations
 * @param {Object} content - Content to analyze
 * @param {string} platform - Target platform (instagram, tiktok, etc.)
 * @returns {Promise<Object>} Hashtag recommendations
 */
exports.generateHashtagRecommendations = async (content, platform = 'instagram') => {
  const prompt = `
  Based on the following content, generate relevant hashtag recommendations for ${platform}:

  Content: ${JSON.stringify(content)}

  Provide recommendations in this JSON format:
  {
    "trending_hashtags": ["#hashtag1", "#hashtag2"],
    "niche_hashtags": ["#niche1", "#niche2"],
    "branded_hashtags": ["#brand1", "#brand2"],
    "engagement_hashtags": ["#engage1", "#engage2"],
    "total_recommended": 20,
    "strategy_notes": "Brief strategy explanation"
  }
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Hashtag recommendations generation failed:', error);
    throw new Error(`Hashtag recommendations generation failed: ${error.message}`);
  }
};

/**
 * Analyze competitor content
 * @param {Array} competitorContent - Array of competitor posts
 * @returns {Promise<Object>} Competitor analysis
 */
exports.analyzeCompetitorContent = async (competitorContent) => {
  const prompt = `
  Analyze the following competitor content and provide strategic insights:

  Competitor Content: ${JSON.stringify(competitorContent)}

  Provide analysis in this JSON format:
  {
    "content_patterns": ["pattern1", "pattern2"],
    "successful_strategies": ["strategy1", "strategy2"],
    "content_gaps": ["gap1", "gap2"],
    "engagement_tactics": ["tactic1", "tactic2"],
    "posting_frequency": "analysis",
    "content_quality_score": 8.5,
    "recommendations": ["rec1", "rec2"]
  }
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Competitor analysis failed:', error);
    throw new Error(`Competitor analysis failed: ${error.message}`);
  }
};

// Export the OpenAI client for direct use if needed
exports.openai = openai;
