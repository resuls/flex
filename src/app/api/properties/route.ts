import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PropertyStats } from '@/lib/types';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        categories: true,
      },
    });

    // Group reviews by property and calculate stats
    const propertyMap = new Map<string, PropertyStats>();

    for (const review of reviews) {
      const propertyId = review.propertyId;
      
      if (!propertyMap.has(propertyId)) {
        propertyMap.set(propertyId, {
          propertyId,
          propertyName: review.propertyName,
          totalReviews: 0,
          averageRating: 0,
          approvedReviews: 0,
          pendingReviews: 0,
          googleAverageRating: 0,
          hostawayAverageRating: 0,
          googleReviewCount: 0,
          hostawayReviewCount: 0,
          categoryAverages: {},
        });
      }

      const stats = propertyMap.get(propertyId)!;
      stats.totalReviews++;
      
      if (review.isApprovedForPublic) {
        stats.approvedReviews++;
      } else {
        stats.pendingReviews++;
      }

      // Calculate category averages
      for (const category of review.categories) {
        if (!stats.categoryAverages[category.category]) {
          stats.categoryAverages[category.category] = 0;
        }
        stats.categoryAverages[category.category] += category.rating;
      }
    }

    // Calculate final averages
    const properties = Array.from(propertyMap.values()).map(stats => {
      const propertyReviews = reviews.filter(r => r.propertyId === stats.propertyId);
      const googleReviews = propertyReviews.filter(r => r.source === 'google' && r.rating !== null);
      const hostawayReviews = propertyReviews.filter(r => r.source === 'hostaway' && r.rating !== null);
      
      // Calculate separate averages for each source
      stats.googleAverageRating = googleReviews.length > 0 
        ? googleReviews.reduce((sum, r) => {
            const rating = r.rating || 0;
            // Google ratings are typically 1-5, normalize to 5-star scale
            const normalizedRating = rating > 5 ? rating / 2 : rating;
            return sum + Math.min(normalizedRating, 5);
          }, 0) / googleReviews.length
        : 0;

      stats.hostawayAverageRating = hostawayReviews.length > 0 
        ? hostawayReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / hostawayReviews.length
        : 0;

      // Keep overall average for backward compatibility (normalized to 5-star scale)
      const allReviewsWithRating = propertyReviews.filter(r => r.rating !== null);
      stats.averageRating = allReviewsWithRating.length > 0 
        ? allReviewsWithRating.reduce((sum, r) => {
            const rating = r.rating || 0;
            // Normalize ratings to 5-star scale: Google (1-5) stays same, Hostaway (1-10) gets divided by 2
            const normalizedRating = r.source === 'google' ? rating : rating / 2;
            return sum + normalizedRating;
          }, 0) / allReviewsWithRating.length
        : 0;

      // Add review counts for each source
      stats.googleReviewCount = googleReviews.length;
      stats.hostawayReviewCount = hostawayReviews.length;

      // Finalize category averages
      Object.keys(stats.categoryAverages).forEach(category => {
        const categoryCount = reviews.filter(r => 
          r.propertyId === stats.propertyId && 
          r.categories.some(c => c.category === category)
        ).length;
        
        if (categoryCount > 0) {
          stats.categoryAverages[category] /= categoryCount;
        }
      });

      return stats;
    });

    return NextResponse.json({
      success: true,
      data: properties,
    });
  } catch (error) {
    console.error('Error fetching property stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch property statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
