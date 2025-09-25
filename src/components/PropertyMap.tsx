'use client';

import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Train, Bus, Car, Coffee, ShoppingBag, Utensils } from 'lucide-react';

interface PropertyMapProps {
  propertyName: string;
  propertyId: string;
}

// Property coordinates based on property names (mock data for demo)
const getPropertyCoordinates = (propertyName: string) => {
  const coordinates: Record<string, { lat: number; lng: number; address: string }> = {
    '2b-n1-a---29-shoreditch-heights': {
      lat: 51.5200,
      lng: -0.0754,
      address: '29 Shoreditch Heights, London E1 6JQ, UK'
    },
    '1b-e2-b---45-canary-wharf-tower': {
      lat: 51.5054,
      lng: -0.0235,
      address: '45 Canary Wharf Tower, London E14 5AB, UK'
    },
    'studio-s3---12-kings-cross-central': {
      lat: 51.5308,
      lng: -0.1238,
      address: '12 Kings Cross Central, London N1C 4AX, UK'
    }
  };
  
  return coordinates[propertyName] || {
    lat: 51.5074,
    lng: -0.1278,
    address: 'Central London, UK'
  };
};

// Nearby amenities data
const getNearbyAmenities = (propertyName: string) => {
  const amenities: Record<string, Array<{ name: string; type: string; distance: string; icon: any }>> = {
    '2b-n1-a---29-shoreditch-heights': [
      { name: 'Shoreditch High Street Station', type: 'transport', distance: '2 min walk', icon: Train },
      { name: 'Old Street Station', type: 'transport', distance: '8 min walk', icon: Train },
      { name: 'Brick Lane', type: 'attraction', distance: '5 min walk', icon: MapPin },
      { name: 'Spitalfields Market', type: 'shopping', distance: '10 min walk', icon: ShoppingBag },
      { name: 'Boxpark Shoreditch', type: 'food', distance: '3 min walk', icon: Utensils }
    ],
    '1b-e2-b---45-canary-wharf-tower': [
      { name: 'Canary Wharf Station', type: 'transport', distance: '1 min walk', icon: Train },
      { name: 'Canary Wharf DLR', type: 'transport', distance: '2 min walk', icon: Train },
      { name: 'Canary Wharf Shopping Centre', type: 'shopping', distance: '3 min walk', icon: ShoppingBag },
      { name: 'Greenwich Park', type: 'attraction', distance: '15 min walk', icon: MapPin },
      { name: 'Billingsgate Market', type: 'food', distance: '8 min walk', icon: Utensils }
    ],
    'studio-s3---12-kings-cross-central': [
      { name: 'Kings Cross Station', type: 'transport', distance: '3 min walk', icon: Train },
      { name: 'St Pancras Station', type: 'transport', distance: '5 min walk', icon: Train },
      { name: 'British Library', type: 'attraction', distance: '2 min walk', icon: MapPin },
      { name: 'Coal Drops Yard', type: 'shopping', distance: '8 min walk', icon: ShoppingBag },
      { name: 'Granary Square', type: 'attraction', distance: '5 min walk', icon: MapPin }
    ]
  };
  
  return amenities[propertyName] || [];
};

const MapComponent = ({ propertyName, propertyId }: PropertyMapProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [marker, setMarker] = useState<google.maps.Marker>();
  const coordinates = getPropertyCoordinates(propertyId);
  const amenities = getNearbyAmenities(propertyId);

  useEffect(() => {
    if (ref.current && !map) {
      const mapInstance = new google.maps.Map(ref.current, {
        center: { lat: coordinates.lat, lng: coordinates.lng },
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      setMap(mapInstance);
    }
  }, [ref, map, coordinates]);

  useEffect(() => {
    if (map && !marker) {
      const markerInstance = new google.maps.Marker({
        position: { lat: coordinates.lat, lng: coordinates.lng },
        map: map,
        title: propertyName,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#3b82f6" stroke="#ffffff" stroke-width="2"/>
              <path d="M20 8 L26 20 L20 32 L14 20 Z" fill="#ffffff"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 20)
        }
      });
      setMarker(markerInstance);
    }
  }, [map, marker, coordinates, propertyName]);

  return <div ref={ref} className="w-full h-96 rounded-lg" />;
};

const render = (status: Status) => {
  if (status === Status.LOADING) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (status === Status.FAILURE) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="text-4xl mb-2">🗺️</div>
          <p>Map unavailable</p>
        </div>
      </div>
    );
  }

  return null;
};

export default function PropertyMap({ propertyName, propertyId }: PropertyMapProps) {
  const coordinates = getPropertyCoordinates(propertyId);
  const amenities = getNearbyAmenities(propertyId);
  const hasGoogleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && 
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY !== "AIzaSyBvOkBwJcTjqjqjqjqjqjqjqjqjqjqjqjqj";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Location & Nearby Amenities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Address */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">{coordinates.address}</p>
              <p className="text-sm text-blue-700 mt-1">
                Perfect location with excellent transport links and nearby amenities
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Interactive Map</h4>
          {hasGoogleMapsKey ? (
            <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} render={render}>
              <MapComponent propertyName={propertyName} propertyId={propertyId} />
            </Wrapper>
          ) : (
            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">🗺️</div>
                <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Google Maps integration would display the exact location, 
                  nearby amenities, and transport links.
                </p>
                <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg">
                  <strong>Note:</strong> To enable Google Maps, add your API key to the environment variables.
                  <br />
                  Set <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in your .env file.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Nearby Amenities */}
        {amenities.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Nearby Amenities</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {amenities.map((amenity, index) => {
                const IconComponent = amenity.icon;
                return (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <IconComponent className="h-4 w-4 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{amenity.name}</p>
                      <p className="text-xs text-gray-500">{amenity.distance}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {amenity.type}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Transport Links */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Transport Links</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <Train className="h-4 w-4 text-green-600" />
              <div>
                <p className="font-medium text-sm">Underground</p>
                <p className="text-xs text-gray-600">Multiple lines nearby</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Bus className="h-4 w-4 text-blue-600" />
              <div>
                <p className="font-medium text-sm">Bus Routes</p>
                <p className="text-xs text-gray-600">Frequent services</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
              <Car className="h-4 w-4 text-purple-600" />
              <div>
                <p className="font-medium text-sm">Road Access</p>
                <p className="text-xs text-gray-600">Easy parking</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
