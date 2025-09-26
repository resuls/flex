import type { ReviewSource, ReviewType, ReviewStatus } from './constants';

/**
 * Main review entity representing a guest review from any source
 */
export interface Review {
  /** Unique identifier for the review */
  id: string;
  /** Source platform where the review originated */
  source: ReviewSource;
  /** Type of review (guest-to-host or host-to-guest) */
  type: ReviewType;
  /** Current status of the review */
  status: ReviewStatus;
  /** Numeric rating (scale varies by source) */
  rating: number | null;
  /** Overall rating (normalized if needed) */
  overallRating?: number;
  /** Public review text visible to guests */
  publicReview: string;
  /** Private review text (if any) */
  privateReview?: string;
  /** Date when the review was submitted */
  submittedAt: Date;
  /** Name of the guest who wrote the review */
  guestName: string;
  /** Unique identifier for the property */
  propertyId: string;
  /** Human-readable property name */
  propertyName: string;
  /** Whether the review is approved for public display */
  isApprovedForPublic: boolean;
  /** Internal notes from property managers */
  managerNotes?: string;
  /** Category-specific ratings */
  categories: ReviewCategory[];
  /** Record creation timestamp */
  createdAt: Date;
  /** Record last update timestamp */
  updatedAt: Date;
}

/**
 * Category-specific rating within a review
 */
export interface ReviewCategory {
  /** Unique identifier for the category rating */
  id: string;
  /** Reference to the parent review */
  reviewId: string;
  /** Category name (e.g., 'cleanliness', 'location') */
  category: string;
  /** Numeric rating for this category */
  rating: number;
}

/**
 * Property entity representing a rental property
 */
export interface Property {
  /** Unique identifier for the property */
  id: string;
  /** Property display name */
  name: string;
  /** Physical address (optional) */
  address?: string;
  /** Property description (optional) */
  description?: string;
  /** Record creation timestamp */
  createdAt: Date;
  /** Record last update timestamp */
  updatedAt: Date;
}

// === External API Types ===

/**
 * Response format from Hostaway Reviews API
 */
export interface HostawayReviewResponse {
  /** API response status */
  status: string;
  /** Array of review data */
  result: HostawayReview[];
}

/**
 * Individual review data from Hostaway API
 */
export interface HostawayReview {
  /** Hostaway review ID */
  id: number;
  /** Review type */
  type: string;
  /** Review status */
  status: string;
  /** Overall rating (1-10 scale) */
  rating: number | null;
  /** Public review text */
  publicReview: string;
  /** Category-specific ratings */
  reviewCategory: {
    category: string;
    rating: number;
  }[];
  /** Submission timestamp (string format) */
  submittedAt: string;
  /** Guest name */
  guestName: string;
  /** Property listing name */
  listingName: string;
}

// === UI and Filter Types ===

/**
 * Filter options for review queries
 */
export interface ReviewFilters {
  /** Text search query */
  search?: string;
  /** Rating range [min, max] */
  rating?: [number, number];
  /** Review source filter */
  source?: string;
  /** Review status filter */
  status?: string;
  /** Date range filter */
  dateRange?: [Date, Date];
  /** Property ID filter */
  propertyId?: string;
}

/**
 * Aggregated statistics for a property
 */
export interface PropertyStats {
  /** Property unique identifier */
  propertyId: string;
  /** Property display name */
  propertyName: string;
  /** Total number of reviews */
  totalReviews: number;
  /** Overall average rating (normalized to 5-star scale) */
  averageRating: number;
  /** Average Google rating (5-star scale) */
  googleAverageRating: number;
  /** Average Hostaway rating (10-star scale) */
  hostawayAverageRating: number;
  /** Number of Google reviews */
  googleReviewCount: number;
  /** Number of Hostaway reviews */
  hostawayReviewCount: number;
  /** Number of approved reviews */
  approvedReviews: number;
  /** Number of pending reviews */
  pendingReviews: number;
  /** Average ratings by category */
  categoryAverages: Record<string, number>;
}

// === Utility Types ===

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = any> {
  /** Whether the request was successful */
  success: boolean;
  /** Response data (if successful) */
  data?: T;
  /** Error message (if unsuccessful) */
  error?: string;
  /** Additional error details */
  details?: string;
  /** Pagination info (for paginated responses) */
  pagination?: PaginationInfo;
}

/**
 * Pagination information for API responses
 */
export interface PaginationInfo {
  /** Current page number */
  page: number;
  /** Items per page */
  limit: number;
  /** Total number of items */
  total: number;
  /** Total number of pages */
  pages: number;
}

/**
 * Coordinates for map display
 */
export interface Coordinates {
  /** Latitude */
  lat: number;
  /** Longitude */
  lng: number;
  /** Human-readable address */
  address?: string;
}
