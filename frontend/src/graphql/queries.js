import { gql } from '@apollo/client';

// User queries
export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_HISTORY = gql`
  query GetUserHistory($userId: String!) {
    getUserHistory(userId: $userId) {
      id
      userId
      query
      result
      createdAt
    }
  }
`;

// Content analysis queries
export const GET_VIBE_SUMMARY = gql`
  query GetVibeSummary($input: VibeAnalysisInput!) {
    getVibeSummary(input: $input) {
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
`;

export const GET_ANALYSIS_STATUS = gql`
  query GetAnalysisStatus($workflowId: String!) {
    getAnalysisStatus(workflowId: $workflowId) {
      workflowId
      status
      progress
      startTime
      endTime
      results {
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
  }
`;

// Social media queries
export const SCRAPE_INSTAGRAM = gql`
  query ScrapeInstagram($tag: String!) {
    scrapeInstagram(tag: $tag) {
      success
      tag
      count
      data {
        id
        shortCode
        caption
        hashtags
        likesCount
        commentsCount
        timestamp
        displayUrl
        ownerUsername
        location
        type
      }
      scrapedAt
    }
  }
`;

export const SCRAPE_TIKTOK = gql`
  query ScrapeTikTok($hashtag: String!, $limit: Int) {
    scrapeTikTok(hashtag: $hashtag, limit: $limit) {
      success
      hashtag
      count
      data {
        id
        text
        createTime
        authorMeta {
          id
          name
          nickName
          verified
          signature
          avatar
          following
          fans
          heart
          video
        }
        musicMeta {
          musicId
          musicName
          musicAuthor
          musicOriginal
        }
        covers {
          default
          origin
          dynamic
        }
        webVideoUrl
        videoUrl
        videoUrlNoWaterMark
        videoMeta {
          height
          width
          duration
        }
        diggCount
        shareCount
        playCount
        commentCount
        hashtags
      }
      scrapedAt
    }
  }
`;

export const SCRAPE_TIKTOK_USER = gql`
  query ScrapeTikTokUser($username: String!) {
    scrapeTikTokUser(username: $username) {
      success
      username
      count
      data {
        id
        text
        createTime
        authorMeta {
          id
          name
          nickName
          verified
          signature
          avatar
          following
          fans
          heart
          video
        }
        musicMeta {
          musicId
          musicName
          musicAuthor
          musicOriginal
        }
        covers {
          default
          origin
          dynamic
        }
        webVideoUrl
        videoUrl
        videoUrlNoWaterMark
        videoMeta {
          height
          width
          duration
        }
        diggCount
        shareCount
        playCount
        commentCount
        hashtags
      }
      scrapedAt
    }
  }
`;