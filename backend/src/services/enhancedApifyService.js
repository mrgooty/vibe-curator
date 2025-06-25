const scrapeInstagram = require('../agents/instagramAgent');
const { scrapeTikTok, scrapeTikTokUser } = require('../agents/tiktokAgent');
const { executeContentAnalysis } = require('../../ai/workflows');
const { analyzeVibeWithLangChain, analyzeSentiment, categorizeContent } = require('../../ai/langchainClient');

/**
 * Enhanced Instagram data retrieval with AI analysis
 * @param {string} hashtag - Instagram hashtag to scrape
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} Enhanced Instagram data with AI insights
 */
async function getEnhancedInstagramData(hashtag, options = {}) {
  try {
    console.log(`Starting enhanced Instagram analysis for hashtag: ${hashtag}`);
    
    // Step 1: Scrape Instagram data
    const rawData = await scrapeInstagram(hashtag);
    rawData.platform = 'instagram';
    
    // Step 2: Run AI analysis workflow if requested
    if (options.includeAIAnalysis !== false) {
      console.log('Running AI analysis workflow...');
      const aiAnalysis = await executeContentAnalysis(rawData);
      
      return {
        ...rawData,
        aiAnalysis,
        enhancedAt: new Date().toISOString(),
      };
    }
    
    return rawData;
  } catch (error) {
    console.error('Enhanced Instagram analysis failed:', error);
    throw new Error(`Enhanced Instagram analysis failed: ${error.message}`);
  }
}

/**
 * Enhanced TikTok data retrieval with AI analysis
 * @param {string} hashtag - TikTok hashtag to scrape
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} Enhanced TikTok data with AI insights
 */
async function getEnhancedTikTokData(hashtag, options = {}) {
  try {
    console.log(`Starting enhanced TikTok analysis for hashtag: ${hashtag}`);
    
    // Step 1: Scrape TikTok data
    const rawData = await scrapeTikTok(hashtag, options.limit || 50);
    rawData.platform = 'tiktok';
    
    // Step 2: Run AI analysis workflow if requested
    if (options.includeAIAnalysis !== false) {
      console.log('Running AI analysis workflow...');
      const aiAnalysis = await executeContentAnalysis(rawData);
      
      return {
        ...rawData,
        aiAnalysis,
        enhancedAt: new Date().toISOString(),
      };
    }
    
    return rawData;
  } catch (error) {
    console.error('Enhanced TikTok analysis failed:', error);
    throw new Error(`Enhanced TikTok analysis failed: ${error.message}`);
  }
}

/**
 * Enhanced TikTok user analysis
 * @param {string} username - TikTok username to analyze
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} Enhanced TikTok user data with AI insights
 */
async function getEnhancedTikTokUserData(username, options = {}) {
  try {
    console.log(`Starting enhanced TikTok user analysis for: ${username}`);
    
    // Step 1: Scrape TikTok user data
    const rawData = await scrapeTikTokUser(username);
    rawData.platform = 'tiktok';
    rawData.analysisType = 'user_profile';
    
    // Step 2: Run AI analysis workflow if requested
    if (options.includeAIAnalysis !== false) {
      console.log('Running AI analysis workflow...');
      const aiAnalysis = await executeContentAnalysis(rawData);
      
      return {
        ...rawData,
        aiAnalysis,
        enhancedAt: new Date().toISOString(),
      };
    }
    
    return rawData;
  } catch (error) {
    console.error('Enhanced TikTok user analysis failed:', error);
    throw new Error(`Enhanced TikTok user analysis failed: ${error.message}`);
  }
}

/**
 * Cross-platform content analysis
 * @param {Array} platforms - Array of platform data objects
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} Cross-platform analysis results
 */
async function performCrossPlatformAnalysis(platforms, options = {}) {
  try {
    console.log('Starting cross-platform content analysis...');
    
    // Combine data from multiple platforms
    const combinedData = {
      platforms: platforms.map(p => p.platform),
      totalPosts: platforms.reduce((sum, p) => sum + (p.count || 0), 0),
      combinedContent: {
        data: platforms.flatMap(p => p.data || []),
        scrapedAt: new Date().toISOString(),
      },
      platform: 'cross-platform',
    };
    
    // Run comprehensive AI analysis
    const aiAnalysis = await executeContentAnalysis(combinedData.combinedContent);
    
    // Generate cross-platform insights
    const crossPlatformInsights = await generateCrossPlatformInsights(platforms, aiAnalysis);
    
    return {
      summary: {
        platformsAnalyzed: platforms.length,
        totalContent: combinedData.totalPosts,
        analysisType: 'cross-platform',
        analyzedAt: new Date().toISOString(),
      },
      platformData: platforms,
      aiAnalysis,
      crossPlatformInsights,
    };
  } catch (error) {
    console.error('Cross-platform analysis failed:', error);
    throw new Error(`Cross-platform analysis failed: ${error.message}`);
  }
}

/**
 * Generate cross-platform insights
 * @param {Array} platforms - Platform data
 * @param {Object} aiAnalysis - AI analysis results
 * @returns {Promise<Object>} Cross-platform insights
 */
async function generateCrossPlatformInsights(platforms, aiAnalysis) {
  try {
    const insights = {
      platformComparison: {},
      contentThemes: aiAnalysis.categorization || {},
      sentimentTrends: aiAnalysis.sentiment || {},
      recommendations: {
        contentStrategy: [],
        platformOptimization: [],
        engagementTactics: [],
      },
    };
    
    // Compare platforms
    platforms.forEach(platform => {
      insights.platformComparison[platform.platform] = {
        contentVolume: platform.count || 0,
        avgEngagement: calculateAverageEngagement(platform.data || []),
        topHashtags: extractTopHashtags(platform.data || []),
        contentTypes: analyzeContentTypes(platform.data || []),
      };
    });
    
    // Generate strategic recommendations
    insights.recommendations.contentStrategy = generateContentStrategyRecommendations(insights);
    insights.recommendations.platformOptimization = generatePlatformOptimizationRecommendations(insights);
    insights.recommendations.engagementTactics = generateEngagementRecommendations(insights);
    
    return insights;
  } catch (error) {
    console.error('Cross-platform insights generation failed:', error);
    return { error: 'Failed to generate cross-platform insights' };
  }
}

/**
 * Helper function to calculate average engagement
 */
function calculateAverageEngagement(posts) {
  if (!posts.length) return 0;
  
  const totalEngagement = posts.reduce((sum, post) => {
    const likes = post.likesCount || post.diggCount || 0;
    const comments = post.commentsCount || post.commentCount || 0;
    const shares = post.shareCount || 0;
    return sum + likes + comments + shares;
  }, 0);
  
  return Math.round(totalEngagement / posts.length);
}

/**
 * Helper function to extract top hashtags
 */
function extractTopHashtags(posts, limit = 10) {
  const hashtagCounts = {};
  
  posts.forEach(post => {
    const hashtags = post.hashtags || [];
    hashtags.forEach(tag => {
      hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
    });
  });
  
  return Object.entries(hashtagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));
}

/**
 * Helper function to analyze content types
 */
function analyzeContentTypes(posts) {
  const types = {};
  
  posts.forEach(post => {
    const type = post.type || (post.videoUrl ? 'video' : 'image');
    types[type] = (types[type] || 0) + 1;
  });
  
  return types;
}

/**
 * Generate content strategy recommendations
 */
function generateContentStrategyRecommendations(insights) {
  const recommendations = [];
  
  // Analyze sentiment trends
  if (insights.sentimentTrends.overallSentiment > 0.5) {
    recommendations.push('Maintain positive content tone - audience responds well to uplifting content');
  } else if (insights.sentimentTrends.overallSentiment < -0.2) {
    recommendations.push('Consider more positive, engaging content to improve audience sentiment');
  }
  
  // Analyze platform performance
  const platforms = Object.keys(insights.platformComparison);
  if (platforms.length > 1) {
    const bestPlatform = platforms.reduce((best, current) => 
      insights.platformComparison[current].avgEngagement > insights.platformComparison[best].avgEngagement ? current : best
    );
    recommendations.push(`Focus more resources on ${bestPlatform} - showing highest engagement rates`);
  }
  
  return recommendations;
}

/**
 * Generate platform optimization recommendations
 */
function generatePlatformOptimizationRecommendations(insights) {
  const recommendations = [];
  
  Object.entries(insights.platformComparison).forEach(([platform, data]) => {
    if (data.contentVolume < 10) {
      recommendations.push(`Increase content frequency on ${platform} for better visibility`);
    }
    
    if (data.topHashtags.length > 0) {
      const topTag = data.topHashtags[0].tag;
      recommendations.push(`Leverage #${topTag} more frequently on ${platform} - showing strong performance`);
    }
  });
  
  return recommendations;
}

/**
 * Generate engagement recommendations
 */
function generateEngagementRecommendations(insights) {
  const recommendations = [
    'Post consistently during peak audience hours',
    'Engage with comments within the first hour of posting',
    'Use trending hashtags relevant to your content',
    'Create content that encourages user interaction',
  ];
  
  // Add specific recommendations based on content analysis
  if (insights.contentThemes.primaryCategory) {
    recommendations.push(`Focus on ${insights.contentThemes.primaryCategory} content - aligns with your audience interests`);
  }
  
  return recommendations;
}

module.exports = {
  getEnhancedInstagramData,
  getEnhancedTikTokData,
  getEnhancedTikTokUserData,
  performCrossPlatformAnalysis,
};