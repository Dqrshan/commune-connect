'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useLocation } from '../providers/LocationProvider'
import { CommunityCard } from '../components/CommunityCard'
import { PostFeed } from '../components/PostFeed'
import { Navigation } from '../components/Navigation'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
    MapPin,
    Users,
    TrendingUp,
    Zap,
    Globe,
    ArrowRight,
    Sparkles,
    Shield,
    Clock,
    CheckCircle,
    Star,
    MessageSquare,
    Bell,
    BarChart3
} from 'lucide-react'

interface Community {
    id: string
    name: string
    description: string
    memberCount: number
    distance: number
    isJoined: boolean
}

export function LandingPage() {
    const { data: session, status } = useSession()
    const { location, error: locationError } = useLocation()
    const [communities, setCommunities] = useState<Community[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (location && session) {
            fetchNearbyCommunities()
        }
    }, [location, session])

    const fetchNearbyCommunities = async () => {
        try {
            const response = await fetch('/api/communities/nearby', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                }),
            })
            const data = await response.json()
            setCommunities(data.communities || [])
        } catch (error) {
            console.error('Error fetching communities:', error)
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        )
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <Header />

                {/* Hero Section */}
                <section className="py-20 lg:py-32">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-4xl mx-auto">
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-6">
                                <Sparkles className="w-4 h-4 mr-2" />
                                AI-Powered Community Network
                            </Badge>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
                                Connect with Your
                                <br />
                                Local Community
                            </h1>

                            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                                Join a live, self-organizing network of local communities. Discover nearby groups,
                                share real-time updates, and get AI-powered insights to enhance your daily life.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                                <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transition-all" asChild>
                                    <Link href="/auth/signup">
                                        Get Started Free
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="outline" size="lg" className="border-2" asChild>
                                    <Link href="/features">
                                        Learn More
                                    </Link>
                                </Button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>Free to join</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Shield className="h-4 w-4 text-blue-500" />
                                    <span>Privacy focused</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Users className="h-4 w-4 text-purple-500" />
                                    <span>10,000+ members</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Everything you need to build stronger communities
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Powerful features designed to connect neighbors, share information, and create lasting relationships.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-blue-100">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                                        <MapPin className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">Geo-Dynamic Discovery</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Automatically discover nearby communities based on your real-time location.
                                        Never miss local events or important updates.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-purple-100">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                                        <Zap className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">AI Steward</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Our AI analyzes posts in real-time, providing smart routing,
                                        priority assignment, and personalized community insights.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-green-50 to-green-100">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                                        <MessageSquare className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">Real-Time Feeds</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Stay updated with live community feeds featuring questions,
                                        alerts, roadblocks, and local discussions.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20 bg-gradient-to-r from-primary/5 to-purple-600/5">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Trusted by communities worldwide</h2>
                            <p className="text-muted-foreground">Join thousands of active community members</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                                <div className="text-muted-foreground">Active Members</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                                <div className="text-muted-foreground">Communities</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                                <div className="text-muted-foreground">Posts Shared</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
                                <div className="text-muted-foreground">Uptime</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">What our community says</h2>
                            <p className="text-muted-foreground">Real feedback from real community members</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "Sarah Johnson",
                                    role: "Community Organizer",
                                    content: "CommuneConnect has transformed how our neighborhood stays connected. The AI insights help us prioritize important updates.",
                                    rating: 5
                                },
                                {
                                    name: "Mike Chen",
                                    role: "Local Business Owner",
                                    content: "The location-based discovery helped me connect with customers in my area. It's been incredible for building local relationships.",
                                    rating: 5
                                },
                                {
                                    name: "Emma Davis",
                                    role: "Resident",
                                    content: "I love getting real-time updates about local events and road conditions. It's made my daily commute so much better.",
                                    rating: 5
                                }
                            ].map((testimonial, index) => (
                                <Card key={index} className="border-0 shadow-lg">
                                    <CardContent className="pt-6">
                                        <div className="flex mb-4">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                        <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                                        <div>
                                            <div className="font-semibold">{testimonial.name}</div>
                                            <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-primary to-purple-600 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to connect with your community?
                        </h2>
                        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                            Join thousands of community members who are already building stronger neighborhoods together.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary" asChild>
                                <Link href="/auth/signup">
                                    Start Building Community
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
                                <Link href="/contact">
                                    Contact Sales
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <Navigation />

            <main className="container mx-auto px-4 py-8">
                {/* Location Alert */}
                {locationError && (
                    <Card className="mb-6 border-yellow-200 bg-yellow-50">
                        <CardContent className="flex items-center space-x-3 p-4">
                            <MapPin className="h-5 w-5 text-yellow-600" />
                            <div>
                                <p className="font-medium text-yellow-800">Location Access Required</p>
                                <p className="text-sm text-yellow-700">
                                    Enable location services to discover nearby communities and get personalized content.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Communities Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24 border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Globe className="h-5 w-5 text-primary" />
                                    <span>Nearby Communities</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {loading ? (
                                    <div className="p-6">
                                        <LoadingSpinner />
                                    </div>
                                ) : communities.length > 0 ? (
                                    <div className="space-y-4 p-6 pt-0">
                                        {communities.slice(0, 3).map((community) => (
                                            <CommunityCard
                                                key={community.id}
                                                community={community}
                                                onJoin={() => fetchNearbyCommunities()}
                                            />
                                        ))}
                                        {communities.length > 3 && (
                                            <Button variant="ghost" className="w-full mt-4">
                                                View All Communities
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 px-6">
                                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground mb-4">
                                            No communities found nearby
                                        </p>
                                        <Button className="bg-gradient-to-r from-primary to-purple-600 text-white">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            Request New Community
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Feed */}
                    <div className="lg:col-span-3">
                        <PostFeed />
                    </div>
                </div>
            </main>
        </div>
    )
}