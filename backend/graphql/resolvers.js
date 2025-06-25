const userController = require('../src/controllers/userController');
const vibeController = require('../src/controllers/vibeController');
const historyController = require('../src/controllers/historyController');
const scrapeInstagram = require('../src/agents/instagramAgent');
const { scrapeTikTok, scrapeTikTokUser } = require('../src/agents/tiktokAgent');
const { getVibeSummary } = require('../src/utils/gptClient');
const {
  executeContentAnalysis,
  executeVideoAnalysis,
  executeDocumentProcessing,
  executeFastSentimentAnalysis,
  executeBatchAnalysis,
  getAnalysisStatus
} = require('../ai/workflows');

const resolvers = {
  Query: {
    // User queries
    me: async (parent, args, context) => {
      // Extract user from context (JWT token validation would be handled in middleware)
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return context.user;
    },

    // Content analysis queries
    getVibeSummary: async (parent, { input }) => {
      try {
        const rawData = JSON.parse(input.rawData);
        const summary = await getVibeSummary(rawData);
        return summary;
      } catch (error) {
        throw new Error(`Failed to generate vibe summary: ${error.message}`);
      }
    },

    getAnalysisStatus: async (parent, { workflowId }) => {
      try {
        const status = await getAnalysisStatus(workflowId);
        return status;
      } catch (error) {
        throw new Error(`Failed to get analysis status: ${error.message}`);
      }
    },

    // Social media queries
    scrapeInstagram: async (parent, { tag }) => {
      try {
        const data = await scrapeInstagram(tag);
        return data;
      } catch (error) {
        throw new Error(`Instagram scraping failed: ${error.message}`);
      }
    },

    scrapeTikTok: async (parent, { hashtag, limit }) => {
      try {
        const data = await scrapeTikTok(hashtag, limit);
        return data;
      } catch (error) {
        throw new Error(`TikTok scraping failed: ${error.message}`);
      }
    },

    scrapeTikTokUser: async (parent, { username }) => {
      try {
        const data = await scrapeTikTokUser(username);
        return data;
      } catch (error) {
        throw new Error(`TikTok user scraping failed: ${error.message}`);
      }
    },

    // History queries
    getUserHistory: async (parent, { userId }) => {
      try {
        // Create a mock request object for the existing controller
        const req = { params: { userId } };
        const res = {
          json: (data) => data,
          status: (code) => ({ json: (data) => ({ status: code, data }) })
        };
        
        const result = await historyController.getUserHistory(req, res);
        return result;
      } catch (error) {
        throw new Error(`Failed to get user history: ${error.message}`);
      }
    },
  },

  Mutation: {
    // Authentication mutations
    login: async (parent, { input }) => {
      try {
        // Create a mock request object for the existing controller
        const req = { body: input };
        let result;
        const res = {
          json: (data) => { result = data; },
          status: (code) => ({ 
            json: (data) => { 
              if (code !== 200) throw new Error(data.message || 'Login failed');
              result = data;
            }
          })
        };
        
        await userController.login(req, res);
        return result;
      } catch (error) {
        throw new Error(`Login failed: ${error.message}`);
      }
    },

    register: async (parent, { input }) => {
      try {
        // Create a mock request object for the existing controller
        const req = { body: input };
        let result;
        const res = {
          json: (data) => { result = data; },
          status: (code) => ({ 
            json: (data) => { 
              if (code !== 201) throw new Error(data.message || 'Registration failed');
              result = data;
            }
          })
        };
        
        await userController.register(req, res);
        return result;
      } catch (error) {
        throw new Error(`Registration failed: ${error.message}`);
      }
    },

    // Legacy content analysis mutations
    analyzeContent: async (parent, { input }) => {
      try {
        // Create a mock request object for the existing controller
        const req = { body: input };
        let result;
        const res = {
          json: (data) => { result = data; },
          status: (code) => ({ 
            json: (data) => { 
              if (code !== 200) throw new Error(data.message || 'Analysis failed');
              result = data;
            }
          })
        };
        
        await vibeController.analyzeVibe(req, res);
        return result;
      } catch (error) {
        throw new Error(`Content analysis failed: ${error.message}`);
      }
    },

    // Comprehensive AI analysis mutations
    analyzeContentComprehensive: async (parent, { input }) => {
      try {
        const rawContent = JSON.parse(input.rawContent);
        const options = input.options || {};
        
        const result = await executeContentAnalysis(rawContent, options);
        return result;
      } catch (error) {
        throw new Error(`Comprehensive content analysis failed: ${error.message}`);
      }
    },

    analyzeVideo: async (parent, { input }) => {
      try {
        const videoContent = JSON.parse(input.videoContent);
        const options = input.options || {};
        
        const result = await executeVideoAnalysis(videoContent, options);
        return result;
      } catch (error) {
        throw new Error(`Video analysis failed: ${error.message}`);
      }
    },

    processDocument: async (parent, { input }) => {
      try {
        const documentContent = JSON.parse(input.documentContent);
        const options = input.options || {};
        
        const result = await executeDocumentProcessing(documentContent, options);
        return result;
      } catch (error) {
        throw new Error(`Document processing failed: ${error.message}`);
      }
    },

    analyzeSentiment: async (parent, { input }) => {
      try {
        const content = JSON.parse(input.content);
        const options = input.options || {};
        
        const result = await executeFastSentimentAnalysis(content, options);
        return result;
      } catch (error) {
        throw new Error(`Sentiment analysis failed: ${error.message}`);
      }
    },

    analyzeBatch: async (parent, { input }) => {
      try {
        const contentItems = input.contentItems.map(item => JSON.parse(item));
        const options = input.options || {};
        
        const results = await executeBatchAnalysis(contentItems, options);
        return results;
      } catch (error) {
        throw new Error(`Batch analysis failed: ${error.message}`);
      }
    },

    // History mutations
    saveToHistory: async (parent, { userId, query, result }) => {
      try {
        // Create a mock request object for the existing controller
        const req = { body: { userId, query, result } };
        let historyResult;
        const res = {
          json: (data) => { historyResult = data; },
          status: (code) => ({ 
            json: (data) => { 
              if (code !== 201) throw new Error(data.message || 'Failed to save history');
              historyResult = data;
            }
          })
        };
        
        await historyController.saveHistory(req, res);
        return historyResult;
      } catch (error) {
        throw new Error(`Failed to save to history: ${error.message}`);
      }
    },
  },

  Subscription: {
    // Future real-time features
    contentAnalysisUpdated: {
      // This would be implemented with a pub/sub system like Redis
      subscribe: () => {
        // Placeholder for subscription logic
        throw new Error('Subscriptions not yet implemented');
      },
    },
  },
};

module.exports = resolvers;