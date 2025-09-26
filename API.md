# API Documentation

This document describes the REST API endpoints available in the Reviews Dashboard application.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

Currently, the API does not require authentication. In production, consider implementing API key authentication or JWT tokens.

## Response Format

All API responses follow this standard format:

```json
{
  "success": boolean,
  "data": any,
  "error": string,
  "details": string,
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "pages": number
  }
}
```

## Endpoints

### Reviews

#### GET /api/reviews

Fetch reviews with optional filtering and pagination.

**Query Parameters:**
- `search` (string): Search in guest names, review text, or property names
- `source` (string): Filter by review source (`hostaway`, `google`)
- `status` (string): Filter by review status (`published`, `pending`, `rejected`)
- `propertyId` (string): Filter by specific property ID
- `minRating` (number): Minimum rating filter
- `maxRating` (number): Maximum rating filter
- `startDate` (ISO string): Start date for date range filter
- `endDate` (ISO string): End date for date range filter
- `sortBy` (string): Sort field (default: `submittedAt`)
- `sortOrder` (string): Sort order (`asc`, `desc`, default: `desc`)
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 100, max: 1000)

**Example Request:**
```bash
GET /api/reviews?source=hostaway&status=published&page=1&limit=10
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cm123456789",
      "source": "hostaway",
      "type": "guest-to-host",
      "status": "published",
      "rating": 9,
      "overallRating": 9,
      "publicReview": "Amazing stay! Very clean and well-located.",
      "submittedAt": "2024-08-21T22:45:14.000Z",
      "guestName": "Sarah Johnson",
      "propertyId": "2b-n1-a-29-shoreditch-heights",
      "propertyName": "2B N1 A - 29 Shoreditch Heights",
      "isApprovedForPublic": true,
      "categories": [
        {
          "id": "cat123",
          "category": "cleanliness",
          "rating": 10
        }
      ],
      "createdAt": "2024-08-21T22:45:14.000Z",
      "updatedAt": "2024-08-21T22:45:14.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### PATCH /api/reviews

Update review approval status or manager notes.

**Request Body:**
```json
{
  "id": "cm123456789",
  "isApprovedForPublic": true,
  "managerNotes": "Excellent review, approved for display"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "cm123456789",
    "isApprovedForPublic": true,
    "managerNotes": "Excellent review, approved for display",
    // ... other review fields
  }
}
```

### Hostaway Reviews

#### GET /api/reviews/hostaway

Sync reviews from Hostaway API and store in database.

**Query Parameters:**
- `source` (string): Data source (`real`, `mock`)

**Example Request:**
```bash
GET /api/reviews/hostaway?source=real
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    // Array of normalized review objects
  ],
  "source": "api",
  "count": 5
}
```

### Google Reviews

#### GET /api/reviews/google

Sync reviews from Google Places API.

**Query Parameters:**
- `propertyId` (string): Specific property ID to sync
- `forceMock` (boolean): Force use of mock data

**Example Request:**
```bash
GET /api/reviews/google?propertyId=2b-n1-a-29-shoreditch-heights
```

#### POST /api/reviews/google

Manually sync Google reviews for a property.

**Request Body:**
```json
{
  "propertyId": "2b-n1-a-29-shoreditch-heights",
  "propertyName": "29 Shoreditch Heights",
  "placeId": "ChIJd7qhkH8cdkgRActualPlaceID"
}
```

### Properties

#### GET /api/properties

Get aggregated property statistics.

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "propertyId": "2b-n1-a-29-shoreditch-heights",
      "propertyName": "2B N1 A - 29 Shoreditch Heights",
      "totalReviews": 15,
      "averageRating": 8.5,
      "googleAverageRating": 4.2,
      "hostawayAverageRating": 8.5,
      "googleReviewCount": 3,
      "hostawayReviewCount": 12,
      "approvedReviews": 10,
      "pendingReviews": 5,
      "categoryAverages": {
        "cleanliness": 9.2,
        "communication": 8.8,
        "location": 9.5,
        "value": 8.1
      }
    }
  ]
}
```

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

### Common Error Messages

- `"Invalid input provided"` - Validation error
- `"Resource not found"` - Requested item doesn't exist
- `"Failed to fetch reviews"` - API or database error
- `"API rate limit exceeded"` - External API quota exceeded

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting for production use:

- Reviews endpoints: 100 requests/minute
- Sync endpoints: 10 requests/minute
- Properties endpoints: 50 requests/minute

## Data Types

### Review Object

```typescript
interface Review {
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
```

### Review Category Object

```typescript
interface ReviewCategory {
  id: string;
  reviewId: string;
  category: string;
  rating: number;
}
```

### Property Stats Object

```typescript
interface PropertyStats {
  propertyId: string;
  propertyName: string;
  totalReviews: number;
  averageRating: number;
  googleAverageRating: number;
  hostawayAverageRating: number;
  googleReviewCount: number;
  hostawayReviewCount: number;
  approvedReviews: number;
  pendingReviews: number;
  categoryAverages: Record<string, number>;
}
```

## Examples

### JavaScript/TypeScript

```typescript
// Fetch reviews
const response = await fetch('/api/reviews?source=hostaway&limit=10');
const { success, data, pagination } = await response.json();

if (success) {
  console.log('Reviews:', data);
  console.log('Total pages:', pagination.pages);
}

// Approve a review
const updateResponse = await fetch('/api/reviews', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'review-id',
    isApprovedForPublic: true,
    managerNotes: 'Approved for display'
  })
});

const result = await updateResponse.json();
```

### cURL

```bash
# Fetch reviews
curl -X GET "http://localhost:3000/api/reviews?source=hostaway&limit=10"

# Approve review
curl -X PATCH "http://localhost:3000/api/reviews" \
  -H "Content-Type: application/json" \
  -d '{"id":"review-id","isApprovedForPublic":true}'

# Sync Hostaway reviews
curl -X GET "http://localhost:3000/api/reviews/hostaway"
```

## Webhooks (Future)

Consider implementing webhooks for real-time updates:

- `review.created` - New review added
- `review.updated` - Review status changed
- `review.approved` - Review approved for public display
- `property.stats.updated` - Property statistics recalculated
