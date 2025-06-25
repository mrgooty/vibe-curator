# AI Analysis Pipeline Documentation

## Overview

The Vibe Curator AI Analysis Pipeline provides comprehensive content analysis capabilities for social media content, documents, and multi-modal data using LangChain and LangGraph workflows. This system offers advanced sentiment analysis, video content analysis, document processing, and viral potential prediction.

## Features

### 1. Advanced Sentiment Analysis
- **Emotion Detection**: Identifies 8 core emotions (joy, anger, fear, sadness, surprise, disgust, trust, anticipation)
- **Mood Analysis**: Analyzes energy levels and emotional stability
- **Context-Aware Analysis**: Considers platform-specific context, emojis, and slang
- **Sentiment Trends**: Tracks sentiment changes across multiple posts
- **Engagement Prediction**: Predicts engagement based on emotional content

### 2. Video Content Analysis
- **Content Categorization**: Automatically categorizes video themes and topics
- **Engagement Metrics Analysis**: Analyzes likes, comments, shares, and views
- **Hashtag Analysis**: Evaluates hashtag effectiveness and semantic clustering
- **Viral Potential Prediction**: Predicts viral potential with confidence scores
- **Cross-Platform Optimization**: Provides platform-specific recommendations
- **Audience Insights**: Identifies target demographics and optimal posting times

### 3. Document Processing
- **Text Extraction**: Cleans and processes text content
- **Keyword Analysis**: Extracts primary, secondary, and long-tail keywords
- **Topic Modeling**: Identifies main topics with confidence scores
- **Content Summarization**: Generates executive summaries and key points
- **SEO Analysis**: Provides SEO optimization recommendations
- **Readability Assessment**: Evaluates content readability and engagement potential

### 4. Multi-Modal Analysis
- **Cross-Modal Consistency**: Analyzes alignment between text, visual, and audio elements
- **Unified Sentiment**: Combines sentiment across all modalities
- **Content Quality Assessment**: Evaluates production quality and originality
- **Audience Resonance**: Measures emotional connection and cultural relevance

### 5. Trend Analysis
- **Current Trend Alignment**: Evaluates content alignment with current trends
- **Viral Potential Forecasting**: Predicts viral growth patterns
- **Engagement Forecasting**: Predicts future engagement trends
- **Competitive Analysis**: Analyzes market position and differentiation factors

## API Endpoints

### GraphQL Mutations

#### 1. Comprehensive Content Analysis
```graphql
mutation AnalyzeContentComprehensive($input: ContentAnalysisInput!) {
  analyzeContentComprehensive(input: $input) {
    summary {
      platform
      contentType
      totalPosts
      analyzedAt
      analysisCompleteness {
        sentiment
        video
        document
        multiModal
        trends
      }
    }
    analysis {
      sentiment {
        overallSentiment
        emotions {
          primary
          intensity {
            joy
            anger
            fear
            sadness
          }
        }
        recommendations {
          content_strategy
          engagement_tactics
        }
      }
      video {
        viralPotential {
          score
          growth_trajectory
        }
        recommendations {
          content_optimization
          viral_enhancement
        }
      }
    }
    insights {
      performanceMetrics {
        overallScore
        viralPotential
        engagementPrediction
      }
      actionableRecommendations {
        immediate
        shortTerm
        longTerm
      }
    }
  }
}
```

#### 2. Video Analysis
```graphql
mutation AnalyzeVideo($input: VideoAnalysisInput!) {
  analyzeVideo(input: $input) {
    analysis {
      video {
        contentAnalysis {
          primaryCategory
          themes
          contentType
        }
        viralPotential {
          score
          factors {
            timing
            content_uniqueness
            emotional_impact
          }
        }
        crossPlatformAnalysis {
          platform_optimization {
            instagram
            tiktok
          }
        }
      }
    }
  }
}
```

#### 3. Document Processing
```graphql
mutation ProcessDocument($input: DocumentProcessingInput!) {
  processDocument(input: $input) {
    analysis {
      document {
        keywordAnalysis {
          primary_keywords {
            keyword
            importance
            frequency
          }
        }
        topicModeling {
          main_topics {
            topic
            confidence
            keywords
          }
        }
        seoAnalysis {
          seo_score
          title_optimization
        }
      }
    }
  }
}
```

#### 4. Fast Sentiment Analysis
```graphql
mutation AnalyzeSentiment($input: SentimentAnalysisInput!) {
  analyzeSentiment(input: $input) {
    analysis {
      sentiment {
        overallSentiment
        sentimentDistribution {
          positive
          neutral
          negative
        }
        emotions {
          primary
          intensity {
            joy
            anger
            trust
          }
        }
      }
    }
  }
}
```

#### 5. Batch Analysis
```graphql
mutation AnalyzeBatch($input: BatchAnalysisInput!) {
  analyzeBatch(input: $input) {
    index
    success
    result {
      insights {
        performanceMetrics {
          overallScore
          viralPotential
        }
      }
    }
    error
  }
}
```

### GraphQL Queries

#### Get Analysis Status
```graphql
query GetAnalysisStatus($workflowId: String!) {
  getAnalysisStatus(workflowId: $workflowId) {
    status
    progress
    results {
      insights {
        performanceMetrics {
          overallScore
        }
      }
    }
  }
}
```

## Usage Examples

### 1. Analyzing Instagram Content

```javascript
const { executeContentAnalysis } = require('./ai/workflows');

const instagramData = {
  platform: 'instagram',
  data: [
    {
      caption: "Amazing sunset at the beach! #sunset #beach #nature",
      hashtags: ["sunset", "beach", "nature"],
      likesCount: 1250,
      commentsCount: 45,
      displayUrl: "https://lookaside.instagram.com/seo/google_widget/crawler/?media_id=3226385888992383158"
    }
  ]
};

const result = await executeContentAnalysis(instagramData, {
  contentType: 'mixed',
  platform: 'instagram'
});

console.log('Overall Score:', result.insights.performanceMetrics.overallScore);
console.log('Viral Potential:', result.insights.performanceMetrics.viralPotential);
```

### 2. Video Analysis for TikTok

```javascript
const { executeVideoAnalysis } = require('./ai/workflows');

const tiktokVideo = {
  platform: 'tiktok',
  data: [
    {
      text: "Dance challenge! Who's next? #dance #challenge #viral",
      playCount: 50000,
      diggCount: 2500,
      shareCount: 180,
      duration: 15,
      hashtags: ["dance", "challenge", "viral"]
    }
  ]
};

const result = await executeVideoAnalysis(tiktokVideo, {
  platform: 'tiktok'
});

console.log('Viral Score:', result.analysis.video.viralPotential.score);
console.log('Recommendations:', result.analysis.video.recommendations.viral_enhancement);
```

### 3. Document Processing

```javascript
const { executeDocumentProcessing } = require('./ai/workflows');

const blogPost = {
  platform: 'blog',
  data: [
    {
      caption: "Complete guide to social media marketing in 2024. Learn the latest strategies, tools, and techniques to grow your audience and increase engagement. This comprehensive guide covers everything from content creation to analytics and optimization."
    }
  ]
};

const result = await executeDocumentProcessing(blogPost);

console.log('SEO Score:', result.analysis.document.seoAnalysis.seo_score);
console.log('Key Topics:', result.analysis.document.topicModeling.main_topics);
```

### 4. Batch Processing

```javascript
const { executeBatchAnalysis } = require('./ai/workflows');

const contentItems = [
  { platform: 'instagram', data: [/* instagram posts */] },
  { platform: 'tiktok', data: [/* tiktok videos */] },
  { platform: 'blog', data: [/* blog content */] }
];

const results = await executeBatchAnalysis(contentItems, {
  batchSize: 3
});

results.forEach((item, index) => {
  if (item.success) {
    console.log(`Item ${index}: Score ${item.result.insights.performanceMetrics.overallScore}`);
  } else {
    console.log(`Item ${index}: Error - ${item.error}`);
  }
});
```

## Workflow Architecture

### LangGraph Workflow Structure

The AI analysis system uses LangGraph to create sophisticated, stateful workflows:

1. **Preprocessing Node**: Cleans and structures raw content data
2. **Sentiment Analysis Node**: Performs advanced emotion and mood analysis
3. **Categorization Node**: Classifies content into categories and themes
4. **Video Analysis Node**: Analyzes video-specific metrics and viral potential
5. **Document Analysis Node**: Processes text content for SEO and readability
6. **Multi-Modal Analysis Node**: Combines insights across all content types
7. **Trend Analysis Node**: Evaluates trend alignment and viral forecasting
8. **Vibe Analysis Node**: Generates personalized experience recommendations
9. **Report Generation Node**: Compiles comprehensive analysis results

### Workflow Types

- **Comprehensive Analysis**: Full pipeline with all analysis nodes
- **Video-Focused**: Optimized for video content analysis
- **Document-Focused**: Specialized for text content processing
- **Fast Sentiment**: Quick sentiment analysis for real-time applications

## Configuration

### Environment Variables

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Analysis Configuration
DEFAULT_BATCH_SIZE=5
MAX_CONTENT_LENGTH=10000
ANALYSIS_TIMEOUT=300000

# Platform Configuration
INSTAGRAM_RATE_LIMIT=100
TIKTOK_RATE_LIMIT=50
```

### Model Configuration

The system uses GPT-4 for analysis with optimized temperature settings:

- **Content Analysis**: Temperature 0.3 (more focused)
- **Creative Analysis**: Temperature 0.7 (more creative)
- **Sentiment Analysis**: Temperature 0.1 (most consistent)

## Error Handling

The system includes comprehensive error handling:

- **Graceful Degradation**: Continues analysis even if some components fail
- **Retry Logic**: Automatically retries failed API calls
- **Error Reporting**: Detailed error messages in analysis results
- **Fallback Modes**: Alternative analysis paths for different content types

## Performance Optimization

- **Batch Processing**: Processes multiple items efficiently
- **Caching**: Caches analysis results to avoid redundant processing
- **Rate Limiting**: Respects API rate limits with intelligent queuing
- **Parallel Processing**: Runs independent analysis nodes in parallel

## Integration Examples

### Express.js Route Integration

```javascript
const express = require('express');
const { executeContentAnalysis } = require('../ai/workflows');

const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const { content, options } = req.body;
    const result = await executeContentAnalysis(content, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### Real-time Analysis with WebSockets

```javascript
const WebSocket = require('ws');
const { executeFastSentimentAnalysis } = require('../ai/workflows');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', async (data) => {
    try {
      const content = JSON.parse(data);
      const result = await executeFastSentimentAnalysis(content);
      ws.send(JSON.stringify(result));
    } catch (error) {
      ws.send(JSON.stringify({ error: error.message }));
    }
  });
});
```

## Monitoring and Analytics

The system provides built-in monitoring capabilities:

- **Analysis Metrics**: Track processing times and success rates
- **Performance Monitoring**: Monitor API usage and response times
- **Quality Metrics**: Track analysis accuracy and user feedback
- **Usage Analytics**: Monitor feature usage and popular analysis types

## Future Enhancements

Planned improvements include:

- **Real-time Streaming Analysis**: Process content as it's created
- **Custom Model Training**: Train specialized models for specific use cases
- **Advanced Visualization**: Interactive dashboards for analysis results
- **API Rate Optimization**: Intelligent API usage optimization
- **Multi-language Support**: Analysis in multiple languages
- **Advanced Caching**: Redis-based caching for improved performance

## Support and Troubleshooting

### Common Issues

1. **API Rate Limits**: Implement exponential backoff and request queuing
2. **Large Content Processing**: Use batch processing for large datasets
3. **Memory Usage**: Monitor memory usage during intensive analysis
4. **Timeout Issues**: Adjust timeout settings for complex analysis

### Debug Mode

Enable debug logging:

```javascript
process.env.DEBUG_AI_ANALYSIS = 'true';
```

This will provide detailed logging of workflow execution and API calls.

## Contributing

When contributing to the AI analysis pipeline:

1. Follow the existing workflow patterns
2. Add comprehensive error handling
3. Include unit tests for new features
4. Update documentation for new capabilities
5. Consider performance implications of changes

## License

This AI analysis pipeline is part of the Vibe Curator project and follows the same licensing terms.