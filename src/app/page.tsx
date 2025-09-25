import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Building2, Star, Users } from "lucide-react";
import { getMainPropertyImage } from "@/lib/property-images";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Flex Living</h1>
            </div>
            <div className="flex gap-4">
              <Link href="/dashboard">
                <Button>Manager Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Reviews Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive review management system for Flex Living properties. 
            Analyze guest feedback, manage public reviews, and track property performance.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <BarChart3 className="mr-2 h-5 w-5" />
                Open Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Review Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Approve, reject, and manage guest reviews from multiple sources including Hostaway.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Comprehensive analytics with rating distributions, category performance, and trends.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-600" />
                Property Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Track individual property performance with detailed metrics and comparisons.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Public Display
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Showcase approved reviews on property pages with Flex Living branding.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Properties */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Demo Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/property/2b-n1-a-29-shoreditch-heights">
              <Card className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={getMainPropertyImage('2b-n1-a-29-shoreditch-heights')}
                    alt="29 Shoreditch Heights - Main view"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">29 Shoreditch Heights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">2 Bedroom Apartment in Shoreditch</p>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">8.5/10</span>
                    <span className="text-gray-500">• 3 reviews</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/property/1b-e2-b-45-canary-wharf-tower">
              <Card className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={getMainPropertyImage('1b-e2-b-45-canary-wharf-tower')}
                    alt="45 Canary Wharf Tower - Main view"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">45 Canary Wharf Tower</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">1 Bedroom Apartment in Canary Wharf</p>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">8.5/10</span>
                    <span className="text-gray-500">• 2 reviews</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/property/studio-s3-12-kings-cross-central">
              <Card className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={getMainPropertyImage('studio-s3-12-kings-cross-central')}
                    alt="12 Kings Cross Central - Main view"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">12 Kings Cross Central</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Studio Apartment in Kings Cross</p>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">10.0/10</span>
                    <span className="text-gray-500">• 1 review</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Flex Living. Reviews Dashboard built with Next.js, TypeScript, and Tailwind CSS.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
