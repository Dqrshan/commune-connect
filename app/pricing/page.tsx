import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
    CheckCircle,
    X,
    Crown,
    Users,
    Zap,
    ArrowRight,
    Sparkles,
    Star,
    Shield,
    Headphones
} from 'lucide-react'

export default function Pricing() {
    const plans = [
        {
            name: "Free",
            price: "$0",
            period: "forever",
            description: "Perfect for individual community members",
            features: [
                "Join unlimited communities",
                "Real-time community feeds",
                "Location-based discovery",
                "Basic notifications",
                "Community messaging",
                "Mobile responsive access"
            ],
            notIncluded: [
                "AI-generated summaries",
                "Personalized planning",
                "Priority support",
                "Advanced analytics"
            ],
            cta: "Get Started Free",
            href: "/auth/signup",
            popular: false,
            color: "border-gray-200"
        },
        {
            name: "Personal",
            price: "$9",
            period: "per month",
            description: "Enhanced experience with AI-powered features",
            features: [
                "Everything in Free",
                "AI-generated community summaries",
                "Personalized commute planning",
                "Advanced notification settings",
                "Priority community suggestions",
                "Export community data",
                "Email support"
            ],
            notIncluded: [
                "Business verification",
                "Community partnerships",
                "Dedicated support"
            ],
            cta: "Start Personal Plan",
            href: "/auth/signup?plan=personal",
            popular: true,
            color: "border-primary"
        },
        {
            name: "Business",
            price: "$29",
            period: "per month",
            description: "Perfect for local businesses and organizations",
            features: [
                "Everything in Personal",
                "Verified business badge",
                "Community partnership opportunities",
                "Business analytics dashboard",
                "Custom business profile",
                "Featured business listings",
                "Dedicated account manager",
                "Phone & email support"
            ],
            notIncluded: [],
            cta: "Start Business Plan",
            href: "/auth/signup?plan=business",
            popular: false,
            color: "border-purple-200"
        }
    ]

    const faqs = [
        {
            question: "Can I change my plan at any time?",
            answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
        },
        {
            question: "Is there a free trial for paid plans?",
            answer: "Yes, we offer a 14-day free trial for both Personal and Business plans. No credit card required to start your trial."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. All payments are processed securely through our payment partner."
        },
        {
            question: "Can I cancel my subscription anytime?",
            answer: "Absolutely. You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your billing period."
        },
        {
            question: "Do you offer discounts for annual billing?",
            answer: "Yes, we offer a 20% discount when you choose annual billing for Personal and Business plans. The discount is applied automatically at checkout."
        },
        {
            question: "Is my data secure?",
            answer: "Yes, we take security seriously. All data is encrypted in transit and at rest, and we're fully GDPR compliant. We never sell your personal information."
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
                            <Crown className="w-4 h-4 mr-2" />
                            Simple Pricing
                        </Badge>

                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
                            Choose the perfect plan
                            <br />
                            for your community
                        </h1>

                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                            Start free and upgrade as your community grows. All plans include our core features
                            with no hidden fees or surprise charges.
                        </p>

                        <div className="flex items-center justify-center space-x-4 mb-8">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>14-day free trial</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>No setup fees</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>Cancel anytime</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, index) => (
                            <Card key={index} className={`relative border-2 ${plan.color} ${plan.popular ? 'shadow-2xl scale-105' : 'shadow-lg'} hover:shadow-xl transition-all duration-300`}>
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-1">
                                            <Star className="w-3 h-3 mr-1" />
                                            Most Popular
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader className="text-center pb-8">
                                    <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        <span className="text-muted-foreground">/{plan.period}</span>
                                    </div>
                                    <p className="text-muted-foreground">{plan.description}</p>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    <div className="space-y-3">
                                        {plan.features.map((feature, featureIndex) => (
                                            <div key={featureIndex} className="flex items-center">
                                                <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                                                <span className="text-sm">{feature}</span>
                                            </div>
                                        ))}
                                        {plan.notIncluded.map((feature, featureIndex) => (
                                            <div key={featureIndex} className="flex items-center opacity-50">
                                                <X className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                                                <span className="text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        className={`w-full ${plan.popular ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white' : ''}`}
                                        variant={plan.popular ? 'default' : 'outline'}
                                        size="lg"
                                        asChild
                                    >
                                        <Link href={plan.href}>
                                            {plan.cta}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Comparison */}
            <section className="py-20 bg-gradient-to-r from-primary/5 to-purple-600/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Compare Plans</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            See exactly what's included in each plan
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <Card className="border-0 shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="text-left p-4 font-semibold">Features</th>
                                            <th className="text-center p-4 font-semibold">Free</th>
                                            <th className="text-center p-4 font-semibold">Personal</th>
                                            <th className="text-center p-4 font-semibold">Business</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {[
                                            { feature: "Community Access", free: true, personal: true, business: true },
                                            { feature: "Real-time Feeds", free: true, personal: true, business: true },
                                            { feature: "Location Discovery", free: true, personal: true, business: true },
                                            { feature: "AI Summaries", free: false, personal: true, business: true },
                                            { feature: "Personalized Planning", free: false, personal: true, business: true },
                                            { feature: "Business Verification", free: false, personal: false, business: true },
                                            { feature: "Community Partnerships", free: false, personal: false, business: true },
                                            { feature: "Priority Support", free: false, personal: false, business: true },
                                        ].map((row, index) => (
                                            <tr key={index}>
                                                <td className="p-4 font-medium">{row.feature}</td>
                                                <td className="p-4 text-center">
                                                    {row.free ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-gray-400 mx-auto" />}
                                                </td>
                                                <td className="p-4 text-center">
                                                    {row.personal ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-gray-400 mx-auto" />}
                                                </td>
                                                <td className="p-4 text-center">
                                                    {row.business ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-gray-400 mx-auto" />}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to know about our pricing and plans
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-6">
                        {faqs.map((faq, index) => (
                            <Card key={index} className="border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                                    <p className="text-muted-foreground">{faq.answer}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enterprise CTA */}
            <section className="py-20 bg-gradient-to-r from-primary to-purple-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Shield className="h-16 w-16 mx-auto mb-6 text-white/80" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Need something more?
                        </h2>
                        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                            Looking for enterprise features, custom integrations, or dedicated support?
                            We'd love to discuss a custom plan that fits your organization's needs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary" asChild>
                                <Link href="/contact">
                                    <Headphones className="mr-2 h-4 w-4" />
                                    Contact Sales
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
                                <Link href="/enterprise">
                                    Learn About Enterprise
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}