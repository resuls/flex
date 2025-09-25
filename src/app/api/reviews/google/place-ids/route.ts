import { NextRequest, NextResponse } from 'next/server';
import { googlePlacesAPI } from '@/lib/google-places';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const refresh = searchParams.get('refresh') === 'true';

    if (refresh) {
      // Force refresh all Place IDs
      const propertyAddresses = googlePlacesAPI.getPropertyAddresses();
      const discoveredIds: Record<string, string> = {};

      for (const [propertyId, info] of Object.entries(propertyAddresses)) {
        console.log(`Refreshing Place ID for ${propertyId}...`);
        const placeId = await googlePlacesAPI.findPlaceIdForProperty(info.name, info.address);
        if (placeId) {
          googlePlacesAPI.setPlaceId(propertyId, placeId);
          discoveredIds[propertyId] = placeId;
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          propertyAddresses,
          discoveredPlaceIds: discoveredIds,
          refreshed: true,
        },
      });
    } else {
      // Just return current state
      return NextResponse.json({
        success: true,
        data: {
          propertyAddresses: googlePlacesAPI.getPropertyAddresses(),
          discoveredPlaceIds: googlePlacesAPI.getDiscoveredPlaceIds(),
          refreshed: false,
        },
      });
    }
  } catch (error) {
    console.error('Error in Place IDs API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Place IDs',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, placeId } = body;

    if (!propertyId || !placeId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Property ID and Place ID are required',
        },
        { status: 400 }
      );
    }

    // Manually set Place ID
    googlePlacesAPI.setPlaceId(propertyId, placeId);

    return NextResponse.json({
      success: true,
      message: `Place ID ${placeId} set for property ${propertyId}`,
      data: {
        propertyId,
        placeId,
        discoveredPlaceIds: googlePlacesAPI.getDiscoveredPlaceIds(),
      },
    });
  } catch (error) {
    console.error('Error setting Place ID:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to set Place ID',
      },
      { status: 500 }
    );
  }
}
