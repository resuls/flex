'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Star, TrendingUp, TrendingDown, Users, CheckCircle, Clock, AlertTriangle, ArrowLeft, Building2, Calendar as CalendarIcon } from 'lucide-react';
import { ReviewFilters, Review, PropertyStats } from '@/lib/types';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Link from 'next/link';
import { use } from 'react';

interface HotelDashboardProps {
  params: Promise<{ id: string }>;
}

export default function HotelDashboard({ params }: HotelDashboardProps) {
  const { id } = use(params);
  const [filters, setFilters] = useState<ReviewFilters>({ propertyId: id });
  const [selectedReviews, setSelectedReviews] = useState<Set<string>>(new Set());
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const queryClient = useQueryClient();

  // Handle date changes
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    updateDateRange(date, endDate);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    updateDateRange(startDate, date);
  };

  const updateDateRange = (start: Date | undefined, end: Date | undefined) => {
    if (start && end) {
      setFilters(prev => ({ ...prev, dateRange: [start, end] }));
    } else if (start) {
      setFilters(prev => ({ ...prev, dateRange: [start, new Date()] }));
    } else if (end) {
      setFilters(prev => ({ ...prev, dateRange: [new Date(0), end] }));
    } else {
      setFilters(prev => ({ ...prev, dateRange: undefined }));
    }
  };

  const clearDateFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setFilters(prev => ({ ...prev, dateRange: undefined }));
  };

  // Fetch reviews for this specific hotel
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.source) params.append('source', filters.source);
      if (filters.status) params.append('status', filters.status);
      if (filters.propertyId) params.append('propertyId', filters.propertyId);
      if (filters.rating?.[0]) params.append('minRating', filters.rating[0].toString());
      if (filters.rating?.[1]) params.append('maxRating', filters.rating[1].toString());
      if (filters.dateRange?.[0]) params.append('startDate', filters.dateRange[0].toISOString());
      if (filters.dateRange?.[1]) params.append('endDate', filters.dateRange[1].toISOString());
      
      const response = await fetch(`/api/reviews?${params}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    },
  });

  // Fetch property stats
  const { data: propertiesData, isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const response = await fetch('/api/properties');
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    },
  });

  // Update review approval
  const { mutate: updateReview } = useMutation({
    mutationFn: async ({ id, isApprovedForPublic, managerNotes }: { id: string; isApprovedForPublic?: boolean; managerNotes?: string }) => {
      const response = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApprovedForPublic, managerNotes }),
      });
      if (!response.ok) throw new Error('Failed to update review');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property-reviews'] });
      toast.success('Review updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update review: ' + error.message);
    },
  });

  const reviews: Review[] = reviewsData?.data || [];
  const properties: PropertyStats[] = propertiesData?.data || [];
  const currentProperty = properties.find(p => p.propertyId === id);

  // Calculate overview stats
  const totalReviews = reviews.length;
  const approvedReviews = reviews.filter(r => r.isApprovedForPublic).length;
  const pendingReviews = reviews.filter(r => !r.isApprovedForPublic).length;

  // Separate Google and Hostaway reviews
  const googleReviews = reviews.filter(r => r.source === 'google');
  const hostawayReviews = reviews.filter(r => r.source === 'hostaway');

  // Calculate separate averages for each source
  const googleAverageRating = googleReviews.length > 0 
    ? googleReviews.filter(r => r.rating).reduce((sum, r) => {
        const rating = r.rating || 0;
        // Google ratings are typically 1-5, normalize to 5-star scale
        const normalizedRating = rating > 5 ? rating / 2 : rating;
        return sum + Math.min(normalizedRating, 5);
      }, 0) / googleReviews.filter(r => r.rating).length
    : 0;

  const hostawayAverageRating = hostawayReviews.length > 0 
    ? hostawayReviews.filter(r => r.rating).reduce((sum, r) => sum + (r.rating || 0), 0) / hostawayReviews.filter(r => r.rating).length
    : 0;

  // Overall average (normalized to 5-star scale)
  const averageRating = reviews.length > 0 
    ? reviews.filter(r => r.rating).reduce((sum, r) => {
        const rating = r.rating || 0;
        // Normalize ratings to 5-star scale: Google (1-5) stays same, Hostaway (1-10) gets divided by 2
        const normalizedRating = r.source === 'google' ? rating : rating / 2;
        return sum + normalizedRating;
      }, 0) / reviews.filter(r => r.rating).length
    : 0;

  // Prepare chart data
  const ratingDistribution = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => ({
    rating,
    count: reviews.filter(r => Math.floor(r.rating || 0) === rating).length,
  }));

  const categoryData = reviews.reduce((acc, review) => {
    review.categories.forEach(cat => {
      if (!acc[cat.category]) {
        acc[cat.category] = { category: cat.category, total: 0, count: 0 };
      }
      acc[cat.category].total += cat.rating;
      acc[cat.category].count += 1;
    });
    return acc;
  }, {} as Record<string, { category: string; total: number; count: number }>);

  const categoryAverages = Object.values(categoryData).map(cat => ({
    category: cat.category,
    average: cat.count > 0 ? cat.total / cat.count : 0,
  }));

  return (
    <>
      <style jsx global>{`
        .date-picker-popover {
          background-color: white !important;
        }
        .date-picker-popover * {
          background-color: white !important;
        }
      `}</style>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {currentProperty?.propertyName || 'Property Dashboard'}
              </h1>
              <p className="text-gray-600">Manage reviews for this specific property</p>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard">
                <Button variant="outline">
                  <Building2 className="mr-2 h-4 w-4" />
                  Manager Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReviews}</div>
              <div className="text-xs text-gray-500 mt-1">
                Google: {googleReviews.length} • Hostaway: {hostawayReviews.length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Google Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{googleAverageRating.toFixed(1)}/5</div>
              <div className="text-xs text-gray-500 mt-1">
                {googleReviews.length} reviews
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hostaway Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hostawayAverageRating.toFixed(1)}/10</div>
              <div className="text-xs text-gray-500 mt-1">
                {hostawayReviews.length} reviews
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{approvedReviews}</div>
              <div className="text-xs text-gray-500 mt-1">
                {pendingReviews} pending
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList>
            <TabsTrigger value="reviews">Reviews Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <Label htmlFor="source" className="text-sm font-medium text-gray-700 mb-2 block">
                      Source
                    </Label>
                    <Select value={filters.source || 'all'} onValueChange={(value) => setFilters(prev => ({ ...prev, source: value === 'all' ? undefined : value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All sources" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All sources</SelectItem>
                        <SelectItem value="hostaway">Hostaway</SelectItem>
                        <SelectItem value="google">Google Reviews</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="status" className="text-sm font-medium text-gray-700 mb-2 block">
                      Status
                    </Label>
                    <Select value={filters.status || 'all'} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === 'all' ? undefined : value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Start Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? startDate.toLocaleDateString() : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 !bg-white date-picker-popover" style={{ backgroundColor: 'white !important' }}>
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={handleStartDateChange}
                          captionLayout="dropdown"
                          fromYear={2020}
                          toYear={2030}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      End Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? endDate.toLocaleDateString() : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 !bg-white date-picker-popover" style={{ backgroundColor: 'white !important' }}>
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={handleEndDateChange}
                          captionLayout="dropdown"
                          fromYear={2020}
                          toYear={2030}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Active Filter Indicator */}
                {(startDate || endDate) && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-800">
                        <CalendarIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Showing reviews from: {startDate ? startDate.toLocaleDateString() : 'beginning'} to {endDate ? endDate.toLocaleDateString() : 'now'}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearDateFilters}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Clear Dates
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews List */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="text-center py-8">Loading reviews...</div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={review.source === 'hostaway' ? 'default' : review.source === 'google' ? 'outline' : 'secondary'}>
                                {review.source === 'hostaway' ? 'Hostaway' : review.source === 'google' ? 'Google Reviews' : review.source}
                              </Badge>
                              <Badge variant={review.isApprovedForPublic ? 'default' : 'secondary'}>
                                {review.isApprovedForPublic ? 'Approved' : 'Pending'}
                              </Badge>
                              {review.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">{review.rating}/10</span>
                                </div>
                              )}
                            </div>
                            <h3 className="font-semibold">{review.guestName}</h3>
                            <p className="text-gray-700">{review.publicReview}</p>
                            {review.categories.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {review.categories.map((cat) => (
                                  <Badge key={cat.id} variant="outline">
                                    {cat.category}: {cat.rating}/10
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={review.isApprovedForPublic}
                                onCheckedChange={(checked) => 
                                  updateReview({ id: review.id, isApprovedForPublic: checked })
                                }
                              />
                              <Label>Public</Label>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Submitted: {new Date(review.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rating Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Rating Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ratingDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="rating" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Averages */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={categoryAverages}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis angle={90} domain={[0, 10]} />
                      <Radar
                        name="Average Rating"
                        dataKey="average"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  );
}
