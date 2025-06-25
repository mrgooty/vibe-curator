// Main export file for Vibe Curator shared utilities
// This file exports all shared types, utilities, and constants

// Export all types
export * from './types';

// Export all utilities
export * from './utils';

// Export all constants
export * from './constants';

// Re-export commonly used items for convenience
export {
  // Types
  type ApiResponse,
  type SocialMediaPost,
  type ContentAnalysis,
  type AnalysisResult,
  type User,
  type UserPreferences,
  VibeCuratorError,
  
  // Utils
  validateSocialMediaUrl,
  extractPostIdFromUrl,
  formatNumber,
  formatDate,
  getSentimentColor,
  getSentimentEmoji,
  calculateVibeScore,
  removeDuplicates,
  chunkArray,
  isValidEmail,
  isValidUsername,
  createError,
  isVibeCuratorError,
  delay,
  retry,
  deepClone,
  omit,
  pick,
  
  // Constants
  API_CONFIG,
  PLATFORMS,
  PLATFORM_CONFIGS,
  ANALYSIS_TYPES,
  SENTIMENT_LABELS,
  SENTIMENT_COLORS,
  SENTIMENT_EMOJIS,
  ERROR_CODES,
  HTTP_STATUS,
  LIMITS,
  THEME,
  REGEX,
  FEATURES,
} from './types';