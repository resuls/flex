'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Wifi, Car, Coffee, Tv, Users } from 'lucide-react';
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
  const { data: reviewsData } = useQuery({
    queryKey: ['property-reviews', id],
    queryFn: async () => {
      const response = await fetch(`/api/reviews?propertyId=${id}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    },
  });

  const allReviews: Review[] = reviewsData?.data || [];
  const approvedReviews = allReviews.filter(review => review.isApprovedForPublic);
  const googleReviews = approvedReviews.filter(review => review.source === 'google');
  const hostawayReviews = approvedReviews.filter(review => review.source === 'hostaway');
  const propertyName = allReviews[0]?.propertyName || 'Property';
  
  // Get property images
  const propertyImages = getPropertyImages(id);

  // Calculate separate averages for each source
  const googleAverageRating = googleReviews.length > 0 
    ? googleReviews.filter(r => r.rating).reduce((sum, r) => {
        const rating = r.rating || 0;
        // Ensure Google ratings are properly scaled to 5-star system
        const normalizedRating = rating > 5 ? rating / 2 : rating;
        return sum + Math.min(normalizedRating, 5); // Cap at 5
      }, 0) / googleReviews.filter(r => r.rating).length
    : 0;

  const hostawayAverageRating = hostawayReviews.length > 0 
    ? hostawayReviews.filter(r => r.rating).reduce((sum, r) => sum + (r.rating || 0), 0) / hostawayReviews.filter(r => r.rating).length
    : 0;




  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFDF6' }}>
      {/* Property Images with Preview - Full width hero */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ImagePreview 
            images={propertyImages} 
            propertyName={propertyName} 
          />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Header */}
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{propertyName}</h1>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">London, UK</span>
                </div>
              </div>
              
            </div>


            {/* About this property */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">About this property</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    Experience modern living in the heart of London with this beautifully designed apartment. 
                    Perfect for business travelers and leisure guests alike, this property offers contemporary 
                    amenities and excellent connectivity to London&apos;s key attractions and business districts.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    Located in a prime area, this stylish accommodation features high-quality furnishings, 
                    modern appliances, and thoughtful touches that ensure a comfortable stay. The space is 
                    designed to provide both functionality and comfort for short-term and extended stays.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    With easy access to public transport, restaurants, and local attractions, this property 
                    serves as an ideal base for exploring London while providing a peaceful retreat at the 
                    end of each day.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Amenities Section */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Amenities</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 py-3">
                    <Wifi className="h-6 w-6 text-gray-600" />
                    <span className="text-lg text-gray-700">Free WiFi</span>
                  </div>
                  <div className="flex items-center gap-4 py-3">
                    <Tv className="h-6 w-6 text-gray-600" />
                    <span className="text-lg text-gray-700">Smart TV</span>
                  </div>
                  <div className="flex items-center gap-4 py-3">
                    <Coffee className="h-6 w-6 text-gray-600" />
                    <span className="text-lg text-gray-700">Coffee Machine</span>
                  </div>
                  <div className="flex items-center gap-4 py-3">
                    <Car className="h-6 w-6 text-gray-600" />
                    <span className="text-lg text-gray-700">Parking Available</span>
                  </div>
                  <div className="flex items-center gap-4 py-3">
                    <Users className="h-6 w-6 text-gray-600" />
                    <span className="text-lg text-gray-700">Suitable for Groups</span>
                  </div>
                  <div className="flex items-center gap-4 py-3">
                    <MapPin className="h-6 w-6 text-gray-600" />
                    <span className="text-lg text-gray-700">Central Location</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stay Policies */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Stay Policies</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Check-in & Check-out</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                      <div>
                        <span className="font-medium">Check-in:</span> After 3:00 PM
                      </div>
                      <div>
                        <span className="font-medium">Check-out:</span> Before 11:00 AM
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">House Rules</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• No smoking inside the property</li>
                      <li>• No pets allowed</li>
                      <li>• No parties or events</li>
                      <li>• Quiet hours: 10:00 PM - 8:00 AM</li>
                      <li>• Maximum occupancy as stated in booking</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Valid ID required at check-in</li>
                      <li>• Security deposit may be required</li>
                      <li>• Property is professionally cleaned between stays</li>
                      <li>• 24/7 guest support available</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cancellation Policy */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Cancellation Policy</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Flexible Cancellation</h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium">Free cancellation</span> up to 24 hours before check-in
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium">50% refund</span> for cancellations made within 24 hours of check-in
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-medium">No refund</span> for cancellations made after check-in time
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Cancellation policies may vary based on booking dates and length of stay. 
                      Please review your booking confirmation for specific terms.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            {approvedReviews.length > 0 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>
                  <div className="flex flex-wrap gap-6">
                    {googleReviews.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-lg">{googleAverageRating.toFixed(1)}/5</span>
                        <span className="text-gray-600">({googleReviews.length} Google)</span>
                      </div>
                    )}
                    
                    {hostawayReviews.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-lg">{hostawayAverageRating.toFixed(1)}/10</span>
                        <span className="text-gray-600">({hostawayReviews.length} Hostaway)</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Tabs defaultValue="google" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="google" className="flex items-center gap-2">
                      <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50 text-xs">
                        Google
                      </Badge>
                      <span>({googleReviews.length} reviews)</span>
                    </TabsTrigger>
                    <TabsTrigger value="hostaway" className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        Hostaway
                      </Badge>
                      <span>({hostawayReviews.length} reviews)</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="google" className="mt-6">
                    {googleReviews.length > 0 ? (
                      <div className="space-y-6">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-5 w-5 ${
                                    i < googleAverageRating
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                            <span className="font-bold text-xl">{googleAverageRating.toFixed(1)}/5</span>
                            <span className="text-gray-600">({googleReviews.length} reviews)</span>
                          </div>
                        </div>
                        
                        <div className="space-y-8">
                          {googleReviews.map((review) => (
                            <div key={review.id} className="space-y-4">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="font-semibold text-gray-700">
                                    {review.guestName.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="font-semibold text-lg">{review.guestName}</span>
                                    <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                                      Google
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-4 mb-3">
                                    {review.rating && (
                                      <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => {
                                          // Normalize Google rating to 5-star scale
                                          const normalizedRating = (review.rating && review.rating > 5) ? review.rating / 2 : (review.rating || 0);
                                          const cappedRating = Math.min(normalizedRating, 5);
                                          return (
                                            <Star 
                                              key={i} 
                                              className={`h-4 w-4 ${
                                                i < cappedRating
                                                  ? 'fill-yellow-400 text-yellow-400' 
                                                  : 'text-gray-300'
                                              }`} 
                                            />
                                          );
                                        })}
                                      </div>
                                    )}
                                    <span className="text-gray-600">
                                      {new Date(review.submittedAt).toLocaleDateString('en-GB', {
                                        year: 'numeric',
                                        month: 'long'
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 text-lg leading-relaxed">{review.publicReview}</p>
                                  {review.categories.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                      {review.categories.map((cat) => {
                                        // Normalize Google category ratings to 5-star scale
                                        const normalizedCatRating = cat.rating > 5 ? cat.rating / 2 : cat.rating;
                                        const cappedCatRating = Math.min(normalizedCatRating, 5);
                                        return (
                                          <Badge key={cat.id} variant="secondary" className="text-sm">
                                            {cat.category}: {cappedCatRating.toFixed(1)}/5
                                          </Badge>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No Google reviews available.</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="hostaway" className="mt-6">
                    {hostawayReviews.length > 0 ? (
                      <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-xl">{hostawayAverageRating.toFixed(1)}/10</span>
                            <span className="text-gray-600">({hostawayReviews.length} reviews)</span>
                          </div>
                        </div>
                        
                        <div className="space-y-8">
                          {hostawayReviews.map((review) => (
                            <div key={review.id} className="space-y-4">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="font-semibold text-gray-700">
                                    {review.guestName.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="font-semibold text-lg">{review.guestName}</span>
                                    <Badge className="bg-blue-100 text-blue-800">
                                      Hostaway
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-4 mb-3">
                                    {review.rating && (
                                      <div className="flex items-center gap-1">
                                        {[...Array(10)].map((_, i) => (
                                          <Star 
                                            key={i} 
                                            className={`h-3 w-3 ${
                                              i < (review.rating || 0)
                                                ? 'fill-yellow-400 text-yellow-400' 
                                                : 'text-gray-300'
                                            }`} 
                                          />
                                        ))}
                                        <span className="ml-2 text-sm text-gray-600 font-medium">
                                          {review.source === 'google' 
                                            ? `${((review.rating || 0) / 2).toFixed(1)}/5` 
                                            : `${review.rating || 0}/10`
                                          }
                                        </span>
                                      </div>
                                    )}
                                    <span className="text-gray-600">
                                      {new Date(review.submittedAt).toLocaleDateString('en-GB', {
                                        year: 'numeric',
                                        month: 'long'
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 text-lg leading-relaxed">{review.publicReview}</p>
                                  {review.categories.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                      {review.categories.map((cat) => (
                                        <Badge key={cat.id} variant="secondary" className="text-sm">
                                          {cat.category}: {review.source === 'google' ? `${(cat.rating / 2).toFixed(1)}/5` : `${cat.rating}/10`}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No Hostaway reviews available.</p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Location Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Location</h2>
              <PropertyMap propertyName={propertyName} propertyId={id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Booking Card */}
            <div className="sticky top-8" style={{ marginTop: '100px' }}>
              <Card className="shadow-xl border-0">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-2">From £120/night</div>
                      <p className="text-gray-600">Available for booking</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="border border-gray-300 rounded-lg p-3">
                          <div className="text-xs font-semibold text-gray-700 uppercase">Check-in</div>
                          <div className="text-sm text-gray-600">Add date</div>
                        </div>
                        <div className="border border-gray-300 rounded-lg p-3">
                          <div className="text-xs font-semibold text-gray-700 uppercase">Check-out</div>
                          <div className="text-sm text-gray-600">Add date</div>
                        </div>
                      </div>
                      <div className="border border-gray-300 rounded-lg p-3">
                        <div className="text-xs font-semibold text-gray-700 uppercase">Guests</div>
                        <div className="text-sm text-gray-600">1 guest</div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full py-3 text-lg font-semibold text-white"
                      style={{ backgroundColor: '#284E4C' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1F3A38'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#284E4C'}
                    >
                      Reserve
                    </Button>
                    
                    <p className="text-center text-sm text-gray-600">
                      You won&apos;t be charged yet
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
