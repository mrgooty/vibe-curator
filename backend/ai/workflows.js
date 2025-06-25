const { StateGraph, START, END } = require('@langchain/langgraph');
const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { 
  analyzeVibeWithLangChain, 
  analyzeSentiment, 
  categorizeContent,
  analyzeVideoContent,
  analyzeMultiModalContent,
  processDocument
} = require('./langchainClient');
require('dotenv').config();

// Initialize OpenAI model
const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4',
  temperature: 0.3,
});

/**
 * Enhanced Content Analysis Workflow State
 */
class ContentAnalysisState {
  constructor() {
    this.rawContent = null;
    this.preprocessedContent = null;
    this.sentimentAnalysis = null;
    this.contentCategories = null;
    this.vibeAnalysis = null;
    this.videoAnalysis = null;
    this.documentAnalysis = null;
    this.multiModalAnalysis = null;
    this.trendAnalysis = null;
    this.finalReport = null;
    this.errors = [];
    this.contentType = null; // 'video', 'document', 'mixed'
    this.platform = null; // 'instagram', 'tiktok', 'blog', etc.
  }
}

/**
 * Preprocess content for analysis
 */
async function preprocessContent(state) {
  try {
    console.log('Preprocessing content...');
    
    const { rawContent } = state;
    
    // Clean and structure the content
    const preprocessed = {
      posts: rawContent.data || [],
      metadata: {
        platform: rawContent.platform || 'unknown',
        totalCount: rawContent.count || 0,
        scrapedAt: rawContent.scrapedAt || new Date().toISOString(),
      },
      textContent: [],
      mediaUrls: [],
      hashtags: new Set(),
      mentions: new Set(),
    };

    // Extract text content and metadata
    if (preprocessed.posts.length > 0) {
      preprocessed.posts.forEach(post => {
        // Extract text content
        if (post.caption) preprocessed.textContent.push(post.caption);
        if (post.text) preprocessed.textContent.push(post.text);
        
        // Extract media URLs
        if (post.displayUrl) preprocessed.mediaUrls.push(post.displayUrl);
        if (post.videoUrl) preprocessed.mediaUrls.push(post.videoUrl);
        if (post.covers?.default) preprocessed.mediaUrls.push(post.covers.default);
        
        // Extract hashtags
        if (post.hashtags) {
          post.hashtags.forEach(tag => preprocessed.hashtags.add(tag));
        }
        
        // Extract mentions (basic pattern matching)
        const mentionPattern = /@(\w+)/g;
        const textToSearch = (post.caption || post.text || '');
        let match;
        while ((match = mentionPattern.exec(textToSearch)) !== null) {
          preprocessed.mentions.add(match[1]);
        }
      });
    }

    // Convert Sets to Arrays for JSON serialization
    preprocessed.hashtags = Array.from(preprocessed.hashtags);
    preprocessed.mentions = Array.from(preprocessed.mentions);

    return {
      ...state,
      preprocessedContent: preprocessed,
    };
  } catch (error) {
    console.error('Content preprocessing failed:', error);
    return {
      ...state,
      errors: [...state.errors, `Preprocessing failed: ${error.message}`],
    };
  }
}

/**
 * Perform sentiment analysis on content
 */
async function performSentimentAnalysis(state) {
  try {
    console.log('Performing sentiment analysis...');
    
    const { preprocessedContent } = state;
    
    if (!preprocessedContent || !preprocessedContent.posts.length) {
      return {
        ...state,
        sentimentAnalysis: { error: 'No content to analyze' },
      };
    }

    const sentimentResult = await analyzeSentiment(preprocessedContent.posts);
    
    return {
      ...state,
      sentimentAnalysis: sentimentResult,
    };
  } catch (error) {
    console.error('Sentiment analysis failed:', error);
    return {
      ...state,
      errors: [...state.errors, `Sentiment analysis failed: ${error.message}`],
    };
  }
}

/**
 * Categorize and tag content
 */
async function performContentCategorization(state) {
  try {
    console.log('Categorizing content...');
    
    const { preprocessedContent } = state;
    
    if (!preprocessedContent) {
      return {
        ...state,
        contentCategories: { error: 'No preprocessed content available' },
      };
    }

    const categorizationResult = await categorizeContent(preprocessedContent);
    
    return {
      ...state,
      contentCategories: categorizationResult,
    };
  } catch (error) {
    console.error('Content categorization failed:', error);
    return {
      ...state,
      errors: [...state.errors, `Content categorization failed: ${error.message}`],
    };
  }
}

/**
 * Generate vibe analysis
 */
async function generateVibeAnalysis(state) {
  try {
    console.log('Generating vibe analysis...');
    
    const { preprocessedContent, sentimentAnalysis, contentCategories } = state;
    
    // Combine all analysis data
    const analysisData = {
      content: preprocessedContent,
      sentiment: sentimentAnalysis,
      categories: contentCategories,
    };

    const vibeResult = await analyzeVibeWithLangChain(analysisData);
    
    return {
      ...state,
      vibeAnalysis: vibeResult,
    };
  } catch (error) {
    console.error('Vibe analysis failed:', error);
    return {
      ...state,
      errors: [...state.errors, `Vibe analysis failed: ${error.message}`],
    };
  }
}

/**
 * Perform specialized video content analysis
 */
async function performVideoAnalysis(state) {
  try {
    console.log('Performing video analysis...');
    
    const { preprocessedContent, contentType } = state;
    
    if (contentType !== 'video' && contentType !== 'mixed') {
      return {
        ...state,
        videoAnalysis: { skipped: 'Not video content' },
      };
    }

    if (!preprocessedContent || !preprocessedContent.posts.length) {
      return {
        ...state,
        videoAnalysis: { error: 'No video content to analyze' },
      };
    }

    // Filter and prepare video-specific data
    const videoData = {
      posts: preprocessedContent.posts.filter(post => 
        post.videoUrl || post.covers || post.playCount || post.duration
      ),
      metadata: preprocessedContent.metadata,
      hashtags: preprocessedContent.hashtags,
      engagement: preprocessedContent.posts.map(post => ({
        likes: post.likesCount || post.diggCount || 0,
        comments: post.commentsCount || 0,
        shares: post.shareCount || 0,
        views: post.playCount || post.viewCount || 0,
        duration: post.duration || 0,
      })),
    };

    const videoAnalysisResult = await analyzeVideoContent(videoData);
    
    return {
      ...state,
      videoAnalysis: videoAnalysisResult,
    };
  } catch (error) {
    console.error('Video analysis failed:', error);
    return {
      ...state,
      errors: [...state.errors, `Video analysis failed: ${error.message}`],
    };
  }
}

/**
 * Perform document processing and analysis
 */
async function performDocumentAnalysis(state) {
  try {
    console.log('Performing document analysis...');
    
    const { preprocessedContent, contentType } = state;
    
    if (contentType !== 'document' && contentType !== 'mixed') {
      return {
        ...state,
        documentAnalysis: { skipped: 'Not document content' },
      };
    }

    if (!preprocessedContent || !preprocessedContent.textContent.length) {
      return {
        ...state,
        documentAnalysis: { error: 'No document content to analyze' },
      };
    }

    // Prepare document data
    const documentData = {
      content: preprocessedContent.textContent.join('\n\n'),
      metadata: preprocessedContent.metadata,
      hashtags: preprocessedContent.hashtags,
      mentions: preprocessedContent.mentions,
      structure: {
        totalParagraphs: preprocessedContent.textContent.length,
        averageLength: preprocessedContent.textContent.reduce((sum, text) => sum + text.length, 0) / preprocessedContent.textContent.length,
      },
    };

    const documentAnalysisResult = await processDocument(documentData);
    
    return {
      ...state,
      documentAnalysis: documentAnalysisResult,
    };
  } catch (error) {
    console.error('Document analysis failed:', error);
    return {
      ...state,
      errors: [...state.errors, `Document analysis failed: ${error.message}`],
    };
  }
}

/**
 * Perform multi-modal content analysis
 */
async function performMultiModalAnalysis(state) {
  try {
    console.log('Performing multi-modal analysis...');
    
    const { preprocessedContent, sentimentAnalysis, videoAnalysis, documentAnalysis } = state;
    
    if (!preprocessedContent) {
      return {
        ...state,
        multiModalAnalysis: { error: 'No content available for multi-modal analysis' },
      };
    }

    // Combine all available analysis data
    const multiModalData = {
      textContent: preprocessedContent.textContent,
      mediaUrls: preprocessedContent.mediaUrls,
      metadata: preprocessedContent.metadata,
      sentiment: sentimentAnalysis,
      videoInsights: videoAnalysis,
      documentInsights: documentAnalysis,
      crossModalElements: {
        hasText: preprocessedContent.textContent.length > 0,
        hasMedia: preprocessedContent.mediaUrls.length > 0,
        hasVideo: videoAnalysis && !videoAnalysis.skipped,
        hasDocument: documentAnalysis && !documentAnalysis.skipped,
      },
    };

    const multiModalResult = await analyzeMultiModalContent(multiModalData);
    
    return {
      ...state,
      multiModalAnalysis: multiModalResult,
    };
  } catch (error) {
    console.error('Multi-modal analysis failed:', error);
    return {
      ...state,
      errors: [...state.errors, `Multi-modal analysis failed: ${error.message}`],
    };
  }
}

/**
 * Perform trend analysis and viral potential assessment
 */
async function performTrendAnalysis(state) {
  try {
    console.log('Performing trend analysis...');
    
    const { preprocessedContent, sentimentAnalysis, videoAnalysis, contentCategories } = state;
    
    const trendPrompt = PromptTemplate.fromTemplate(`
    Analyze trends and viral potential based on comprehensive content analysis:

    Content Data: {contentData}
    Sentiment Analysis: {sentimentData}
    Video Analysis: {videoData}
    Categories: {categoryData}

    Provide trend analysis including:
    1. Current trend alignment
    2. Viral potential prediction
    3. Engagement trend forecasting
    4. Content lifecycle analysis
    5. Competitive positioning
    6. Future trend predictions

    Format as JSON:
    {{
      "trendAlignment": {{
        "current_trends": ["trend1", "trend2"],
        "alignment_score": number,
        "trend_categories": ["category1", "category2"]
      }},
      "viralPotential": {{
        "overall_score": number,
        "growth_prediction": "exponential/linear/declining",
        "peak_timing": "hours/days/weeks",
        "viral_factors": ["factor1", "factor2"]
      }},
      "engagementForecast": {{
        "predicted_engagement": number,
        "engagement_trajectory": "increasing/stable/decreasing",
        "optimal_posting_schedule": ["time1", "time2"]
      }},
      "competitiveAnalysis": {{
        "market_position": "leader/follower/niche",
        "differentiation_factors": ["factor1", "factor2"],
        "competitive_advantages": ["advantage1", "advantage2"]
      }},
      "recommendations": {{
        "trend_optimization": ["opt1", "opt2"],
        "viral_enhancement": ["enhancement1", "enhancement2"],
        "timing_strategy": ["strategy1", "strategy2"]
      }}
    }}
    `);

    const trendChain = new LLMChain({
      llm: model,
      prompt: trendPrompt,
    });

    const result = await trendChain.call({
      contentData: JSON.stringify(preprocessedContent, null, 2),
      sentimentData: JSON.stringify(sentimentAnalysis, null, 2),
      videoData: JSON.stringify(videoAnalysis, null, 2),
      categoryData: JSON.stringify(contentCategories, null, 2),
    });

    const trendAnalysisResult = JSON.parse(result.text);
    
    return {
      ...state,
      trendAnalysis: trendAnalysisResult,
    };
  } catch (error) {
    console.error('Trend analysis failed:', error);
    return {
      ...state,
      errors: [...state.errors, `Trend analysis failed: ${error.message}`],
    };
  }
}

/**
 * Generate comprehensive final report with all analysis results
 */
async function generateFinalReport(state) {
  try {
    console.log('Generating comprehensive final report...');
    
    const { 
      preprocessedContent, 
      sentimentAnalysis, 
      contentCategories, 
      vibeAnalysis,
      videoAnalysis,
      documentAnalysis,
      multiModalAnalysis,
      trendAnalysis,
      errors,
      contentType,
      platform
    } = state;
    
    const report = {
      summary: {
        platform: platform || preprocessedContent?.metadata?.platform,
        contentType: contentType,
        totalPosts: preprocessedContent?.metadata?.totalCount,
        analyzedAt: new Date().toISOString(),
        hasErrors: errors.length > 0,
        analysisCompleteness: {
          sentiment: !!sentimentAnalysis && !sentimentAnalysis.error,
          categorization: !!contentCategories && !contentCategories.error,
          video: !!videoAnalysis && !videoAnalysis.error && !videoAnalysis.skipped,
          document: !!documentAnalysis && !documentAnalysis.error && !documentAnalysis.skipped,
          multiModal: !!multiModalAnalysis && !multiModalAnalysis.error,
          trends: !!trendAnalysis && !trendAnalysis.error,
        },
      },
      contentOverview: {
        totalHashtags: preprocessedContent?.hashtags?.length || 0,
        totalMentions: preprocessedContent?.mentions?.length || 0,
        mediaCount: preprocessedContent?.mediaUrls?.length || 0,
        textPosts: preprocessedContent?.textContent?.length || 0,
        contentDistribution: {
          hasVideo: videoAnalysis && !videoAnalysis.skipped,
          hasDocument: documentAnalysis && !documentAnalysis.skipped,
          hasMultiModal: multiModalAnalysis && !multiModalAnalysis.error,
        },
      },
      analysis: {
        sentiment: sentimentAnalysis,
        categorization: contentCategories,
        video: videoAnalysis,
        document: documentAnalysis,
        multiModal: multiModalAnalysis,
        trends: trendAnalysis,
        vibe: vibeAnalysis,
      },
      insights: {
        keyFindings: [
          ...(sentimentAnalysis?.recommendations?.content_strategy || []),
          ...(videoAnalysis?.recommendations?.content_optimization || []),
          ...(documentAnalysis?.recommendations?.content_improvements || []),
          ...(trendAnalysis?.recommendations?.trend_optimization || []),
        ],
        actionableRecommendations: {
          immediate: [
            ...(sentimentAnalysis?.recommendations?.engagement_tactics || []),
            ...(videoAnalysis?.recommendations?.engagement_tactics || []),
          ],
          shortTerm: [
            ...(contentCategories?.reasoning ? [contentCategories.reasoning] : []),
            ...(trendAnalysis?.recommendations?.timing_strategy || []),
          ],
          longTerm: [
            ...(multiModalAnalysis?.optimizationRecommendations?.cross_modal_enhancement || []),
            ...(trendAnalysis?.recommendations?.viral_enhancement || []),
          ],
        },
        performanceMetrics: {
          overallScore: calculateOverallScore(state),
          viralPotential: trendAnalysis?.viralPotential?.overall_score || 0,
          engagementPrediction: multiModalAnalysis?.engagementPrediction?.multi_modal_score || 0,
          contentQuality: multiModalAnalysis?.contentQuality?.production_quality || 0,
        },
      },
      metadata: {
        processingTime: new Date().toISOString(),
        analysisVersion: '2.0',
        errors: errors,
      },
    };
    
    return {
      ...state,
      finalReport: report,
    };
  } catch (error) {
    console.error('Final report generation failed:', error);
    return {
      ...state,
      errors: [...state.errors, `Final report generation failed: ${error.message}`],
      finalReport: { error: 'Failed to generate comprehensive final report' },
    };
  }
}

/**
 * Calculate overall performance score based on all analysis results
 */
function calculateOverallScore(state) {
  try {
    const { sentimentAnalysis, videoAnalysis, documentAnalysis, multiModalAnalysis, trendAnalysis } = state;
    
    let totalScore = 0;
    let componentCount = 0;
    
    if (sentimentAnalysis && sentimentAnalysis.overallSentiment !== undefined) {
      totalScore += (sentimentAnalysis.overallSentiment + 1) * 50; // Convert -1 to 1 range to 0-100
      componentCount++;
    }
    
    if (videoAnalysis && videoAnalysis.viralPotential && videoAnalysis.viralPotential.score) {
      totalScore += videoAnalysis.viralPotential.score;
      componentCount++;
    }
    
    if (documentAnalysis && documentAnalysis.relevanceScoring && documentAnalysis.relevanceScoring.curation_score) {
      totalScore += documentAnalysis.relevanceScoring.curation_score;
      componentCount++;
    }
    
    if (multiModalAnalysis && multiModalAnalysis.contentQuality && multiModalAnalysis.contentQuality.production_quality) {
      totalScore += multiModalAnalysis.contentQuality.production_quality * 10; // Assuming 1-10 scale
      componentCount++;
    }
    
    if (trendAnalysis && trendAnalysis.viralPotential && trendAnalysis.viralPotential.overall_score) {
      totalScore += trendAnalysis.viralPotential.overall_score;
      componentCount++;
    }
    
    return componentCount > 0 ? Math.round(totalScore / componentCount) : 0;
  } catch (error) {
    console.error('Score calculation failed:', error);
    return 0;
  }
}

/**
 * Create comprehensive content analysis workflow using LangGraph
 */
function createContentAnalysisWorkflow() {
  const workflow = new StateGraph(ContentAnalysisState)
    .addNode('preprocess', preprocessContent)
    .addNode('sentiment', performSentimentAnalysis)
    .addNode('categorize', performContentCategorization)
    .addNode('video', performVideoAnalysis)
    .addNode('document', performDocumentAnalysis)
    .addNode('multimodal', performMultiModalAnalysis)
    .addNode('trends', performTrendAnalysis)
    .addNode('vibe', generateVibeAnalysis)
    .addNode('report', generateFinalReport)
    .addEdge('preprocess', 'sentiment')
    .addEdge('sentiment', 'categorize')
    .addEdge('categorize', 'video')
    .addEdge('video', 'document')
    .addEdge('document', 'multimodal')
    .addEdge('multimodal', 'trends')
    .addEdge('trends', 'vibe')
    .addEdge('vibe', 'report')
    .addEdge('report', END)
    .setEntryPoint('preprocess');

  return workflow.compile();
}

/**
 * Create specialized video analysis workflow
 */
function createVideoAnalysisWorkflow() {
  const workflow = new StateGraph(ContentAnalysisState)
    .addNode('preprocess', preprocessContent)
    .addNode('sentiment', performSentimentAnalysis)
    .addNode('categorize', performContentCategorization)
    .addNode('video', performVideoAnalysis)
    .addNode('multimodal', performMultiModalAnalysis)
    .addNode('trends', performTrendAnalysis)
    .addNode('report', generateFinalReport)
    .addEdge('preprocess', 'sentiment')
    .addEdge('sentiment', 'categorize')
    .addEdge('categorize', 'video')
    .addEdge('video', 'multimodal')
    .addEdge('multimodal', 'trends')
    .addEdge('trends', 'report')
    .addEdge('report', END)
    .setEntryPoint('preprocess');

  return workflow.compile();
}

/**
 * Create specialized document processing workflow
 */
function createDocumentProcessingWorkflow() {
  const workflow = new StateGraph(ContentAnalysisState)
    .addNode('preprocess', preprocessContent)
    .addNode('sentiment', performSentimentAnalysis)
    .addNode('categorize', performContentCategorization)
    .addNode('document', performDocumentAnalysis)
    .addNode('trends', performTrendAnalysis)
    .addNode('report', generateFinalReport)
    .addEdge('preprocess', 'sentiment')
    .addEdge('sentiment', 'categorize')
    .addEdge('categorize', 'document')
    .addEdge('document', 'trends')
    .addEdge('trends', 'report')
    .addEdge('report', END)
    .setEntryPoint('preprocess');

  return workflow.compile();
}

/**
 * Create fast sentiment analysis workflow for quick insights
 */
function createFastSentimentWorkflow() {
  const workflow = new StateGraph(ContentAnalysisState)
    .addNode('preprocess', preprocessContent)
    .addNode('sentiment', performSentimentAnalysis)
    .addNode('report', generateFinalReport)
    .addEdge('preprocess', 'sentiment')
    .addEdge('sentiment', 'report')
    .addEdge('report', END)
    .setEntryPoint('preprocess');

  return workflow.compile();
}

/**
 * Execute comprehensive content analysis workflow
 * @param {Object} rawContent - Raw content from Instagram/TikTok scraping
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} Complete analysis report
 */
async function executeContentAnalysis(rawContent, options = {}) {
  try {
    const workflow = createContentAnalysisWorkflow();
    const initialState = new ContentAnalysisState();
    initialState.rawContent = rawContent;
    initialState.contentType = options.contentType || detectContentType(rawContent);
    initialState.platform = options.platform || rawContent.platform || 'unknown';

    console.log(`Starting comprehensive content analysis workflow for ${initialState.contentType} content...`);
    const result = await workflow.invoke(initialState);
    
    console.log('Comprehensive content analysis workflow completed');
    return result.finalReport;
  } catch (error) {
    console.error('Content analysis workflow failed:', error);
    throw new Error(`Workflow execution failed: ${error.message}`);
  }
}

/**
 * Execute specialized video analysis workflow
 * @param {Object} videoContent - Video content data
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} Video analysis report
 */
async function executeVideoAnalysis(videoContent, options = {}) {
  try {
    const workflow = createVideoAnalysisWorkflow();
    const initialState = new ContentAnalysisState();
    initialState.rawContent = videoContent;
    initialState.contentType = 'video';
    initialState.platform = options.platform || videoContent.platform || 'unknown';

    console.log('Starting specialized video analysis workflow...');
    const result = await workflow.invoke(initialState);
    
    console.log('Video analysis workflow completed');
    return result.finalReport;
  } catch (error) {
    console.error('Video analysis workflow failed:', error);
    throw new Error(`Video workflow execution failed: ${error.message}`);
  }
}

/**
 * Execute document processing workflow
 * @param {Object} documentContent - Document content data
 * @param {Object} options - Processing options
 * @returns {Promise<Object>} Document analysis report
 */
async function executeDocumentProcessing(documentContent, options = {}) {
  try {
    const workflow = createDocumentProcessingWorkflow();
    const initialState = new ContentAnalysisState();
    initialState.rawContent = documentContent;
    initialState.contentType = 'document';
    initialState.platform = options.platform || 'blog';

    console.log('Starting document processing workflow...');
    const result = await workflow.invoke(initialState);
    
    console.log('Document processing workflow completed');
    return result.finalReport;
  } catch (error) {
    console.error('Document processing workflow failed:', error);
    throw new Error(`Document workflow execution failed: ${error.message}`);
  }
}

/**
 * Execute fast sentiment analysis workflow
 * @param {Object} content - Content for sentiment analysis
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} Sentiment analysis report
 */
async function executeFastSentimentAnalysis(content, options = {}) {
  try {
    const workflow = createFastSentimentWorkflow();
    const initialState = new ContentAnalysisState();
    initialState.rawContent = content;
    initialState.contentType = options.contentType || 'mixed';
    initialState.platform = options.platform || 'unknown';

    console.log('Starting fast sentiment analysis workflow...');
    const result = await workflow.invoke(initialState);
    
    console.log('Fast sentiment analysis workflow completed');
    return result.finalReport;
  } catch (error) {
    console.error('Fast sentiment analysis workflow failed:', error);
    throw new Error(`Fast sentiment workflow execution failed: ${error.message}`);
  }
}

/**
 * Execute batch analysis for multiple content items
 * @param {Array} contentItems - Array of content items to analyze
 * @param {Object} options - Batch processing options
 * @returns {Promise<Array>} Array of analysis reports
 */
async function executeBatchAnalysis(contentItems, options = {}) {
  try {
    console.log(`Starting batch analysis for ${contentItems.length} items...`);
    
    const batchSize = options.batchSize || 5;
    const results = [];
    
    for (let i = 0; i < contentItems.length; i += batchSize) {
      const batch = contentItems.slice(i, i + batchSize);
      const batchPromises = batch.map(async (item, index) => {
        try {
          const contentType = detectContentType(item);
          let result;
          
          switch (contentType) {
            case 'video':
              result = await executeVideoAnalysis(item, options);
              break;
            case 'document':
              result = await executeDocumentProcessing(item, options);
              break;
            default:
              result = await executeContentAnalysis(item, { ...options, contentType });
          }
          
          return { index: i + index, result, success: true };
        } catch (error) {
          console.error(`Batch item ${i + index} failed:`, error);
          return { index: i + index, error: error.message, success: false };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Add delay between batches to avoid rate limiting
      if (i + batchSize < contentItems.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(`Batch analysis completed. ${results.filter(r => r.success).length}/${contentItems.length} successful`);
    return results;
  } catch (error) {
    console.error('Batch analysis failed:', error);
    throw new Error(`Batch analysis failed: ${error.message}`);
  }
}

/**
 * Detect content type based on content structure
 * @param {Object} content - Content to analyze
 * @returns {string} Detected content type
 */
function detectContentType(content) {
  try {
    if (!content || !content.data) return 'mixed';
    
    const posts = content.data;
    if (!Array.isArray(posts) || posts.length === 0) return 'mixed';
    
    let videoCount = 0;
    let documentCount = 0;
    
    posts.forEach(post => {
      if (post.videoUrl || post.covers || post.playCount || post.duration) {
        videoCount++;
      }
      if (post.caption && post.caption.length > 500) {
        documentCount++;
      }
    });
    
    const totalPosts = posts.length;
    const videoRatio = videoCount / totalPosts;
    const documentRatio = documentCount / totalPosts;
    
    if (videoRatio > 0.7) return 'video';
    if (documentRatio > 0.7) return 'document';
    return 'mixed';
  } catch (error) {
    console.error('Content type detection failed:', error);
    return 'mixed';
  }
}

/**
 * Get analysis status for long-running workflows
 * @param {string} workflowId - Workflow identifier
 * @returns {Promise<Object>} Status information
 */
async function getAnalysisStatus(workflowId) {
  // This would integrate with a workflow tracking system
  // For now, return a placeholder structure
  return {
    workflowId,
    status: 'completed',
    progress: 100,
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    results: null,
  };
}

module.exports = {
  executeContentAnalysis,
  executeVideoAnalysis,
  executeDocumentProcessing,
  executeFastSentimentAnalysis,
  executeBatchAnalysis,
  getAnalysisStatus,
  createContentAnalysisWorkflow,
  createVideoAnalysisWorkflow,
  createDocumentProcessingWorkflow,
  createFastSentimentWorkflow,
  detectContentType,
};