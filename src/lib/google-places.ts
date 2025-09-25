import axios from 'axios';
import { Review } from './types';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;
const GOOGLE_PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

export interface GooglePlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  reviews?: GoogleReview[];
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface GoogleReview {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface GooglePlacesResponse {
  result: GooglePlaceDetails;
  status: string;
}

export interface GooglePlacesSearchResponse {
  results: Array<{
    place_id: string;
    name: string;
    formatted_address: string;
    rating?: number;
    user_ratings_total?: number;
  }>;
  status: string;
}

// Property addresses for Place ID lookup (matching actual property IDs from Hostaway data)
const PROPERTY_ADDRESSES: Record<string, { name: string; address: string }> = {
  '2b-n1-a-29-shoreditch-heights': {
    name: '29 Shoreditch Heights',
    address: '29 Shoreditch High Street, London E1 6JQ, UK'
  },
  '1b-e2-b-45-canary-wharf-tower': {
    name: '45 Canary Wharf Tower',
    address: '45 Bank Street, Canary Wharf, London E14 5AB, UK'
  },
  'studio-s3-12-kings-cross-central': {
    name: '12 Kings Cross Central',
    address: '12 Pancras Square, Kings Cross, London N1C 4AG, UK'
  },
  'wembley-stadium': {
    name: 'Wembley Stadium',
    address: 'Wembley Stadium, Wembley HA9 0WS, UK'
  }
};

// Cache for discovered Place IDs (will be populated dynamically)
let DISCOVERED_PLACE_IDS: Record<string, string> = {};

export class GooglePlacesAPI {
  private client = axios.create({
    baseURL: GOOGLE_PLACES_BASE_URL,
  });

  /**
   * Search for a place by name and address
   */
  async searchPlace(query: string): Promise<GooglePlacesSearchResponse> {
    try {
      const response = await this.client.get('/textsearch/json', {
        params: {
          query,
          key: GOOGLE_PLACES_API_KEY,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error searching Google Places:', error);
      throw error;
    }
  }

  /**
   * Get place details including reviews
   */
  async getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
    try {
      const response = await this.client.get<GooglePlacesResponse>('/details/json', {
        params: {
          place_id: placeId,
          fields: 'name,formatted_address,rating,user_ratings_total,reviews,geometry',
          key: GOOGLE_PLACES_API_KEY,
        },
      });

      if (response.data.status === 'OK') {
        return response.data.result;
      } else {
        console.error('Google Places API error:', response.data.status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
      throw error;
    }
  }

  /**
   * Get reviews for a property by property ID
   */
  async getPropertyReviews(propertyId: string): Promise<GoogleReview[]> {
    // First try cached Place ID
    let placeId: string | null = DISCOVERED_PLACE_IDS[propertyId] || null;
    
    // If no cached Place ID, try to find it
    if (!placeId) {
      const propertyInfo = PROPERTY_ADDRESSES[propertyId];
      if (propertyInfo) {
        console.log(`Finding Place ID for property: ${propertyId}`);
        const foundPlaceId = await this.findPlaceIdForProperty(propertyInfo.name, propertyInfo.address);
        
        if (foundPlaceId) {
          // Cache the discovered Place ID
          placeId = foundPlaceId;
          DISCOVERED_PLACE_IDS[propertyId] = foundPlaceId;
          console.log(`Found and cached Place ID for ${propertyId}: ${foundPlaceId}`);
        }
      }
    }
    
    if (!placeId) {
      console.warn(`No Google Place ID found for property: ${propertyId}`);
      return [];
    }

    const placeDetails = await this.getPlaceDetails(placeId);
    return placeDetails?.reviews || [];
  }

  /**
   * Normalize Google review to our Review schema
   */
  normalizeGoogleReview(googleReview: GoogleReview, propertyId: string, propertyName: string): Omit<Review, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      source: 'google',
      type: 'guest-to-host',
      status: 'published', // Google reviews are already published
      rating: googleReview.rating * 2, // Convert 1-5 to 1-10 scale
      overallRating: googleReview.rating * 2,
      publicReview: googleReview.text,
      privateReview: undefined,
      submittedAt: new Date(googleReview.time * 1000), // Convert Unix timestamp
      guestName: googleReview.author_name,
      propertyId,
      propertyName,
      isApprovedForPublic: false, // Manager needs to approve
      managerNotes: undefined,
      categories: [], // Google doesn't provide category ratings
    };
  }

  /**
   * Find place ID for a property by searching
   */
  async findPlaceIdForProperty(propertyName: string, address?: string): Promise<string | null> {
    const query = address ? `${propertyName} ${address}` : propertyName;
    
    try {
      console.log(`Searching for place: "${query}"`);
      const searchResponse = await this.searchPlace(query);
      
      if (searchResponse.status === 'OK' && searchResponse.results.length > 0) {
        const placeId = searchResponse.results[0].place_id;
        console.log(`Found Place ID: ${placeId} for query: "${query}"`);
        return placeId;
      }
      
      console.log(`No place found for query: "${query}"`);
      return null;
    } catch (error) {
      console.error('Error finding place ID:', error);
      return null;
    }
  }

  /**
   * Get all discovered Place IDs (for debugging)
   */
  getDiscoveredPlaceIds(): Record<string, string> {
    return { ...DISCOVERED_PLACE_IDS };
  }

  /**
   * Manually set a Place ID for a property (for testing)
   */
  setPlaceId(propertyId: string, placeId: string): void {
    DISCOVERED_PLACE_IDS[propertyId] = placeId;
  }

  /**
   * Get property addresses for reference
   */
  getPropertyAddresses(): Record<string, { name: string; address: string }> {
    return { ...PROPERTY_ADDRESSES };
  }
}

// Mock Google reviews for demonstration (when API limits are reached)
export const mockGoogleReviews: GoogleReview[] = [
  {
    author_name: 'David Smith',
    language: 'en',
    rating: 5,
    relative_time_description: '2 weeks ago',
    text: 'Excellent location and service. The apartment was spotless and the host was very responsive. Highly recommend for business travelers.',
    time: Math.floor(Date.now() / 1000) - (14 * 24 * 60 * 60), // 2 weeks ago
  },
  {
    author_name: 'Maria Rodriguez',
    language: 'en',
    rating: 4,
    relative_time_description: '1 month ago',
    text: 'Great stay overall. The location is perfect for exploring London. Only minor issue was the WiFi was occasionally slow.',
    time: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60), // 1 month ago
  },
  {
    author_name: 'John Anderson',
    language: 'en',
    rating: 5,
    relative_time_description: '2 months ago',
    text: 'Outstanding property! Modern, clean, and perfectly located. The host went above and beyond to ensure our comfort.',
    time: Math.floor(Date.now() / 1000) - (60 * 24 * 60 * 60), // 2 months ago
  },
];

export const googlePlacesAPI = new GooglePlacesAPI();
