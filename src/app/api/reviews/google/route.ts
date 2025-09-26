import { NextRequest, NextResponse } from 'next/server';
import { googlePlacesAPI, mockGoogleReviews, GoogleReview } from '@/lib/google-places';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const source = searchParams.get('source') || 'real';
    const propertyId = searchParams.get('propertyId');
    const forceMock = searchParams.get('forceMock') === 'true';
    const useMockData = process.env.USE_MOCK_DATA === 'true' || source === 'mock' || forceMock;

    console.log(`Google Reviews API called with source: ${source}, forceMock: ${forceMock}, useMockData: ${useMockData}`);

    // If specific property requested
    if (propertyId) {
      return await fetchPropertyGoogleReviews(propertyId, useMockData);
    }

    // Fetch reviews for all properties
    const properties = await prisma.review.findMany({
      select: {
        propertyId: true,
        propertyName: true,
      },
      distinct: ['propertyId'],
    });

    const allGoogleReviews = [];

    for (const property of properties) {
      const reviews = await fetchAndSaveGoogleReviews(
        property.propertyId,
        property.propertyName,
        useMockData
      );
      allGoogleReviews.push(...reviews);
    }

    return NextResponse.json({
      success: true,
      data: allGoogleReviews,
      source: useMockData ? 'mock' : 'google-places-api',
      count: allGoogleReviews.length,
    });
  } catch (error) {
    console.error('Error in Google Reviews API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Google reviews',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function fetchPropertyGoogleReviews(propertyId: string, useMockData: boolean) {
  try {
    // Get property name from existing reviews
    const existingReview = await prisma.review.findFirst({
      where: { propertyId },
      select: { propertyName: true },
    });

    if (!existingReview) {
      return NextResponse.json({
        success: false,
        error: 'Property not found',
      }, { status: 404 });
    }

    const reviews = await fetchAndSaveGoogleReviews(
      propertyId,
      existingReview.propertyName,
      useMockData
    );

    return NextResponse.json({
      success: true,
      data: reviews,
      source: useMockData ? 'mock' : 'google-places-api',
      count: reviews.length,
    });
  } catch (error) {
    console.error('Error fetching property Google reviews:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch property reviews',
      },
      { status: 500 }
    );
  }
}

async function fetchAndSaveGoogleReviews(propertyId: string, propertyName: string, useMockData: boolean) {
  let googleReviews: GoogleReview[];

  if (useMockData) {
    console.log('Using mock Google reviews data');
    googleReviews = mockGoogleReviews;
  } else {
    try {
      console.log(`Fetching Google reviews for property: ${propertyId}`);
      googleReviews = await googlePlacesAPI.getPropertyReviews(propertyId);

      // If no reviews from API and NOT using mock data, return empty array
      if (!googleReviews || googleReviews.length === 0) {
        console.log(`No Google reviews found for property: ${propertyId} (Real API mode)`);
        googleReviews = [];
      }
    } catch (error) {
      console.error(`Failed to fetch Google reviews for property ${propertyId}:`, error);
      // In real API mode, return empty array instead of mock data
      googleReviews = [];
    }
  }

  // Normalize and save reviews to database
  const normalizedReviews = [];

  for (const googleReview of googleReviews) {
    const normalizedReview = googlePlacesAPI.normalizeGoogleReview(
      googleReview,
      propertyId,
      propertyName
    );

    // Check if review already exists (by author name and time)
    const existingReview = await prisma.review.findFirst({
      where: {
        source: 'google',
        guestName: normalizedReview.guestName,
        submittedAt: normalizedReview.submittedAt,
        propertyId: propertyId,
      },
      include: {
        categories: true,
      },
    });

    if (existingReview) {
      normalizedReviews.push(existingReview);
      continue;
    }

    // Create new Google review
    const savedReview = await prisma.review.create({
      data: {
        source: normalizedReview.source,
        type: normalizedReview.type,
        status: normalizedReview.status,
        rating: normalizedReview.rating,
        overallRating: normalizedReview.overallRating,
        publicReview: normalizedReview.publicReview,
        privateReview: normalizedReview.privateReview,
        submittedAt: normalizedReview.submittedAt,
        guestName: normalizedReview.guestName,
        propertyId: normalizedReview.propertyId,
        propertyName: normalizedReview.propertyName,
        isApprovedForPublic: normalizedReview.isApprovedForPublic,
        managerNotes: normalizedReview.managerNotes,
        // Google reviews don't have categories, so we skip creating them
      },
      include: {
        categories: true,
      },
    });

    normalizedReviews.push(savedReview);
  }

  return normalizedReviews;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, propertyName, placeId } = body;

    if (!propertyId || !propertyName) {
      return NextResponse.json(
        {
          success: false,
          error: 'Property ID and name are required',
        },
        { status: 400 }
      );
    }

    let googlePlaceId = placeId;

    // If no place ID provided, try to find it
    if (!googlePlaceId) {
      googlePlaceId = await googlePlacesAPI.findPlaceIdForProperty(propertyName);
      
      if (!googlePlaceId) {
        return NextResponse.json({
          success: false,
          error: 'Could not find Google Place ID for this property',
        }, { status: 404 });
      }
    }

    // Fetch reviews for this specific place
    const reviews = await fetchAndSaveGoogleReviews(propertyId, propertyName, false);

    return NextResponse.json({
      success: true,
      data: reviews,
      placeId: googlePlaceId,
      count: reviews.length,
    });
  } catch (error) {
    console.error('Error in POST Google Reviews:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Google reviews',
      },
      { status: 500 }
    );
  }
}
