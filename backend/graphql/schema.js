const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # User Types
  type User {
    id: ID!
    username: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  # Content Analysis Types
  type VibeRoute {
    lat: Float!
    lon: Float!
    title: String!
  }

  type VibeSummary {
    title: String!
    duration: String!
    route: [VibeRoute!]!
    vibeTags: [String!]!
    images: [String!]!
    summary: String!
  }

  # Social Media Types
  type InstagramPost {
    id: ID!
    shortCode: String!
    caption: String
    hashtags: [String!]!
    likesCount: Int!
    commentsCount: Int!
    timestamp: String!
    displayUrl: String!
    ownerUsername: String!
    location: String
    type: String!
  }

  type InstagramData {
    success: Boolean!
    tag: String!
    count: Int!
    data: [InstagramPost!]!
    scrapedAt: String!
  }

  type TikTokAuthor {
    id: String
    name: String
    nickName: String
    verified: Boolean
    signature: String
    avatar: String
    following: Int
    fans: Int
    heart: Int
    video: Int
  }

  type TikTokMusic {
    musicId: String
    musicName: String
    musicAuthor: String
    musicOriginal: Boolean
  }

  type TikTokCovers {
    default: String
    origin: String
    dynamic: String
  }

  type TikTokVideoMeta {
    height: Int
    width: Int
    duration: Int
  }

  type TikTokPost {
    id: ID!
    text: String
    createTime: String!
    authorMeta: TikTokAuthor
    musicMeta: TikTokMusic
    covers: TikTokCovers
    webVideoUrl: String
    videoUrl: String
    videoUrlNoWaterMark: String
    videoMeta: TikTokVideoMeta
    diggCount: Int!
    shareCount: Int!
    playCount: Int!
    commentCount: Int!
    hashtags: [String!]!
  }

  type TikTokData {
    success: Boolean!
    hashtag: String
    username: String
    count: Int!
    data: [TikTokPost!]!
    scrapedAt: String!
  }

  # AI Analysis Types
  type SentimentDistribution {
    positive: Float!
    neutral: Float!
    negative: Float!
  }

  type EmotionIntensity {
    joy: Float!
    anger: Float!
    fear: Float!
    sadness: Float!
    surprise: Float!
    disgust: Float!
    trust: Float!
    anticipation: Float!
  }

  type EmotionAnalysis {
    primary: [String!]!
    secondary: [String!]!
    intensity: EmotionIntensity!
  }

  type MoodAnalysis {
    dominant: String!
    energy_level: Float!
    emotional_stability: Float!
  }

  type ContextualFactors {
    platform_specific_sentiment: String!
    emoji_sentiment_impact: Float!
    slang_sentiment_indicators: [String!]!
  }

  type SentimentTrends {
    trend_direction: String!
    volatility: Float!
    peak_sentiment_posts: [String!]!
  }

  type ThemeAnalysis {
    theme: String!
    sentiment: Float!
    frequency: Float!
    emotional_association: String!
  }

  type EngagementPrediction {
    predicted_engagement_score: Float!
    viral_potential: Float!
    emotional_resonance: Float!
  }

  type SentimentRecommendations {
    content_strategy: [String!]!
    emotional_optimization: [String!]!
    engagement_tactics: [String!]!
  }

  type SentimentAnalysisResult {
    overallSentiment: Float!
    sentimentDistribution: SentimentDistribution!
    emotions: EmotionAnalysis!
    mood: MoodAnalysis!
    contextualFactors: ContextualFactors!
    sentimentTrends: SentimentTrends!
    keyThemes: [ThemeAnalysis!]!
    engagementPrediction: EngagementPrediction!
    recommendations: SentimentRecommendations!
  }

  type VideoContentAnalysis {
    primaryCategory: String!
    themes: [String!]!
    contentType: String!
    visualStyle: String!
    audioAnalysis: String!
  }

  type VideoEngagementAnalysis {
    engagementRate: Float!
    engagementQuality: String!
    peakEngagementFactors: [String!]!
    audienceRetention: Float!
    shareability: Float!
  }

  type HashtagAnalysis {
    effectiveness: Float!
    trending_hashtags: [String!]!
    niche_hashtags: [String!]!
    hashtag_reach_potential: Float!
    semantic_clusters: [String!]!
  }

  type ViralPotentialFactors {
    timing: Float!
    content_uniqueness: Float!
    emotional_impact: Float!
    shareability: Float!
    trend_alignment: Float!
  }

  type ViralPotential {
    score: Float!
    factors: ViralPotentialFactors!
    prediction_confidence: Float!
    growth_trajectory: String!
  }

  type PlatformOptimization {
    instagram: String!
    tiktok: String!
  }

  type PlatformPerformance {
    instagram_score: Float!
    tiktok_score: Float!
  }

  type CrossPlatformAnalysis {
    platform_optimization: PlatformOptimization!
    content_adaptation: [String!]!
    platform_specific_performance: PlatformPerformance!
  }

  type TargetDemographics {
    age_range: String!
    interests: [String!]!
    behavior_patterns: [String!]!
  }

  type AudienceInsights {
    target_demographics: TargetDemographics!
    engagement_personas: [String!]!
    optimal_posting_times: [String!]!
  }

  type VideoRecommendations {
    content_optimization: [String!]!
    hashtag_strategy: [String!]!
    engagement_tactics: [String!]!
    viral_enhancement: [String!]!
  }

  type VideoAnalysisResult {
    contentAnalysis: VideoContentAnalysis!
    engagementAnalysis: VideoEngagementAnalysis!
    hashtagAnalysis: HashtagAnalysis!
    viralPotential: ViralPotential!
    crossPlatformAnalysis: CrossPlatformAnalysis!
    audienceInsights: AudienceInsights!
    recommendations: VideoRecommendations!
  }

  type DocumentTextProcessing {
    cleaned_text: String!
    word_count: Int!
    reading_time: Int!
    language: String!
    text_quality: Float!
  }

  type KeywordInfo {
    keyword: String!
    importance: Float!
    frequency: Int!
    context: String!
  }

  type KeywordAnalysis {
    primary_keywords: [KeywordInfo!]!
    secondary_keywords: [String!]!
    long_tail_keywords: [String!]!
    keyword_density: Float!
  }

  type TopicInfo {
    topic: String!
    confidence: Float!
    keywords: [String!]!
  }

  type TopicModeling {
    main_topics: [TopicInfo!]!
    topic_coherence: Float!
    content_focus: Float!
  }

  type ContentSummary {
    executive_summary: String!
    key_points: [String!]!
    main_arguments: [String!]!
    conclusions: [String!]!
  }

  type RelevanceScoring {
    content_relevance: Float!
    timeliness: Float!
    authority: Float!
    uniqueness: Float!
    curation_score: Float!
  }

  type SEOAnalysis {
    seo_score: Float!
    title_optimization: String!
    meta_description: String!
    header_structure: String!
    internal_linking: String!
  }

  type ReadabilityAssessment {
    readability_score: Float!
    grade_level: String!
    sentence_complexity: Float!
    engagement_potential: Float!
  }

  type DocumentRecommendations {
    content_improvements: [String!]!
    seo_optimizations: [String!]!
    engagement_enhancements: [String!]!
  }

  type DocumentAnalysisResult {
    textProcessing: DocumentTextProcessing!
    keywordAnalysis: KeywordAnalysis!
    topicModeling: TopicModeling!
    contentSummary: ContentSummary!
    relevanceScoring: RelevanceScoring!
    seoAnalysis: SEOAnalysis!
    readabilityAssessment: ReadabilityAssessment!
    recommendations: DocumentRecommendations!
  }

  type AnalysisCompleteness {
    sentiment: Boolean!
    categorization: Boolean!
    video: Boolean!
    document: Boolean!
    multiModal: Boolean!
    trends: Boolean!
  }

  type ContentDistribution {
    hasVideo: Boolean!
    hasDocument: Boolean!
    hasMultiModal: Boolean!
  }

  type AnalysisSummary {
    platform: String!
    contentType: String!
    totalPosts: Int!
    analyzedAt: String!
    hasErrors: Boolean!
    analysisCompleteness: AnalysisCompleteness!
  }

  type ContentOverview {
    totalHashtags: Int!
    totalMentions: Int!
    mediaCount: Int!
    textPosts: Int!
    contentDistribution: ContentDistribution!
  }

  type AnalysisResults {
    sentiment: SentimentAnalysisResult
    categorization: String
    video: VideoAnalysisResult
    document: DocumentAnalysisResult
    multiModal: String
    trends: String
    vibe: VibeSummary
  }

  type ActionableRecommendations {
    immediate: [String!]!
    shortTerm: [String!]!
    longTerm: [String!]!
  }

  type PerformanceMetrics {
    overallScore: Float!
    viralPotential: Float!
    engagementPrediction: Float!
    contentQuality: Float!
  }

  type AnalysisInsights {
    keyFindings: [String!]!
    actionableRecommendations: ActionableRecommendations!
    performanceMetrics: PerformanceMetrics!
  }

  type AnalysisMetadata {
    processingTime: String!
    analysisVersion: String!
    errors: [String!]!
  }

  type ComprehensiveAnalysisResult {
    summary: AnalysisSummary!
    contentOverview: ContentOverview!
    analysis: AnalysisResults!
    insights: AnalysisInsights!
    metadata: AnalysisMetadata!
  }

  type BatchAnalysisItem {
    index: Int!
    result: ComprehensiveAnalysisResult
    error: String
    success: Boolean!
  }

  type AnalysisStatus {
    workflowId: String!
    status: String!
    progress: Float!
    startTime: String!
    endTime: String
    results: ComprehensiveAnalysisResult
  }

  # History Types
  type HistoryEntry {
    id: ID!
    userId: String!
    query: String!
    result: String!
    createdAt: String!
  }

  # Input Types
  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  input VibeAnalysisInput {
    rawData: String!
    preferences: String
  }

  input AnalysisOptionsInput {
    contentType: String
    platform: String
    batchSize: Int
  }

  input ContentAnalysisInput {
    rawContent: String!
    options: AnalysisOptionsInput
  }

  input VideoAnalysisInput {
    videoContent: String!
    options: AnalysisOptionsInput
  }

  input DocumentProcessingInput {
    documentContent: String!
    options: AnalysisOptionsInput
  }

  input SentimentAnalysisInput {
    content: String!
    options: AnalysisOptionsInput
  }

  input BatchAnalysisInput {
    contentItems: [String!]!
    options: AnalysisOptionsInput
  }

  # Queries
  type Query {
    # User queries
    me: User
    
    # Content analysis queries
    getVibeSummary(input: VibeAnalysisInput!): VibeSummary!
    getAnalysisStatus(workflowId: String!): AnalysisStatus!
    
    # Social media queries
    scrapeInstagram(tag: String!): InstagramData!
    scrapeTikTok(hashtag: String!, limit: Int): TikTokData!
    scrapeTikTokUser(username: String!): TikTokData!
    
    # History queries
    getUserHistory(userId: String!): [HistoryEntry!]!
  }

  # Mutations
  type Mutation {
    # Authentication mutations
    login(input: LoginInput!): AuthPayload!
    register(input: RegisterInput!): AuthPayload!
    
    # Legacy content analysis mutations
    analyzeContent(input: VibeAnalysisInput!): VibeSummary!
    
    # Comprehensive AI analysis mutations
    analyzeContentComprehensive(input: ContentAnalysisInput!): ComprehensiveAnalysisResult!
    analyzeVideo(input: VideoAnalysisInput!): ComprehensiveAnalysisResult!
    processDocument(input: DocumentProcessingInput!): ComprehensiveAnalysisResult!
    analyzeSentiment(input: SentimentAnalysisInput!): ComprehensiveAnalysisResult!
    analyzeBatch(input: BatchAnalysisInput!): [BatchAnalysisItem!]!
    
    # History mutations
    saveToHistory(userId: String!, query: String!, result: String!): HistoryEntry!
  }

  # Subscriptions (for future real-time features)
  type Subscription {
    contentAnalysisUpdated(userId: String!): VibeSummary!
  }
`;

module.exports = typeDefs;