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
      const reviewsWithRating = reviews.filter(r => 
        r.propertyId === stats.propertyId && r.rating !== null
      );
      
      stats.averageRating = reviewsWithRating.length > 0 
        ? reviewsWithRating.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewsWithRating.length
        : 0;

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
