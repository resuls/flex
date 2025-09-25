import { NextRequest, NextResponse } from 'next/server';
import { hostawayAPI, mockHostawayReviews } from '@/lib/hostaway';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const source = searchParams.get('source') || 'real';
    const useMockData = process.env.USE_MOCK_DATA === 'true' || source === 'mock';

    let hostawayReviews;
    
    if (useMockData) {
      console.log('Using mock data for Hostaway reviews');
      hostawayReviews = mockHostawayReviews;
    } else {
      try {
        console.log('Attempting to fetch real Hostaway reviews');
        hostawayReviews = await hostawayAPI.getReviews();
        
        // If no reviews returned from API, fall back to mock data
        if (!hostawayReviews || hostawayReviews.length === 0) {
          console.log('No reviews from API, falling back to mock data');
          hostawayReviews = mockHostawayReviews;
        }
      } catch (error) {
        console.error('Failed to fetch from Hostaway API, using mock data:', error);
        hostawayReviews = mockHostawayReviews;
      }
    }

    // Normalize and save reviews to database
    const normalizedReviews = [];
    
    for (const hostawayReview of hostawayReviews) {
      const normalizedReview = hostawayAPI.normalizeReview(hostawayReview);
      
      // Check if review already exists
      const existingReview = await prisma.review.findFirst({
        where: {
          source: 'hostaway',
          guestName: normalizedReview.guestName,
          submittedAt: normalizedReview.submittedAt,
          propertyName: normalizedReview.propertyName,
        },
        include: {
          categories: true,
        },
      });

      if (existingReview) {
        normalizedReviews.push(existingReview);
        continue;
      }

      // Create new review
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
          categories: {
            create: normalizedReview.categories.map(cat => ({
              category: cat.category,
              rating: cat.rating,
            })),
          },
        },
        include: {
          categories: true,
        },
      });

      normalizedReviews.push(savedReview);
    }

    return NextResponse.json({
      success: true,
      data: normalizedReviews,
      source: useMockData ? 'mock' : 'api',
      count: normalizedReviews.length,
    });
  } catch (error) {
    console.error('Error in Hostaway reviews API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch and process reviews',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
