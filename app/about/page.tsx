import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
    MapPin,
    Users,
    Heart,
    Target,
    ArrowRight,
    Sparkles,
    Globe,
    Zap,
    Shield,
    Award,
    TrendingUp,
    MessageSquare
} from 'lucide-react'

export default function About() {
    const team = [
        {
            name: "Sarah Johnson",
            role: "CEO & Co-Founder",
            bio: "Former community organizer with 10+ years of experience building local networks.",
            image: "/team/sarah.jpg"
        },
        {
            name: "Mike Chen",
            role: "CTO & Co-Founder",
            bio: "Tech veteran with expertise in AI, location services, and scalable platforms.",
            image: "/team/mike.jpg"
        },
        {
            name: "Emma Davis",
            role: "Head of Product",
            bio: "UX designer passionate about creating intuitive community experiences.",
            image: "/team/emma.jpg"
        },
        {
            name: "Alex Rodriguez",
            role: "Head of Engineering",
            bio: "Full-stack engineer focused on real-time systems and mobile experiences.",
            image: "/team/alex.jpg"
        }
    ]

    const values = [
        {
            icon: Heart,
            title: "Community First",
            description: "Every decision we make is guided by what's best for communities and their members."
        },
        {
            icon: Shield,
            title: "Privacy & Security",
            description: "We protect your data and respect your privacy. Your information belongs to you."
        },
        {
            icon: Globe,
            title: "Inclusive & Accessible",
            description: "Building technology that works for everyone, regardless of background or ability."
        },
        {
            icon: Zap,
            title: "Innovation",
            description: "Constantly improving and innovating to better serve our communities."
        }
    ]

    const milestones = [
        {
            year: "2023",
            title: "The Beginning",
            description: "Founded with a vision to strengthen local communities through technology."
        },
        {
            year: "2024",
            title: "AI Integration",
            description: "Launched AI-powered features to enhance community interactions and insights."
        },
        {
            year: "2024",
            title: "10K Members",
            description: "Reached 10,000 active community members across 500+ communities."
        },
        {
            year: "2024",
            title: "Global Expansion",
            description: "Expanded to serve communities worldwide with multi-language support."
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
                            <Heart className="w-4 h-4 mr-2" />
                            Our Story
                        </Badge>

                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
                            Building stronger
                            <br />
                            communities together
                        </h1>

                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                            We believe that strong communities are the foundation of a better world.
                            Our mission is to use technology to bring neighbors closer together and
                            make local connections more meaningful.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
                            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                In an increasingly digital world, we've noticed that people are becoming more
                                disconnected from their immediate neighbors and local communities. We created
                                CommuneConnect to bridge this gap.
                            </p>
                            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                Our platform combines the power of real-time location services, artificial
                                intelligence, and intuitive design to help people discover, connect with,
                                and actively participate in their local communities.
                            </p>
                            <div className="flex items-center space-x-4">
                                <Button asChild>
                                    <Link href="/features">
                                        Learn About Our Features
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                                <CardContent className="p-6 text-center">
                                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-blue-600">10K+</div>
                                    <div className="text-sm text-muted-foreground">Active Members</div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                                <CardContent className="p-6 text-center">
                                    <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-green-600">500+</div>
                                    <div className="text-sm text-muted-foreground">Communities</div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                                <CardContent className="p-6 text-center">
                                    <MessageSquare className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-purple-600">50K+</div>
                                    <div className="text-sm text-muted-foreground">Posts Shared</div>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                                <CardContent className="p-6 text-center">
                                    <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-orange-600">99.9%</div>
                                    <div className="text-sm text-muted-foreground">Uptime</div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-gradient-to-r from-primary/5 to-purple-600/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon
                            return (
                                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
                                    <CardHeader>
                                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <CardTitle className="text-xl">{value.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{value.description}</p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Key milestones in building stronger communities
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="space-y-8">
                            {milestones.map((milestone, index) => (
                                <div key={index} className="flex items-start space-x-6">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <Card className="flex-1 border-0 shadow-lg">
                                        <CardContent className="p-6">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <Badge variant="secondary">{milestone.year}</Badge>
                                                <h3 className="text-xl font-semibold">{milestone.title}</h3>
                                            </div>
                                            <p className="text-muted-foreground">{milestone.description}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-gradient-to-r from-primary/5 to-purple-600/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            The passionate people behind CommuneConnect
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {team.map((member, index) => (
                            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
                                <CardContent className="p-6">
                                    <div className="w-20 h-20 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl font-bold text-white">
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                                    <p className="text-primary font-medium text-sm mb-3">{member.role}</p>
                                    <p className="text-muted-foreground text-sm">{member.bio}</p>
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
                        Join us in building stronger communities
                    </h2>
                    <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                        Whether you're looking to connect with neighbors, organize local events,
                        or simply stay informed about your community, we're here to help.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/auth/signup">
                                Get Started Today
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-gray-800 hover:bg-white hover:text-primary" asChild>
                            <Link href="/contact">
                                Get in Touch
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}