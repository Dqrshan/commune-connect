import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
    MapPin,
    Users,
    Zap,
    MessageSquare,
    Bell,
    BarChart3,
    Shield,
    Globe,
    Smartphone,
    Brain,
    Clock,
    ArrowRight,
    CheckCircle,
    Sparkles,
    Target,
    Layers,
    Wifi
} from 'lucide-react'

export default function Features() {
    const features = [
        {
            icon: MapPin,
            title: "Geo-Dynamic Discovery",
            description: "Automatically discover nearby communities based on your real-time location",
            details: [
                "Real-time location tracking",
                "Radius-based community suggestions",
                "Distance calculations",
                "Location privacy controls"
            ],
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: Zap,
            title: "AI Steward",
            description: "Intelligent content analysis and smart routing powered by Google Gemini AI",
            details: [
                "Automatic post categorization",
                "Priority assignment",
                "Smart content tagging",
                "Personalized insights"
            ],
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: MessageSquare,
            title: "Real-Time Feeds",
            description: "Live community feeds with instant updates and notifications",
            details: [
                "Live post streaming",
                "Real-time comments",
                "Push notifications",
                "Activity indicators"
            ],
            color: "from-green-500 to-green-600"
        },
        {
            icon: Users,
            title: "Community Management",
            description: "Comprehensive tools for building and managing local communities",
            details: [
                "Community creation requests",
                "Member management",
                "Role-based permissions",
                "Moderation tools"
            ],
            color: "from-orange-500 to-orange-600"
        },
        {
            icon: Bell,
            title: "Smart Notifications",
            description: "Intelligent alerts for important community updates and events",
            details: [
                "Priority-based alerts",
                "Custom notification settings",
                "Emergency broadcasts",
                "Event reminders"
            ],
            color: "from-red-500 to-red-600"
        },
        {
            icon: BarChart3,
            title: "Analytics & Insights",
            description: "Detailed analytics and AI-powered community insights",
            details: [
                "Community growth metrics",
                "Engagement analytics",
                "AI-generated summaries",
                "Trend analysis"
            ],
            color: "from-indigo-500 to-indigo-600"
        }
    ]

    const premiumFeatures = [
        {
            icon: Brain,
            title: "AI-Generated Summaries",
            description: "Get comprehensive summaries of community activity and discussions",
            tier: "Personal"
        },
        {
            icon: Target,
            title: "Personalized Planning",
            description: "AI-powered commute and activity planning based on community insights",
            tier: "Personal"
        },
        {
            icon: CheckCircle,
            title: "Verified Business Badge",
            description: "Stand out with a verified badge across the entire platform",
            tier: "Business"
        },
        {
            icon: Layers,
            title: "Community Partnerships",
            description: "Partner with communities and showcase your services to new members",
            tier: "Business"
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Header />

            {/* Hero Section */}
            <section className="py-20 lg:py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-4xl mx-auto">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-6">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Powerful Features
                        </Badge>

                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
                            Everything you need to build
                            <br />
                            stronger communities
                        </h1>

                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                            Discover the comprehensive suite of tools designed to connect neighbors,
                            share information, and create lasting community relationships.
                        </p>

                        <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg" asChild>
                            <Link href="/auth/signup">
                                Get Started Free
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Core Features */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Features</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Essential tools available to all community members
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                                    <CardHeader>
                                        <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                            {feature.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-4">{feature.description}</p>
                                        <ul className="space-y-2">
                                            {feature.details.map((detail, detailIndex) => (
                                                <li key={detailIndex} className="flex items-center text-sm">
                                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                                    {detail}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Premium Features */}
            <section className="py-20 bg-gradient-to-r from-primary/5 to-purple-600/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Premium Features</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Advanced capabilities for enhanced community experience
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {premiumFeatures.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                            <Badge variant={feature.tier === 'Business' ? 'default' : 'secondary'}>
                                                {feature.tier}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    <div className="text-center mt-12">
                        <Button size="lg" variant="outline" className="border-2" asChild>
                            <Link href="/pricing">
                                View Pricing Plans
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Technical Specs */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Specifications</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Built with modern technology for reliability and performance
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <Shield className="h-8 w-8 text-blue-500 mb-2" />
                                <CardTitle>Security & Privacy</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        End-to-end encryption
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        GDPR compliant
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        Location privacy controls
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        Secure authentication
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <Wifi className="h-8 w-8 text-green-500 mb-2" />
                                <CardTitle>Performance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        99.9% uptime SLA
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        Real-time synchronization
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        Global CDN delivery
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        Auto-scaling infrastructure
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <Smartphone className="h-8 w-8 text-purple-500 mb-2" />
                                <CardTitle>Compatibility</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        Web application
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        Mobile responsive
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        Cross-browser support
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        Offline capabilities
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary to-purple-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to experience these features?
                    </h2>
                    <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                        Join thousands of community members who are already using these powerful tools.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/auth/signup">
                                Start Free Trial
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-gray-800 hover:bg-white hover:text-primary" asChild>
                            <Link href="/contact">
                                Schedule Demo
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}