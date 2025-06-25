const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { LLMChain } = require('langchain/chains');
const { StructuredOutputParser } = require('@langchain/core/output_parsers');
const { z } = require('zod');
require('dotenv').config();

// Initialize OpenAI model with LangChain
const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4',
  temperature: 0.7,
});

// Define output schema for vibe analysis
const vibeSchema = z.object({
  title: z.string().describe('A catchy title for the vibe experience'),
  duration: z.string().describe('Estimated duration for the experience'),
  route: z.array(z.object({
    lat: z.number().describe('Latitude coordinate'),
    lon: z.number().describe('Longitude coordinate'),
    title: z.string().describe('Location title'),
  })).describe('Array of route points'),
  vibeTags: z.array(z.string()).describe('Array of vibe-related tags'),
  images: z.array(z.string()).describe('Array of relevant image URLs'),
  summary: z.string().describe('Detailed summary of the vibe experience'),
});

// Create structured output parser
const parser = StructuredOutputParser.fromZodSchema(vibeSchema);

// Create prompt template for vibe analysis
const vibePrompt = PromptTemplate.fromTemplate(`
You are a Vibe Curator AI specialized in analyzing social media content and travel data to create personalized experiences.

Based on the provided data, analyze the content and generate a comprehensive vibe summary that includes:
- A compelling title that captures the essence of the experience
- Estimated duration for the complete experience
- A route with specific coordinates and location titles
- Relevant vibe tags that describe the mood and activities
- Image URLs that represent the experience
- A detailed summary that ties everything together

Data to analyze:
{rawData}

Additional preferences (if provided):
{preferences}

{format_instructions}

Please ensure all coordinates are realistic and all URLs are properly formatted.
`);

// Create LLM chain for vibe analysis
const vibeChain = new LLMChain({
  llm: model,
  prompt: vibePrompt,
  outputParser: parser,
});

/**
 * Enhanced vibe analysis using LangChain
 * @param {Object} rawData - Raw social media and travel data
 * @param {string} preferences - Optional user preferences
 * @returns {Promise<Object>} Structured vibe analysis result
 */
async function analyzeVibeWithLangChain(rawData, preferences = '') {
  try {
    const formatInstructions = parser.getFormatInstructions();
    
    const result = await vibeChain.call({
      rawData: JSON.stringify(rawData, null, 2),
      preferences,
      format_instructions: formatInstructions,
    });

    return result.text;
  } catch (error) {
    console.error('LangChain vibe analysis failed:', error);
    throw new Error(`Vibe analysis failed: ${error.message}`);
  }
}

/**
 * Advanced sentiment analysis for social media content with emotion detection
 * @param {Array} posts - Array of social media posts
 * @returns {Promise<Object>} Comprehensive sentiment analysis results
 */
async function analyzeSentiment(posts) {
  try {
    const sentimentPrompt = PromptTemplate.fromTemplate(`
    Perform advanced sentiment analysis on the following social media posts with detailed emotional insights:

    Posts:
    {posts}

    Provide comprehensive analysis including:
    1. Overall sentiment score (-1 to 1, where -1 is very negative, 0 is neutral, 1 is very positive)
    2. Detailed emotion detection (joy, anger, fear, sadness, surprise, disgust, trust, anticipation)
    3. Mood analysis (energetic, calm, excited, melancholic, etc.)
    4. Context-aware sentiment (considering social media context, slang, emojis)
    5. Sentiment trends across posts
    6. Key themes and topics with emotional associations
    7. Engagement prediction based on emotional content
    8. Content strategy recommendations

    Format your response as JSON:
    {{
      "overallSentiment": number,
      "sentimentDistribution": {{
        "positive": number,
        "neutral": number,
        "negative": number
      }},
      "emotions": {{
        "primary": ["emotion1", "emotion2"],
        "secondary": ["emotion3", "emotion4"],
        "intensity": {{
          "joy": number,
          "anger": number,
          "fear": number,
          "sadness": number,
          "surprise": number,
          "disgust": number,
          "trust": number,
          "anticipation": number
        }}
      }},
      "mood": {{
        "dominant": "mood_type",
        "energy_level": number,
        "emotional_stability": number
      }},
      "contextualFactors": {{
        "platform_specific_sentiment": "analysis",
        "emoji_sentiment_impact": number,
        "slang_sentiment_indicators": ["indicator1", "indicator2"]
      }},
      "sentimentTrends": {{
        "trend_direction": "increasing/decreasing/stable",
        "volatility": number,
        "peak_sentiment_posts": ["post_id1", "post_id2"]
      }},
      "keyThemes": [
        {{
          "theme": "theme_name",
          "sentiment": number,
          "frequency": number,
          "emotional_association": "emotion"
        }}
      ],
      "engagementPrediction": {{
        "predicted_engagement_score": number,
        "viral_potential": number,
        "emotional_resonance": number
      }},
      "recommendations": {{
        "content_strategy": ["rec1", "rec2"],
        "emotional_optimization": ["opt1", "opt2"],
        "engagement_tactics": ["tactic1", "tactic2"]
      }}
    }}
    `);

    const sentimentChain = new LLMChain({
      llm: model,
      prompt: sentimentPrompt,
    });

    const result = await sentimentChain.call({
      posts: JSON.stringify(posts, null, 2),
    });

    return JSON.parse(result.text);
  } catch (error) {
    console.error('Advanced sentiment analysis failed:', error);
    throw new Error(`Advanced sentiment analysis failed: ${error.message}`);
  }
}

/**
 * Content categorization and tagging
 * @param {Object} content - Content to categorize
 * @returns {Promise<Object>} Categorization results
 */
async function categorizeContent(content) {
  try {
    const categorizationPrompt = PromptTemplate.fromTemplate(`
    Analyze and categorize the following content:

    Content:
    {content}

    Please provide:
    1. Primary category (e.g., Travel, Food, Fashion, Lifestyle, etc.)
    2. Secondary categories
    3. Relevant hashtags
    4. Target audience
    5. Content quality score (1-10)
    6. Viral potential score (1-10)

    Format your response as JSON:
    {{
      "primaryCategory": "category",
      "secondaryCategories": ["cat1", "cat2"],
      "suggestedHashtags": ["#tag1", "#tag2"],
      "targetAudience": "audience description",
      "qualityScore": number,
      "viralPotential": number,
      "reasoning": "explanation of the analysis"
    }}
    `);

    const categorizationChain = new LLMChain({
      llm: model,
      prompt: categorizationPrompt,
    });

    const result = await categorizationChain.call({
      content: JSON.stringify(content, null, 2),
    });

    return JSON.parse(result.text);
  } catch (error) {
    console.error('Content categorization failed:', error);
    throw new Error(`Content categorization failed: ${error.message}`);
  }
}

/**
 * Comprehensive video analysis for Instagram and TikTok content
 * @param {Object} videoData - Video metadata and content information
 * @returns {Promise<Object>} Detailed video analysis results
 */
async function analyzeVideoContent(videoData) {
  try {
    const videoAnalysisPrompt = PromptTemplate.fromTemplate(`
    Perform comprehensive analysis of the following video content from social media:

    Video Data:
    {videoData}

    Provide detailed analysis including:
    1. Content categorization and themes
    2. Engagement metrics analysis and patterns
    3. Hashtag effectiveness and semantic analysis
    4. Viral potential prediction with specific factors
    5. Cross-platform performance comparison
    6. Audience targeting insights
    7. Content optimization recommendations
    8. Trend alignment analysis

    Format your response as JSON:
    {{
      "contentAnalysis": {{
        "primaryCategory": "category",
        "themes": ["theme1", "theme2"],
        "contentType": "educational/entertainment/promotional/etc",
        "visualStyle": "analysis of visual elements",
        "audioAnalysis": "music/voice/sound analysis"
      }},
      "engagementAnalysis": {{
        "engagementRate": number,
        "engagementQuality": "high/medium/low",
        "peakEngagementFactors": ["factor1", "factor2"],
        "audienceRetention": number,
        "shareability": number
      }},
      "hashtagAnalysis": {{
        "effectiveness": number,
        "trending_hashtags": ["#tag1", "#tag2"],
        "niche_hashtags": ["#niche1", "#niche2"],
        "hashtag_reach_potential": number,
        "semantic_clusters": ["cluster1", "cluster2"]
      }},
      "viralPotential": {{
        "score": number,
        "factors": {{
          "timing": number,
          "content_uniqueness": number,
          "emotional_impact": number,
          "shareability": number,
          "trend_alignment": number
        }},
        "prediction_confidence": number,
        "growth_trajectory": "exponential/linear/declining"
      }},
      "crossPlatformAnalysis": {{
        "platform_optimization": {{
          "instagram": "optimization suggestions",
          "tiktok": "optimization suggestions"
        }},
        "content_adaptation": ["adaptation1", "adaptation2"],
        "platform_specific_performance": {{
          "instagram_score": number,
          "tiktok_score": number
        }}
      }},
      "audienceInsights": {{
        "target_demographics": {{
          "age_range": "range",
          "interests": ["interest1", "interest2"],
          "behavior_patterns": ["pattern1", "pattern2"]
        }},
        "engagement_personas": ["persona1", "persona2"],
        "optimal_posting_times": ["time1", "time2"]
      }},
      "recommendations": {{
        "content_optimization": ["opt1", "opt2"],
        "hashtag_strategy": ["strategy1", "strategy2"],
        "engagement_tactics": ["tactic1", "tactic2"],
        "viral_enhancement": ["enhancement1", "enhancement2"]
      }}
    }}
    `);

    const videoAnalysisChain = new LLMChain({
      llm: model,
      prompt: videoAnalysisPrompt,
    });

    const result = await videoAnalysisChain.call({
      videoData: JSON.stringify(videoData, null, 2),
    });

    return JSON.parse(result.text);
  } catch (error) {
    console.error('Video analysis failed:', error);
    throw new Error(`Video analysis failed: ${error.message}`);
  }
}

/**
 * Multi-modal content analysis combining text, image, and video data
 * @param {Object} multiModalData - Combined content data from multiple sources
 * @returns {Promise<Object>} Comprehensive multi-modal analysis
 */
async function analyzeMultiModalContent(multiModalData) {
  try {
    const multiModalPrompt = PromptTemplate.fromTemplate(`
    Perform comprehensive multi-modal analysis of the following content combining text, visual, and metadata elements:

    Multi-Modal Data:
    {multiModalData}

    Provide integrated analysis across all modalities:
    1. Cross-modal consistency analysis
    2. Content coherence across different media types
    3. Unified sentiment and emotional analysis
    4. Visual-textual alignment assessment
    5. Multi-modal engagement prediction
    6. Comprehensive content strategy recommendations

    Format your response as JSON:
    {{
      "crossModalAnalysis": {{
        "consistency_score": number,
        "modal_alignment": {{
          "text_visual": number,
          "text_audio": number,
          "visual_audio": number
        }},
        "content_coherence": number,
        "message_clarity": number
      }},
      "unifiedSentiment": {{
        "overall_sentiment": number,
        "modal_sentiment_breakdown": {{
          "text_sentiment": number,
          "visual_sentiment": number,
          "audio_sentiment": number
        }},
        "sentiment_consistency": number
      }},
      "engagementPrediction": {{
        "multi_modal_score": number,
        "engagement_drivers": ["driver1", "driver2"],
        "modal_contribution": {{
          "text_contribution": number,
          "visual_contribution": number,
          "audio_contribution": number
        }}
      }},
      "contentQuality": {{
        "production_quality": number,
        "content_depth": number,
        "originality": number,
        "accessibility": number
      }},
      "audienceResonance": {{
        "target_alignment": number,
        "emotional_connection": number,
        "cultural_relevance": number,
        "shareability_factors": ["factor1", "factor2"]
      }},
      "optimizationRecommendations": {{
        "text_optimization": ["opt1", "opt2"],
        "visual_optimization": ["opt1", "opt2"],
        "audio_optimization": ["opt1", "opt2"],
        "cross_modal_enhancement": ["enhancement1", "enhancement2"]
      }}
    }}
    `);

    const multiModalChain = new LLMChain({
      llm: model,
      prompt: multiModalPrompt,
    });

    const result = await multiModalChain.call({
      multiModalData: JSON.stringify(multiModalData, null, 2),
    });

    return JSON.parse(result.text);
  } catch (error) {
    console.error('Multi-modal analysis failed:', error);
    throw new Error(`Multi-modal analysis failed: ${error.message}`);
  }
}

/**
 * Document processing and analysis for blog posts and text content
 * @param {Object} documentData - Document content and metadata
 * @returns {Promise<Object>} Comprehensive document analysis
 */
async function processDocument(documentData) {
  try {
    const documentPrompt = PromptTemplate.fromTemplate(`
    Perform comprehensive document processing and analysis:

    Document Data:
    {documentData}

    Provide detailed analysis including:
    1. Text extraction and cleaning
    2. Keyword extraction and importance scoring
    3. Topic modeling and theme identification
    4. Content summarization
    5. Relevance scoring for content curation
    6. SEO optimization recommendations
    7. Content structure analysis
    8. Readability and engagement assessment

    Format your response as JSON:
    {{
      "textProcessing": {{
        "cleaned_text": "processed text content",
        "word_count": number,
        "reading_time": number,
        "language": "detected language",
        "text_quality": number
      }},
      "keywordAnalysis": {{
        "primary_keywords": [
          {{
            "keyword": "keyword",
            "importance": number,
            "frequency": number,
            "context": "usage context"
          }}
        ],
        "secondary_keywords": ["keyword1", "keyword2"],
        "long_tail_keywords": ["phrase1", "phrase2"],
        "keyword_density": number
      }},
      "topicModeling": {{
        "main_topics": [
          {{
            "topic": "topic name",
            "confidence": number,
            "keywords": ["word1", "word2"]
          }}
        ],
        "topic_coherence": number,
        "content_focus": number
      }},
      "contentSummary": {{
        "executive_summary": "brief summary",
        "key_points": ["point1", "point2"],
        "main_arguments": ["arg1", "arg2"],
        "conclusions": ["conclusion1", "conclusion2"]
      }},
      "relevanceScoring": {{
        "content_relevance": number,
        "timeliness": number,
        "authority": number,
        "uniqueness": number,
        "curation_score": number
      }},
      "seoAnalysis": {{
        "seo_score": number,
        "title_optimization": "recommendations",
        "meta_description": "suggested description",
        "header_structure": "analysis",
        "internal_linking": "suggestions"
      }},
      "readabilityAssessment": {{
        "readability_score": number,
        "grade_level": "reading level",
        "sentence_complexity": number,
        "engagement_potential": number
      }},
      "recommendations": {{
        "content_improvements": ["improvement1", "improvement2"],
        "seo_optimizations": ["opt1", "opt2"],
        "engagement_enhancements": ["enhancement1", "enhancement2"]
      }}
    }}
    `);

    const documentChain = new LLMChain({
      llm: model,
      prompt: documentPrompt,
    });

    const result = await documentChain.call({
      documentData: JSON.stringify(documentData, null, 2),
    });

    return JSON.parse(result.text);
  } catch (error) {
    console.error('Document processing failed:', error);
    throw new Error(`Document processing failed: ${error.message}`);
  }
}

module.exports = {
  analyzeVibeWithLangChain,
  analyzeSentiment,
  categorizeContent,
  analyzeVideoContent,
  analyzeMultiModalContent,
  processDocument,
  model,
};