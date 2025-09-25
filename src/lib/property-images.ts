// All available property images
export const allPropertyImages = [
  '/property-pictures/spacejoy-AAy5l4-oFuw-unsplash.webp',
  '/property-pictures/spacejoy-nEtpvJjnPVo-unsplash.webp',
  '/property-pictures/lotus-design-n-print-g51F6-WYzyU-unsplash.webp',
  '/property-pictures/minh-pham-OtXADkUh3-I-unsplash.webp',
  '/property-pictures/backbone-L4iRkKL5dng-unsplash.webp',
  '/property-pictures/collov-home-design--aDGbdTsBZg-unsplash.webp',
  '/property-pictures/patrick-perkins-3wylDrjxH-E-unsplash.webp',
];

// Property image mapping - assigns specific images to each property
export const propertyImageMap: Record<string, string[]> = {
  '2b-n1-a-29-shoreditch-heights': [
    '/property-pictures/spacejoy-AAy5l4-oFuw-unsplash.webp', // Main property image
    '/property-pictures/spacejoy-nEtpvJjnPVo-unsplash.webp', // Bedroom
    '/property-pictures/lotus-design-n-print-g51F6-WYzyU-unsplash.webp', // Living area
    '/property-pictures/minh-pham-OtXADkUh3-I-unsplash.webp', // Kitchen
    '/property-pictures/backbone-L4iRkKL5dng-unsplash.webp', // Bathroom
    '/property-pictures/collov-home-design--aDGbdTsBZg-unsplash.webp', // Additional view
    '/property-pictures/patrick-perkins-3wylDrjxH-E-unsplash.webp', // Additional view
  ],
  '1b-e2-b-45-canary-wharf-tower': [
    '/property-pictures/collov-home-design--aDGbdTsBZg-unsplash.webp', // Main property image
    '/property-pictures/patrick-perkins-3wylDrjxH-E-unsplash.webp', // Bedroom
    '/property-pictures/spacejoy-AAy5l4-oFuw-unsplash.webp', // Living area
    '/property-pictures/lotus-design-n-print-g51F6-WYzyU-unsplash.webp', // Kitchen
    '/property-pictures/backbone-L4iRkKL5dng-unsplash.webp', // Bathroom
    '/property-pictures/spacejoy-nEtpvJjnPVo-unsplash.webp', // Additional view
    '/property-pictures/minh-pham-OtXADkUh3-I-unsplash.webp', // Additional view
  ],
  'studio-s3-12-kings-cross-central': [
    '/property-pictures/spacejoy-nEtpvJjnPVo-unsplash.webp', // Main property image
    '/property-pictures/minh-pham-OtXADkUh3-I-unsplash.webp', // Studio space
    '/property-pictures/lotus-design-n-print-g51F6-WYzyU-unsplash.webp', // Kitchen area
    '/property-pictures/backbone-L4iRkKL5dng-unsplash.webp', // Bathroom
    '/property-pictures/spacejoy-AAy5l4-oFuw-unsplash.webp', // Additional view
    '/property-pictures/collov-home-design--aDGbdTsBZg-unsplash.webp', // Additional view
    '/property-pictures/patrick-perkins-3wylDrjxH-E-unsplash.webp', // Additional view
  ],
};

// Default images for properties not in the map
export const defaultPropertyImages = [
  '/property-pictures/spacejoy-AAy5l4-oFuw-unsplash.webp',
  '/property-pictures/spacejoy-nEtpvJjnPVo-unsplash.webp',
  '/property-pictures/lotus-design-n-print-g51F6-WYzyU-unsplash.webp',
  '/property-pictures/minh-pham-OtXADkUh3-I-unsplash.webp',
];

// Get images for a specific property
export function getPropertyImages(propertyId: string): string[] {
  return propertyImageMap[propertyId] || defaultPropertyImages;
}

// Get the main property image (first image)
export function getMainPropertyImage(propertyId: string): string {
  const images = getPropertyImages(propertyId);
  return images[0] || defaultPropertyImages[0];
}
