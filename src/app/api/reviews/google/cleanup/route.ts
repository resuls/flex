import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE() {
  try {
    // Delete mock reviews (identifiable by the mock names)
    const mockNames = ['David Smith', 'Maria Rodriguez', 'John Anderson'];
    
    const result = await prisma.review.deleteMany({
      where: {
        source: 'google',
        guestName: {
          in: mockNames
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.count} mock Google reviews`,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error('Error cleaning up mock reviews:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clean up mock reviews',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
