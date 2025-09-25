'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Wifi, Car, Coffee, Tv, Users, Calendar } from 'lucide-react';
import { Review } from '@/lib/types';
import { use } from 'react';
import PropertyMap from '@/components/PropertyMap';
import { getPropertyImages } from '@/lib/property-images';
import ImagePreview from '@/components/ImagePreview';

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const { id } = use(params);

  // Fetch approved reviews for this property
  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['property-reviews', id],
    queryFn: async () => {
      const response = await fetch(`/api/reviews?propertyId=${id}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    },
  });

  const allReviews: Review[] = reviewsData?.data || [];
  const approvedReviews = allReviews.filter(review => review.isApprovedForPublic);
  const propertyName = allReviews[0]?.propertyName || 'Property';
  
  // Get property images
  const propertyImages = getPropertyImages(id);

  // Calculate stats for approved reviews only
  const averageRating = approvedReviews.length > 0 
    ? approvedReviews.filter(r => r.rating).reduce((sum, r) => sum + (r.rating || 0), 0) / approvedReviews.filter(r => r.rating).length
    : 0;

  const categoryStats = approvedReviews.reduce((acc, review) => {
    review.categories.forEach(cat => {
      if (!acc[cat.category]) {
        acc[cat.category] = { total: 0, count: 0 };
      }
      acc[cat.category].total += cat.rating;
      acc[cat.category].count += 1;
    });
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const categoryAverages = Object.entries(categoryStats).map(([category, stats]) => ({
    category,
    average: stats.count > 0 ? stats.total / stats.count : 0,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Mimicking Flex Living Style */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Property Images with Preview */}
          <ImagePreview 
            images={propertyImages} 
            propertyName={propertyName} 
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Details */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{propertyName}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="h-4 w-4" />
                <span>London, UK</span>
              </div>
              
              {approvedReviews.length > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">{averageRating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-600">({approvedReviews.length} reviews)</span>
                </div>
              )}

              <p className="text-gray-700 leading-relaxed">
                Experience modern living in the heart of London with this beautifully designed apartment. 
                Perfect for business travelers and leisure guests alike, this property offers contemporary 
                amenities and excellent connectivity to London&apos;s key attractions and business districts.
              </p>
            </div>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-blue-600" />
                    <span>Free WiFi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tv className="h-5 w-5 text-blue-600" />
                    <span>Smart TV</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-blue-600" />
                    <span>Coffee Machine</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-blue-600" />
                    <span>Parking</span>
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Guest Reviews */}
            {approvedReviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Guest Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {approvedReviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="font-semibold">{review.guestName}</div>
                                <Badge 
                                  variant={review.source === 'google' ? 'outline' : 'default'}
                                  className={review.source === 'google' ? 'border-green-500 text-green-700' : ''}
                                >
                                  {review.source === 'google' ? 'Google' : 'Hostaway'}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4" />
                                {new Date(review.submittedAt).toLocaleDateString('en-GB', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>
                            {review.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">
                                  {review.source === 'google' ? (review.rating / 2).toFixed(1) : review.rating}/5
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.publicReview}</p>
                          {review.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {review.categories.map((cat) => (
                                <Badge key={cat.id} variant="outline" className="text-xs">
                                  {cat.category}: {cat.rating}/10
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Book This Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <div className="text-4xl mb-4">📅</div>
                  <h3 className="text-lg font-semibold mb-2">Booking System</h3>
                  <p className="text-gray-600 text-sm">
                    Integrated booking functionality would be implemented here, 
                    connecting to Flex Living&apos;s reservation system.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {approvedReviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Overall Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{averageRating.toFixed(1)}/10</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Reviews</span>
                    <span className="font-semibold">{approvedReviews.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Response Rate</span>
                    <span className="font-semibold text-green-600">100%</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location Map with Google Maps Integration */}
            <PropertyMap propertyName={propertyName} propertyId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
