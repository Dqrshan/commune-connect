'use client'

import { Navigation } from './Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    MapPin,
    Users,
    MessageSquare,
    Shield,
    Zap,
    Globe,
    Star,
    CheckCircle,
    ArrowRight,
    Smartphone,
    Bell,
    Crown,
    BarChart3
} from 'lucide-react'
import Link from 'next/link'

export function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <Navigation />

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 py-20">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8">
                            <MapPin className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Connect with Your Local Community
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Join a live, self-organizing network of local communities. Get real-time updates,
                            connect with neighbors, and stay informed about what's happening around you.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                <Link href="/auth/signin">
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <Link href="/communities">
                                    Browse Communities
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Everything You Need to Stay Connected</h2>
                        <p className="text-xl text-gray-600">Powerful features designed for modern community engagement</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <MapPin className="w-6 h-6 text-blue-600" />
                                </div>
                                <CardTitle>Location-Based Discovery</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Automatically discover communities near you based on your location.
                                    Stay connected with what's happening in your neighborhood.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <MessageSquare className="w-6 h-6 text-green-600" />
                                </div>
                                <CardTitle>Real-Time Chat</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Engage in real-time conversations with your neighbors.
                                    Share updates, ask questions, and build meaningful connections.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Zap className="w-6 h-6 text-purple-600" />
                                </div>
                                <CardTitle>AI-Powered Insights</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Get intelligent message analysis, automatic categorization,
                                    and smart response suggestions powered by advanced AI.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                                    <Bell className="w-6 h-6 text-yellow-600" />
                                </div>
                                <CardTitle>Smart Notifications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Stay informed with priority-based notifications.
                                    Never miss urgent community updates or important discussions.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                    <Shield className="w-6 h-6 text-red-600" />
                                </div>
                                <CardTitle>Safe & Secure</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Community moderation, verified users, and secure messaging
                                    ensure a safe environment for all members.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                    <Smartphone className="w-6 h-6 text-indigo-600" />
                                </div>
                                <CardTitle>Mobile Friendly</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Access your communities anywhere with our responsive design.
                                    Stay connected on desktop, tablet, or mobile.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
                        <p className="text-xl text-gray-600">Start free, upgrade when you need more features</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Free Plan */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl">Free</CardTitle>
                                <div className="text-4xl font-bold mt-4">$0</div>
                                <p className="text-gray-600">Perfect for getting started</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    {[
                                        'Join unlimited communities',
                                        'Real-time messaging',
                                        'Location-based discovery',
                                        'Basic notifications',
                                        'Mobile access'
                                    ].map((feature, index) => (
                                        <div key={index} className="flex items-center">
                                            <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                                            <span className="text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button className="w-full" variant="outline" asChild>
                                    <Link href="/auth/signin">Get Started</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Personal Plan */}
                        <Card className="border-0 shadow-xl border-2 border-blue-500 relative">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <Badge className="bg-blue-500 text-white px-4 py-1">
                                    <Star className="w-3 h-3 mr-1" />
                                    Most Popular
                                </Badge>
                            </div>
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl">Personal</CardTitle>
                                <div className="text-4xl font-bold mt-4">$9.99</div>
                                <p className="text-gray-600">Enhanced community experience</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    {[
                                        'Everything in Free',
                                        'AI-generated summaries',
                                        'Priority notifications',
                                        'Advanced search',
                                        'Export community data',
                                        'Premium support'
                                    ].map((feature, index) => (
                                        <div key={index} className="flex items-center">
                                            <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                                            <span className="text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white" asChild>
                                    <Link href="/auth/signin">Start Free Trial</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Business Plan */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl flex items-center justify-center">
                                    <Crown className="w-5 h-5 mr-2 text-purple-600" />
                                    Business
                                </CardTitle>
                                <div className="text-4xl font-bold mt-4">$29.99</div>
                                <p className="text-gray-600">For local businesses</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    {[
                                        'Everything in Personal',
                                        'Verified business badge',
                                        'Community partnerships',
                                        'Business analytics',
                                        'Promote services',
                                        'Dedicated support'
                                    ].map((feature, index) => (
                                        <div key={index} className="flex items-center">
                                            <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                                            <span className="text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button className="w-full" variant="outline" asChild>
                                    <Link href="/auth/signin">Contact Sales</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Connect with Your Community?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of neighbors already building stronger communities together.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                            <Link href="/auth/signin">
                                Start Building Community
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                            <Link href="/about">
                                Learn More
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <MapPin className="h-6 w-6 text-blue-400" />
                                <span className="text-xl font-bold">CommuneConnect</span>
                            </div>
                            <p className="text-gray-400">
                                Building stronger communities through technology and human connection.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Product</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                                <li><Link href="/communities" className="hover:text-white">Communities</Link></li>
                                <li><Link href="/subscription" className="hover:text-white">Pricing</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Company</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/about" className="hover:text-white">About</Link></li>
                                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Support</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
                                <li><Link href="/status" className="hover:text-white">Status</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 CommuneConnect. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}