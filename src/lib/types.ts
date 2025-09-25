export interface Review {
  id: string;
  source: 'hostaway' | 'google';
  type: 'guest-to-host' | 'host-to-guest';
  status: 'published' | 'pending' | 'rejected';
  rating: number | null;
  overallRating?: number;
  publicReview: string;
  privateReview?: string;
  submittedAt: Date;
  guestName: string;
  propertyId: string;
  propertyName: string;
  isApprovedForPublic: boolean;
  managerNotes?: string;
  categories: ReviewCategory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewCategory {
  id: string;
  reviewId: string;
  category: string;
  rating: number;
}

export interface Property {
  id: string;
  name: string;
  address?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HostawayReviewResponse {
  status: string;
  result: HostawayReview[];
}

export interface HostawayReview {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: {
    category: string;
    rating: number;
  }[];
  submittedAt: string;
  guestName: string;
  listingName: string;
}

export interface ReviewFilters {
  search?: string;
  rating?: [number, number];
  source?: string;
  status?: string;
  dateRange?: [Date, Date];
  propertyId?: string;
}

export interface PropertyStats {
  propertyId: string;
  propertyName: string;
  totalReviews: number;
  averageRating: number;
  approvedReviews: number;
  pendingReviews: number;
  categoryAverages: Record<string, number>;
}
