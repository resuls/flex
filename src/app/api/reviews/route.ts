import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { API_CONSTANTS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';

// Types for API request/response
interface ReviewsQueryParams {
  search?: string;
  source?: string;
  status?: string;
  propertyId?: string;
  minRating?: string;
  maxRating?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: string;
  limit?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const {
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
  DEFAULT_PAGE_SIZE: DEFAULT_LIMIT,
  MAX_PAGE_SIZE: MAX_LIMIT,
} = API_CONSTANTS;

const DEFAULT_PAGE = 1;

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Extract and validate query parameters
    const {
      search,
      source,
      status,
      propertyId,
      minRating,
      maxRating,
      startDate,
      endDate,
      sortBy = DEFAULT_SORT_BY,
      sortOrder = DEFAULT_SORT_ORDER,
      page: pageParam = DEFAULT_PAGE.toString(),
      limit: limitParam = DEFAULT_LIMIT.toString(),
    }: ReviewsQueryParams = Object.fromEntries(searchParams.entries());

    // Parse and validate numeric parameters
    const page = Math.max(1, parseInt(pageParam, 10) || DEFAULT_PAGE);
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(limitParam, 10) || DEFAULT_LIMIT));

    // Build Prisma where clause with proper typing
    const where: Prisma.ReviewWhereInput = {};

    if (search) {
      where.OR = [
        { guestName: { contains: search, mode: 'insensitive' } },
        { publicReview: { contains: search, mode: 'insensitive' } },
        { propertyName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (source) {
      where.source = source;
    }

    if (status) {
      where.status = status;
    }

    if (propertyId) {
      where.propertyId = propertyId;
    }

    // Rating filter with validation
    if (minRating || maxRating) {
      where.rating = {};
      if (minRating) {
        const min = parseFloat(minRating);
        if (!isNaN(min)) where.rating.gte = min;
      }
      if (maxRating) {
        const max = parseFloat(maxRating);
        if (!isNaN(max)) where.rating.lte = max;
      }
    }

    // Date range filter with validation
    if (startDate || endDate) {
      where.submittedAt = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) where.submittedAt.gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) where.submittedAt.lte = end;
      }
    }

    // Build orderBy with proper typing
    const orderBy: Prisma.ReviewOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          categories: true,
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch reviews',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

interface UpdateReviewRequest {
  id: string;
  isApprovedForPublic?: boolean;
  managerNotes?: string;
}

export async function PATCH(request: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const body: UpdateReviewRequest = await request.json();
    const { id, isApprovedForPublic, managerNotes } = body;

    // Validate required fields
    if (!id || typeof id !== 'string') {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: ERROR_MESSAGES.VALIDATION },
        { status: 400 }
      );
    }

    // Validate optional fields
    if (isApprovedForPublic !== undefined && typeof isApprovedForPublic !== 'boolean') {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: ERROR_MESSAGES.VALIDATION },
        { status: 400 }
      );
    }

    if (managerNotes !== undefined && typeof managerNotes !== 'string') {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: ERROR_MESSAGES.VALIDATION },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: Prisma.ReviewUpdateInput = {};
    if (typeof isApprovedForPublic === 'boolean') {
      updateData.isApprovedForPublic = isApprovedForPublic;
    }
    if (managerNotes !== undefined) {
      updateData.managerNotes = managerNotes;
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: updateData,
      include: {
        categories: true,
      },
    });

    return NextResponse.json<ApiResponse<typeof updatedReview>>({
      success: true,
      data: updatedReview,
    });
  } catch (error) {
    console.error('Error updating review:', error);
    
    // Handle Prisma-specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json<ApiResponse<never>>(
          { success: false, error: 'Review not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json<ApiResponse<never>>(
      { 
        success: false, 
        error: 'Failed to update review',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
