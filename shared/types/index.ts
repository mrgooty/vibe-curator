// Shared TypeScript types and interfaces for Vibe Curator
// Used by both backend and frontend applications

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Social Media Platform Types
export type SocialPlatform = 'instagram' | 'tiktok';

export interface SocialMediaPost {
  id: string;
  platform: SocialPlatform;
  url: string;
  caption?: string;
  author: {
    username: string;
    displayName?: string;
    profilePicture?: string;
  };
  metrics: {
    likes: number;
    comments: number;
    shares?: number;
    views?: number;
  };
  createdAt: string;
  mediaType: 'image' | 'video' | 'carousel';
  mediaUrls: string[];
  hashtags: string[];
  mentions: string[];
}

// AI Analysis Types
export interface SentimentAnalysis {
  score: number; // -1 to 1 scale
  label: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0 to 1 scale
}

export interface ContentAnalysis {
  sentiment: SentimentAnalysis;
  topics: string[];
  keywords: string[];
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
  };
  vibeScore: number; // 0 to 100 scale
}

export interface AnalysisResult {
  postId: string;
  analysis: ContentAnalysis;
  processedAt: string;
  processingTime: number; // in milliseconds
}

// GraphQL Types
export interface GraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: string[];
  extensions?: Record<string, any>;
}

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: GraphQLError[];
}

// User and Session Types
export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  profilePicture?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  platforms: SocialPlatform[];
  analysisTypes: ('sentiment' | 'topics' | 'emotions' | 'vibe')[];
  notifications: boolean;
  theme: 'light' | 'dark' | 'auto';
}

// Apify Integration Types
export interface ApifyRunInput {
  urls: string[];
  resultsLimit?: number;
  addParentData?: boolean;
}

export interface ApifyRunResult {
  id: string;
  status: 'READY' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';
  startedAt: string;
  finishedAt?: string;
  defaultDatasetId: string;
  stats: {
    inputBodyLen: number;
    restartCount: number;
    resurrectCount: number;
    memAvgBytes: number;
    memMaxBytes: number;
    memCurrentBytes: number;
    cpuAvgUsage: number;
    cpuMaxUsage: number;
    cpuCurrentUsage: number;
    netRxBytes: number;
    netTxBytes: number;
    durationMillis: number;
    runTimeSecs: number;
    metamorph: number;
    computeUnits: number;
  };
}

// Configuration Types
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  features: {
    realTimeAnalysis: boolean;
    batchProcessing: boolean;
    exportData: boolean;
  };
  limits: {
    maxPostsPerRequest: number;
    maxAnalysisHistory: number;
    rateLimitPerMinute: number;
  };
}

// Error Types
export class VibeCuratorError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'VibeCuratorError';
  }
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: string;
  path: string;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;