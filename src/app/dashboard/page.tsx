'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Building2, Users, TrendingUp, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { PropertyStats } from '@/lib/types';
import Link from 'next/link';
import { getMainPropertyImage } from '@/lib/property-images';
import Image from 'next/image';

export default function Dashboard() {
  // Sorting state
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Fetch property stats
  const { data: propertiesData, isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const response = await fetch('/api/properties');
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    },
  });

  // Sort properties
  const sortedProperties = useMemo(() => {
    const properties: PropertyStats[] = propertiesData?.data || [];
    const sorted = [...properties].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.propertyName.toLowerCase();
          bValue = b.propertyName.toLowerCase();
          break;
        case 'googleRating':
          aValue = a.googleAverageRating;
          bValue = b.googleAverageRating;
          break;
        case 'hostawayRating':
          aValue = a.hostawayAverageRating;
          bValue = b.hostawayAverageRating;
          break;
        case 'totalReviews':
          aValue = a.totalReviews;
          bValue = b.totalReviews;
          break;
        case 'approvedReviews':
          aValue = a.approvedReviews;
          bValue = b.approvedReviews;
          break;
        case 'pendingReviews':
          aValue = a.pendingReviews;
          bValue = b.pendingReviews;
          break;
        default:
          aValue = a.averageRating;
          bValue = b.averageRating;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  }, [propertiesData?.data, sortBy, sortOrder]);

  // Calculate overall stats
  const totalProperties = sortedProperties.length;
  const totalReviews = sortedProperties.reduce((sum, p) => sum + p.totalReviews, 0);
  const averageRating = sortedProperties.length > 0 
    ? sortedProperties.reduce((sum, p) => sum + p.averageRating, 0) / sortedProperties.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Properties Dashboard</h1>
              <p className="text-gray-600">Manage and analyze property reviews</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
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
                {sortedProperties.length > 0 
                  ? sortedProperties.reduce((max, p) => p.averageRating > max.averageRating ? p : max).propertyName.split(' ').slice(0, 2).join(' ')
                  : 'N/A'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Properties Overview</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Sort by:</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select sort option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Property Name</SelectItem>
                      <SelectItem value="googleRating">Google Rating</SelectItem>
                      <SelectItem value="hostawayRating">Hostaway Rating</SelectItem>
                      <SelectItem value="totalReviews">Total Reviews</SelectItem>
                      <SelectItem value="approvedReviews">Approved Reviews</SelectItem>
                      <SelectItem value="pendingReviews">Pending Reviews</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center gap-2"
                >
                  {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {propertiesLoading ? (
              <div className="text-center py-8">Loading properties...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        <div className="flex items-center gap-2">
                          Property
                          {sortBy === 'name' && (
                            sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Image</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">
                        <div className="flex items-center justify-center gap-2">
                          Google Rating
                          {sortBy === 'googleRating' && (
                            sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">
                        <div className="flex items-center justify-center gap-2">
                          Hostaway Rating
                          {sortBy === 'hostawayRating' && (
                            sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">
                        <div className="flex items-center justify-center gap-2">
                          Total Reviews
                          {sortBy === 'totalReviews' && (
                            sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">
                        <div className="flex items-center justify-center gap-2">
                          Approved
                          {sortBy === 'approvedReviews' && (
                            sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">
                        <div className="flex items-center justify-center gap-2">
                          Pending
                          {sortBy === 'pendingReviews' && (
                            sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProperties.map((property) => {
                      return (
                        <tr key={property.propertyId} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-semibold text-gray-900">{property.propertyName}</div>
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
                            <div className="flex flex-col items-center gap-1">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold">{property.googleAverageRating.toFixed(1)}/5</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {property.googleReviewCount} reviews
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold">{property.hostawayAverageRating.toFixed(1)}/10</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {property.hostawayReviewCount} reviews
                              </div>
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