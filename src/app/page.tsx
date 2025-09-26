import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Building2, Star, Users, TrendingUp, MapPin, CheckCircle, Eye, ArrowRight } from "lucide-react";
import { getMainPropertyImage } from "@/lib/property-images";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Resulkary Saparov</h1>
                <p className="text-sm text-gray-600">Reviews Dashboard</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard">
                <Button variant="outline">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Manager Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 text-sm font-medium">
              Property Management System
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comprehensive Review
              <span className="block text-gray-700">Management Platform</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Streamline your property review workflow with powerful analytics, 
              seamless Hostaway integration, and professional guest review displays.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Open Manager Dashboard
                </Button>
              </Link>
              <Link href="/property/2b-n1-a-29-shoreditch-heights">
                <Button size="lg" variant="outline">
                  <Eye className="mr-2 h-5 w-5" />
                  View Demo Property
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need to manage reviews
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From data collection to public display, streamline your entire review workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg font-semibold">Review Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Approve, reject, and manage guest reviews from multiple sources including Hostaway and Google.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg font-semibold">Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Comprehensive analytics with rating distributions, category performance, and trend analysis.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg font-semibold">Performance Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Monitor property performance with detailed metrics, comparisons, and actionable insights.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-amber-600" />
              </div>
              <CardTitle className="text-lg font-semibold">Public Display</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Beautiful, responsive review displays on property pages with professional Flex Living branding.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to streamline your review management?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Get started with the manager dashboard and see how easy it is to manage, 
              analyze, and display your property reviews.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Try Manager Dashboard
                </Button>
              </Link>
              <Link href="/property/2b-n1-a-29-shoreditch-heights">
                <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-gray-900 transition-all duration-200">
                  <Eye className="mr-2 h-5 w-5" />
                  View Property Example
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Properties */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Demo Properties</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how reviews are displayed on actual property pages with real guest feedback
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/property/2b-n1-a-29-shoreditch-heights" className="group">
              <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={getMainPropertyImage('2b-n1-a-29-shoreditch-heights')}
                    alt="29 Shoreditch Heights - Main view"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                      2 Bedroom
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold group-hover:text-gray-700 transition-colors">
                    29 Shoreditch Heights
                  </CardTitle>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Shoreditch, London</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">8.5/10</span>
                      <span className="text-gray-500 text-sm">3 reviews</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/property/1b-e2-b-45-canary-wharf-tower" className="group">
              <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={getMainPropertyImage('1b-e2-b-45-canary-wharf-tower')}
                    alt="45 Canary Wharf Tower - Main view"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                      1 Bedroom
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold group-hover:text-gray-700 transition-colors">
                    45 Canary Wharf Tower
                  </CardTitle>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Canary Wharf, London</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">8.5/10</span>
                      <span className="text-gray-500 text-sm">2 reviews</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/property/studio-s3-12-kings-cross-central" className="group">
              <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={getMainPropertyImage('studio-s3-12-kings-cross-central')}
                    alt="12 Kings Cross Central - Main view"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                      Studio
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold group-hover:text-gray-700 transition-colors">
                    12 Kings Cross Central
                  </CardTitle>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Kings Cross, London</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">10.0/10</span>
                      <span className="text-gray-500 text-sm">1 review</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
