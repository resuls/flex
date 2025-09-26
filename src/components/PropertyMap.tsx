'use client';

import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { useEffect, useRef, useState } from 'react';

interface PropertyMapProps {
  propertyName: string;
  propertyId: string;
}

// Google Maps types
interface GoogleMap {
  setCenter: (center: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
}

interface GoogleMarker {
  setPosition: (position: { lat: number; lng: number }) => void;
  setMap: (map: GoogleMap | null) => void;
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


const MapComponent = ({ propertyName, propertyId }: PropertyMapProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<GoogleMap>();
  const [marker, setMarker] = useState<GoogleMarker>();
  const coordinates = getPropertyCoordinates(propertyId);

  useEffect(() => {
    if (ref.current && !map) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapInstance = new (window as any).google.maps.Map(ref.current, {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const markerInstance = new (window as any).google.maps.Marker({
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          scaledSize: new (window as any).google.maps.Size(40, 40),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          anchor: new (window as any).google.maps.Point(20, 20)
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

  return (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center text-gray-600">
        <div className="text-4xl mb-2">🗺️</div>
        <p>Loading map...</p>
      </div>
    </div>
  );
};

export default function PropertyMap({ propertyName, propertyId }: PropertyMapProps) {
  const hasGoogleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div className="space-y-4">
      {hasGoogleMapsKey ? (
        <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} render={render}>
          <MapComponent propertyName={propertyName} propertyId={propertyId} />
        </Wrapper>
      ) : (
        <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-lg font-semibold mb-2">Map</h3>
            <p className="text-gray-600 text-sm mb-4">
              Google Maps integration would display the exact location.
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
  );
}
