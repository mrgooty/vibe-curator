// Shared utility functions for Vibe Curator
// Used by both backend and frontend applications

import { SocialPlatform, SentimentAnalysis, VibeCuratorError } from '../types';

// URL Validation Utilities
export const validateSocialMediaUrl = (url: string): { isValid: boolean; platform?: SocialPlatform } => {
  const instagramRegex = /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/(p|reel|tv)\/[A-Za-z0-9_-]+/;
  const tiktokRegex = /^https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com)\/@[A-Za-z0-9._-]+\/video\/\d+/;

  if (instagramRegex.test(url)) {
    return { isValid: true, platform: 'instagram' };
  }
  
  if (tiktokRegex.test(url)) {
    return { isValid: true, platform: 'tiktok' };
  }

  return { isValid: false };
};

export const extractPostIdFromUrl = (url: string, platform: SocialPlatform): string | null => {
  try {
    if (platform === 'instagram') {
      const match = url.match(/\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);
      return match ? match[2] : null;
    }
    
    if (platform === 'tiktok') {
      const match = url.match(/\/video\/(\d+)/);
      return match ? match[1] : null;
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

// Data Formatting Utilities
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  return date.toLocaleDateString();
};

// Sentiment Analysis Utilities
export const getSentimentColor = (sentiment: SentimentAnalysis): string => {
  if (sentiment.label === 'positive') {
    return '#4CAF50'; // Green
  }
  if (sentiment.label === 'negative') {
    return '#F44336'; // Red
  }
  return '#FF9800'; // Orange for neutral
};

export const getSentimentEmoji = (sentiment: SentimentAnalysis): string => {
  if (sentiment.label === 'positive') {
    return '😊';
  }
  if (sentiment.label === 'negative') {
    return '😞';
  }
  return '😐';
};

export const calculateVibeScore = (
  sentimentScore: number,
  engagementRate: number,
  topicRelevance: number
): number => {
  // Normalize sentiment score from [-1, 1] to [0, 1]
  const normalizedSentiment = (sentimentScore + 1) / 2;
  
  // Weighted calculation
  const vibeScore = (
    normalizedSentiment * 0.4 +
    engagementRate * 0.4 +
    topicRelevance * 0.2
  ) * 100;
  
  return Math.round(Math.max(0, Math.min(100, vibeScore)));
};

// Array Utilities
export const removeDuplicates = <T>(array: T[], key?: keyof T): T[] => {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Validation Utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// Error Handling Utilities
export const createError = (
  message: string,
  code: string,
  statusCode: number = 500,
  details?: Record<string, any>
): VibeCuratorError => {
  return new VibeCuratorError(message, code, statusCode, details);
};

export const isVibeCuratorError = (error: any): error is VibeCuratorError => {
  return error instanceof VibeCuratorError;
};

// Async Utilities
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      await delay(delayMs * attempt);
    }
  }
  
  throw lastError!;
};

// Object Utilities
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
};

export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

export const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};