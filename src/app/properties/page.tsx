'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Building2, Users, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { PropertyStats } from '@/lib/types';
import Link from 'next/link';
import { getMainPropertyImage } from '@/lib/property-images';
import Image from 'next/image';

export default function HotelsPage() {
  // Fetch property stats
  const { data: propertiesData, isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const response = await fetch('/api/properties');
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    },
  });

  const properties: PropertyStats[] = propertiesData?.data || [];

  // Calculate overall stats
  const totalProperties = properties.length;
  const totalReviews = properties.reduce((sum, p) => sum + p.totalReviews, 0);
  const averageRating = properties.length > 0 
    ? properties.reduce((sum, p) => sum + p.averageRating, 0) / properties.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hotels Dashboard</h1>
              <p className="text-gray-600">Manage and analyze hotel reviews</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hotels</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProperties}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReviews}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {properties.length > 0 
                  ? properties.reduce((max, p) => p.averageRating > max.averageRating ? p : max).propertyName.split(' ').slice(0, 2).join(' ')
                  : 'N/A'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties Table */}
        <Card>
          <CardHeader>
            <CardTitle>Properties Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {propertiesLoading ? (
              <div className="text-center py-8">Loading properties...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Hotel</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Image</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Rating</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Reviews</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Approved</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Pending</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Performance</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property) => {
                      const getPerformanceColor = (rating: number) => {
                        if (rating >= 8) return 'text-green-600 bg-green-50';
                        if (rating >= 6) return 'text-yellow-600 bg-yellow-50';
                        return 'text-red-600 bg-red-50';
                      };

                      const getPerformanceIcon = (rating: number) => {
                        if (rating >= 8) return <TrendingUp className="h-4 w-4" />;
                        if (rating >= 6) return <TrendingUp className="h-4 w-4" />;
                        return <TrendingDown className="h-4 w-4" />;
                      };

                      return (
                        <tr key={property.propertyId} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-semibold text-gray-900">{property.propertyName}</div>
                              <div className="text-sm text-gray-500">ID: {property.propertyId}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="relative w-16 h-12 rounded-lg overflow-hidden">
                              <Image
                                src={getMainPropertyImage(property.propertyId)}
                                alt={property.propertyName}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{property.averageRating.toFixed(1)}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="font-medium">{property.totalReviews}</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              {property.approvedReviews}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Badge variant="secondary">
                              {property.pendingReviews}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${getPerformanceColor(property.averageRating)}`}>
                              {getPerformanceIcon(property.averageRating)}
                              {property.averageRating >= 8 ? 'Excellent' : property.averageRating >= 6 ? 'Good' : 'Needs Improvement'}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex gap-2">
                              <Link href={`/properties/${property.propertyId}`}>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Dashboard
                                </Button>
                              </Link>
                              <Link href={`/property/${property.propertyId}`}>
                                <Button size="sm" variant="outline">
                                  Public Page
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
