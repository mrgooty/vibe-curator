import { gql } from '@apollo/client';

// Authentication mutations
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        username
        email
        createdAt
        updatedAt
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        username
        email
        createdAt
        updatedAt
      }
    }
  }
`;

// Content analysis mutations
export const ANALYZE_CONTENT_COMPREHENSIVE = gql`
  mutation AnalyzeContentComprehensive($input: ContentAnalysisInput!) {
    analyzeContentComprehensive(input: $input) {
      summary {
        platform
        contentType
        totalPosts
        analyzedAt
        hasErrors
        analysisCompleteness {
          sentiment
          categorization
          video
          document
          multiModal
          trends
        }
      }
      contentOverview {
        totalHashtags
        totalMentions
        mediaCount
        textPosts
        contentDistribution {
          hasVideo
          hasDocument
          hasMultiModal
        }
      }
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
            secondary
            intensity {
              joy
              anger
              fear
              sadness
              surprise
              disgust
              trust
              anticipation
            }
          }
          mood {
            dominant
            energy_level
            emotional_stability
          }
          contextualFactors {
            platform_specific_sentiment
            emoji_sentiment_impact
            slang_sentiment_indicators
          }
          sentimentTrends {
            trend_direction
            volatility
            peak_sentiment_posts
          }
          keyThemes {
            theme
            sentiment
            frequency
            emotional_association
          }
          engagementPrediction {
            predicted_engagement_score
            viral_potential
            emotional_resonance
          }
          recommendations {
            content_strategy
            emotional_optimization
            engagement_tactics
          }
        }
        video {
          contentAnalysis {
            primaryCategory
            themes
            contentType
            visualStyle
            audioAnalysis
          }
          engagementAnalysis {
            engagementRate
            engagementQuality
            peakEngagementFactors
            audienceRetention
            shareability
          }
          hashtagAnalysis {
            effectiveness
            trending_hashtags
            niche_hashtags
            hashtag_reach_potential
            semantic_clusters
          }
          viralPotential {
            score
            factors {
              timing
              content_uniqueness
              emotional_impact
              shareability
              trend_alignment
            }
            prediction_confidence
            growth_trajectory
          }
          crossPlatformAnalysis {
            platform_optimization {
              instagram
              tiktok
            }
            content_adaptation
            platform_specific_performance {
              instagram_score
              tiktok_score
            }
          }
          audienceInsights {
            target_demographics {
              age_range
              interests
              behavior_patterns
            }
            engagement_personas
            optimal_posting_times
          }
          recommendations {
            content_optimization
            hashtag_strategy
            engagement_tactics
            viral_enhancement
          }
        }
        document {
          textProcessing {
            cleaned_text
            word_count
            reading_time
            language
            text_quality
          }
          keywordAnalysis {
            primary_keywords {
              keyword
              importance
              frequency
              context
            }
            secondary_keywords
            long_tail_keywords
            keyword_density
          }
          topicModeling {
            main_topics {
              topic
              confidence
              keywords
            }
            topic_coherence
            content_focus
          }
          contentSummary {
            executive_summary
            key_points
            main_arguments
            conclusions
          }
          relevanceScoring {
            content_relevance
            timeliness
            authority
            uniqueness
            curation_score
          }
          seoAnalysis {
            seo_score
            title_optimization
            meta_description
            header_structure
            internal_linking
          }
          readabilityAssessment {
            readability_score
            grade_level
            sentence_complexity
            engagement_potential
          }
          recommendations {
            content_improvements
            seo_optimizations
            engagement_enhancements
          }
        }
        vibe {
          title
          duration
          route {
            lat
            lon
            title
          }
          vibeTags
          images
          summary
        }
      }
      insights {
        keyFindings
        actionableRecommendations {
          immediate
          shortTerm
          longTerm
        }
        performanceMetrics {
          overallScore
          viralPotential
          engagementPrediction
          contentQuality
        }
      }
      metadata {
        processingTime
        analysisVersion
        errors
      }
    }
  }
`;

export const ANALYZE_VIDEO = gql`
  mutation AnalyzeVideo($input: VideoAnalysisInput!) {
    analyzeVideo(input: $input) {
      summary {
        platform
        contentType
        totalPosts
        analyzedAt
        hasErrors
        analysisCompleteness {
          sentiment
          categorization
          video
          document
          multiModal
          trends
        }
      }
      analysis {
        video {
          contentAnalysis {
            primaryCategory
            themes
            contentType
            visualStyle
            audioAnalysis
          }
          engagementAnalysis {
            engagementRate
            engagementQuality
            peakEngagementFactors
            audienceRetention
            shareability
          }
          viralPotential {
            score
            factors {
              timing
              content_uniqueness
              emotional_impact
              shareability
              trend_alignment
            }
            prediction_confidence
            growth_trajectory
          }
          recommendations {
            content_optimization
            hashtag_strategy
            engagement_tactics
            viral_enhancement
          }
        }
      }
      insights {
        keyFindings
        actionableRecommendations {
          immediate
          shortTerm
          longTerm
        }
        performanceMetrics {
          overallScore
          viralPotential
          engagementPrediction
          contentQuality
        }
      }
    }
  }
`;

export const PROCESS_DOCUMENT = gql`
  mutation ProcessDocument($input: DocumentProcessingInput!) {
    processDocument(input: $input) {
      summary {
        platform
        contentType
        totalPosts
        analyzedAt
        hasErrors
      }
      analysis {
        document {
          textProcessing {
            cleaned_text
            word_count
            reading_time
            language
            text_quality
          }
          keywordAnalysis {
            primary_keywords {
              keyword
              importance
              frequency
              context
            }
            secondary_keywords
            long_tail_keywords
            keyword_density
          }
          contentSummary {
            executive_summary
            key_points
            main_arguments
            conclusions
          }
          recommendations {
            content_improvements
            seo_optimizations
            engagement_enhancements
          }
        }
      }
      insights {
        keyFindings
        actionableRecommendations {
          immediate
          shortTerm
          longTerm
        }
      }
    }
  }
`;

export const ANALYZE_SENTIMENT = gql`
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
            secondary
            intensity {
              joy
              anger
              fear
              sadness
              surprise
              disgust
              trust
              anticipation
            }
          }
          recommendations {
            content_strategy
            emotional_optimization
            engagement_tactics
          }
        }
      }
      insights {
        keyFindings
        performanceMetrics {
          overallScore
          engagementPrediction
        }
      }
    }
  }
`;

export const SAVE_TO_HISTORY = gql`
  mutation SaveToHistory($userId: String!, $query: String!, $result: String!) {
    saveToHistory(userId: $userId, query: $query, result: $result) {
      id
      userId
      query
      result
      createdAt
    }
  }
`;