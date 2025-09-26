/**
 * Application-wide constants and configuration
 */

// API Configuration
export const API_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 100,
  MAX_PAGE_SIZE: 1000,
  DEFAULT_SORT_ORDER: 'desc' as const,
  DEFAULT_SORT_BY: 'submittedAt' as const,
} as const;

// Review Sources
export const REVIEW_SOURCES = {
  HOSTAWAY: 'hostaway',
  GOOGLE: 'google',
} as const;

// Review Types
export const REVIEW_TYPES = {
  GUEST_TO_HOST: 'guest-to-host',
  HOST_TO_GUEST: 'host-to-guest',
} as const;

// Review Statuses
export const REVIEW_STATUSES = {
  PUBLISHED: 'published',
  PENDING: 'pending',
  REJECTED: 'rejected',
} as const;

// Rating Scales
export const RATING_SCALES = {
  GOOGLE_MIN: 1,
  GOOGLE_MAX: 5,
  HOSTAWAY_MIN: 1,
  HOSTAWAY_MAX: 10,
  NORMALIZED_MIN: 1,
  NORMALIZED_MAX: 5,
} as const;

// Property Configuration
export const PROPERTY_CONSTANTS = {
  DEFAULT_COORDINATES: {
    lat: 51.5074,
    lng: -0.1278,
    address: 'Central London, UK',
  },
  IMAGE_PLACEHOLDER: '/property-pictures/spacejoy-AAy5l4-oFuw-unsplash.webp',
} as const;

// UI Constants
export const UI_CONSTANTS = {
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300,
  MAX_PROPERTY_IMAGES: 10,
} as const;

// Environment Configuration
export const ENV_CONFIG = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  useMockData: process.env.USE_MOCK_DATA === 'true',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred',
  VALIDATION: 'Invalid input provided',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  NETWORK: 'Network error occurred',
  API_LIMIT_EXCEEDED: 'API rate limit exceeded',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  REVIEW_UPDATED: 'Review updated successfully',
  REVIEW_APPROVED: 'Review approved for public display',
  REVIEW_REJECTED: 'Review rejected',
  DATA_SYNCED: 'Data synchronized successfully',
} as const;

// Type exports for better TypeScript support
export type ReviewSource = typeof REVIEW_SOURCES[keyof typeof REVIEW_SOURCES];
export type ReviewType = typeof REVIEW_TYPES[keyof typeof REVIEW_TYPES];
export type ReviewStatus = typeof REVIEW_STATUSES[keyof typeof REVIEW_STATUSES];
export type SortOrder = 'asc' | 'desc';
