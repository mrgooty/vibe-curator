// Shared constants for Vibe Curator
// Used by both backend and frontend applications

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// GraphQL Configuration
export const GRAPHQL_CONFIG = {
  ENDPOINT: '/graphql',
  SUBSCRIPTION_ENDPOINT: '/graphql/subscriptions',
  MAX_QUERY_DEPTH: 10,
  MAX_QUERY_COMPLEXITY: 1000,
} as const;

// Social Media Platforms
export const PLATFORMS = {
  INSTAGRAM: 'instagram',
  TIKTOK: 'tiktok',
} as const;

export const PLATFORM_CONFIGS = {
  [PLATFORMS.INSTAGRAM]: {
    name: 'Instagram',
    color: '#E4405F',
    icon: 'instagram',
    urlPattern: /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/(p|reel|tv)\/[A-Za-z0-9_-]+/,
    maxPostsPerRequest: 50,
  },
  [PLATFORMS.TIKTOK]: {
    name: 'TikTok',
    color: '#000000',
    icon: 'tiktok',
    urlPattern: /^https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com)\/@[A-Za-z0-9._-]+\/video\/\d+/,
    maxPostsPerRequest: 30,
  },
} as const;

// Analysis Types
export const ANALYSIS_TYPES = {
  SENTIMENT: 'sentiment',
  TOPICS: 'topics',
  EMOTIONS: 'emotions',
  VIBE: 'vibe',
} as const;

// Sentiment Labels
export const SENTIMENT_LABELS = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  NEUTRAL: 'neutral',
} as const;

export const SENTIMENT_COLORS = {
  [SENTIMENT_LABELS.POSITIVE]: '#4CAF50',
  [SENTIMENT_LABELS.NEGATIVE]: '#F44336',
  [SENTIMENT_LABELS.NEUTRAL]: '#FF9800',
} as const;

export const SENTIMENT_EMOJIS = {
  [SENTIMENT_LABELS.POSITIVE]: '😊',
  [SENTIMENT_LABELS.NEGATIVE]: '😞',
  [SENTIMENT_LABELS.NEUTRAL]: '😐',
} as const;

// Emotion Types
export const EMOTION_TYPES = {
  JOY: 'joy',
  SADNESS: 'sadness',
  ANGER: 'anger',
  FEAR: 'fear',
  SURPRISE: 'surprise',
  DISGUST: 'disgust',
} as const;

export const EMOTION_COLORS = {
  [EMOTION_TYPES.JOY]: '#FFD700',
  [EMOTION_TYPES.SADNESS]: '#4169E1',
  [EMOTION_TYPES.ANGER]: '#DC143C',
  [EMOTION_TYPES.FEAR]: '#800080',
  [EMOTION_TYPES.SURPRISE]: '#FF69B4',
  [EMOTION_TYPES.DISGUST]: '#228B22',
} as const;

// Media Types
export const MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  CAROUSEL: 'carousel',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  
  // Social Media Analysis
  ANALYSIS: {
    ANALYZE_POST: '/api/analyze/post',
    ANALYZE_BATCH: '/api/analyze/batch',
    GET_ANALYSIS: '/api/analysis/:id',
    LIST_ANALYSES: '/api/analyses',
    DELETE_ANALYSIS: '/api/analysis/:id',
  },
  
  // Apify Integration
  APIFY: {
    SCRAPE_INSTAGRAM: '/api/apify/instagram',
    SCRAPE_TIKTOK: '/api/apify/tiktok',
    GET_RUN_STATUS: '/api/apify/run/:id',
    GET_DATASET: '/api/apify/dataset/:id',
  },
  
  // Health Check
  HEALTH: '/health',
} as const;

// Error Codes
export const ERROR_CODES = {
  // General
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  
  // Authentication
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  
  // Social Media
  INVALID_URL: 'INVALID_URL',
  UNSUPPORTED_PLATFORM: 'UNSUPPORTED_PLATFORM',
  SCRAPING_FAILED: 'SCRAPING_FAILED',
  
  // Analysis
  ANALYSIS_FAILED: 'ANALYSIS_FAILED',
  ANALYSIS_NOT_FOUND: 'ANALYSIS_NOT_FOUND',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  
  // External APIs
  OPENAI_ERROR: 'OPENAI_ERROR',
  APIFY_ERROR: 'APIFY_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Application Limits
export const LIMITS = {
  MAX_POSTS_PER_REQUEST: 100,
  MAX_ANALYSIS_HISTORY: 1000,
  MAX_BATCH_SIZE: 50,
  MAX_URL_LENGTH: 2048,
  MAX_CAPTION_LENGTH: 2200,
  RATE_LIMIT_PER_MINUTE: 60,
  RATE_LIMIT_PER_HOUR: 1000,
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  TTL: {
    SHORT: 300, // 5 minutes
    MEDIUM: 1800, // 30 minutes
    LONG: 3600, // 1 hour
    VERY_LONG: 86400, // 24 hours
  },
  KEYS: {
    ANALYSIS_RESULT: 'analysis:result:',
    USER_PROFILE: 'user:profile:',
    APIFY_RUN: 'apify:run:',
    SOCIAL_POST: 'social:post:',
  },
} as const;

// Theme Configuration
export const THEME = {
  COLORS: {
    PRIMARY: '#6366F1',
    SECONDARY: '#8B5CF6',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#3B82F6',
    
    // Neutral colors
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    GRAY_50: '#F9FAFB',
    GRAY_100: '#F3F4F6',
    GRAY_200: '#E5E7EB',
    GRAY_300: '#D1D5DB',
    GRAY_400: '#9CA3AF',
    GRAY_500: '#6B7280',
    GRAY_600: '#4B5563',
    GRAY_700: '#374151',
    GRAY_800: '#1F2937',
    GRAY_900: '#111827',
  },
  
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    XXL: 48,
  },
  
  BORDER_RADIUS: {
    SM: 4,
    MD: 8,
    LG: 12,
    XL: 16,
    FULL: 9999,
  },
} as const;

// Regular Expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  HASHTAG: /#[a-zA-Z0-9_]+/g,
  MENTION: /@[a-zA-Z0-9_.]+/g,
  URL: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g,
} as const;

// Date Formats
export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  DATE_ONLY: 'YYYY-MM-DD',
  TIME_ONLY: 'HH:mm:ss',
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
} as const;

// Feature Flags
export const FEATURES = {
  REAL_TIME_ANALYSIS: process.env.FEATURE_REAL_TIME_ANALYSIS === 'true',
  BATCH_PROCESSING: process.env.FEATURE_BATCH_PROCESSING !== 'false',
  EXPORT_DATA: process.env.FEATURE_EXPORT_DATA !== 'false',
  ADVANCED_ANALYTICS: process.env.FEATURE_ADVANCED_ANALYTICS === 'true',
  NOTIFICATIONS: process.env.FEATURE_NOTIFICATIONS !== 'false',
} as const;