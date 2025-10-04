'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Navigation } from '../components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    Crown,
    CheckCircle,
    X,
    CreditCard,
    Calendar,
    ArrowRight,
    Sparkles,
    Star,
    Zap,
    Users,
    Shield,
    AlertCircle,
    ExternalLink,
    Download,
    RefreshCw
} from 'lucide-react'
import Link from 'next/link'

interface SubscriptionData {
    tier: string
    status: string
    subscriptionId?: string
    customerId?: string
    nextBillingDate?: string
    cancelAtPeriodEnd: boolean
    createdAt: string
    updatedAt: string
}

interface Plan {
    id: string
    name: string
    price: number
    period: string
    description: string
    features: string[]
    notIncluded: string[]
    popular: boolean
    color: string
    dodoProductId: string | null
}

export default function Subscription() {
    const { data: session } = useSession()
    const [currentSubscription, setCurrentSubscription] = useState<SubscriptionData | null>(null)
    const [plans, setPlans] = useState<Plan[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        if (session?.user) {
            fetchSubscriptionData()
            fetchPlans()
        }
    }, [session])

    const fetchSubscriptionData = async () => {
        try {
            const response = await fetch('/api/subscription/current')
            const data = await response.json()
            setCurrentSubscription(data)
        } catch (error) {
            console.error('Error fetching subscription:', error)
        }
    }

    const fetchPlans = async () => {
        try {
            const response = await fetch('/api/subscription/plans')
            const data = await response.json()
            setPlans(data.plans || [])
        } catch (error) {
            console.error('Error fetching plans:', error)
        }
    }

    const handleUpgrade = async (planId: string, dodoProductId: string) => {
        if (!dodoProductId) return

        setIsLoading(true)
        setMessage({ type: '', text: '' })

        try {
            const response = await fetch('/api/subscription/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: dodoProductId,
                    planId: planId,
                    userId: session?.user?.id
                }),
            })

            const data = await response.json()

            if (response.ok && data.checkoutUrl) {
                window.location.href = data.checkoutUrl
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to create checkout session' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while processing your request' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancelSubscription = async () => {
        if (!currentSubscription?.subscriptionId) return

        if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch('/api/subscription/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscriptionId: currentSubscription.subscriptionId }),
            })

            if (response.ok) {
                setMessage({ type: 'success', text: 'Subscription cancelled successfully' })
                fetchSubscriptionData()
            } else {
                const data = await response.json()
                setMessage({ type: 'error', text: data.error || 'Failed to cancel subscription' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDownloadReceipt = async () => {
        try {
            const response = await fetch('/api/subscription/receipt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customerId: currentSubscription?.customerId }),
            })

            if (response.ok) {
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.style.display = 'none'
                a.href = url
                a.download = 'receipt.pdf'
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
            } else {
                setMessage({ type: 'error', text: 'Failed to download receipt' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while downloading receipt' })
        }
    }

    const handleRefresh = async () => {
        setRefreshing(true)
        await fetchSubscriptionData()
        setRefreshing(false)
    }

    const getCurrentPlanDetails = () => {
        if (!currentSubscription) return null
        return plans.find(plan => plan.id === currentSubscription.tier.toLowerCase()) || null
    }

    const getSubscriptionBadge = (tier: string) => {
        switch (tier) {
            case 'PERSONAL':
                return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Personal</Badge>
            case 'BUSINESS':
                return <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Business
                </Badge>
            default:
                return <Badge variant="outline">Free</Badge>
        }
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <Navigation />
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold mb-4">Please sign in to manage your subscription</h1>
                    <Button asChild>
                        <Link href="/auth/signin">Sign In</Link>
                    </Button>
                </div>
            </div>
        )
    }

    const currentPlanDetails = getCurrentPlanDetails()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <Navigation />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
                            <p className="text-muted-foreground">Manage your plan and billing preferences</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleRefresh}
                            disabled={refreshing}
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>

                    {/* Message */}
                    {message.text && (
                        <Card className={`border-0 ${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <CardContent className="flex items-center space-x-3 p-4">
                                {message.type === 'success' ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                )}
                                <span className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                                    {message.text}
                                </span>
                            </CardContent>
                        </Card>
                    )}

                    {/* Current Plan */}
                    {currentSubscription && (
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <CreditCard className="h-5 w-5" />
                                    <span>Current Plan</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <div>
                                            <h3 className="text-xl font-semibold">
                                                {currentPlanDetails?.name || currentSubscription.tier} Plan
                                            </h3>
                                            <p className="text-muted-foreground">
                                                {currentPlanDetails?.description || 'Current subscription plan'}
                                            </p>
                                            <div className="flex items-center space-x-2 mt-2">
                                                {getSubscriptionBadge(currentSubscription.tier)}
                                                <Badge variant={currentSubscription.status === 'active' ? 'default' : 'secondary'}>
                                                    {currentSubscription.status}
                                                </Badge>
                                                {currentSubscription.cancelAtPeriodEnd && (
                                                    <Badge variant="destructive">Cancelling</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">
                                            ${currentPlanDetails?.price || 0}
                                            <span className="text-sm font-normal text-muted-foreground">
                                                /{currentPlanDetails?.period || 'month'}
                                            </span>
                                        </div>
                                        {currentSubscription.nextBillingDate && (
                                            <p className="text-sm text-muted-foreground">
                                                Next billing: {new Date(currentSubscription.nextBillingDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {currentSubscription.tier !== 'FREE' && (
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm" onClick={handleDownloadReceipt}>
                                            <Download className="w-4 h-4 mr-2" />
                                            Download Receipt
                                        </Button>
                                        {!currentSubscription.cancelAtPeriodEnd && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={handleCancelSubscription}
                                                disabled={isLoading}
                                            >
                                                Cancel Subscription
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Available Plans */}
                    <div>
                        <h2 className="text-2xl font-bold text-center mb-8">Available Plans</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Free Plan */}
                            <Card className="relative border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                                <CardHeader className="text-center pb-8">
                                    <CardTitle className="text-2xl font-bold mb-2">Free</CardTitle>
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold">$0</span>
                                        <span className="text-muted-foreground">/forever</span>
                                    </div>
                                    <p className="text-muted-foreground">Perfect for individual community members</p>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    <div className="space-y-3">
                                        {[
                                            'Join unlimited communities',
                                            'Real-time community feeds',
                                            'Location-based discovery',
                                            'Basic notifications',
                                            'Community messaging',
                                            'Mobile responsive access'
                                        ].map((feature, index) => (
                                            <div key={index} className="flex items-center">
                                                <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                                                <span className="text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        className="w-full"
                                        variant={currentSubscription?.tier === 'FREE' ? 'secondary' : 'outline'}
                                        disabled={currentSubscription?.tier === 'FREE'}
                                    >
                                        {currentSubscription?.tier === 'FREE' ? (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Current Plan
                                            </>
                                        ) : (
                                            'Downgrade to Free'
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Dynamic Plans */}
                            {plans.map((plan, index) => (
                                <Card key={plan.id} className={`relative border-2 ${plan.color} ${plan.popular ? 'shadow-2xl scale-105' : 'shadow-lg'} hover:shadow-xl transition-all duration-300`}>
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
                                            <span className="text-4xl font-bold">${plan.price}</span>
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

                                        {currentSubscription?.tier.toLowerCase() === plan.id ? (
                                            <Button
                                                className="w-full"
                                                variant="secondary"
                                                disabled
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Current Plan
                                            </Button>
                                        ) : (
                                            <Button
                                                className={`w-full ${plan.popular ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white' : ''}`}
                                                variant={plan.popular ? 'default' : 'outline'}
                                                size="lg"
                                                onClick={() => plan.dodoProductId && handleUpgrade(plan.id, plan.dodoProductId)}
                                                disabled={isLoading || !plan.dodoProductId}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        Upgrade to {plan.name}
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Test Mode Notice */}
                    <Card className="border-0 shadow-lg bg-yellow-50 border-yellow-200">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-3">
                                <Shield className="h-5 w-5 text-yellow-600" />
                                <div>
                                    <h3 className="font-semibold text-yellow-800">Test Mode Active</h3>
                                    <p className="text-sm text-yellow-700">
                                        All payments are processed in test mode. No real charges will be made.
                                        Use test card numbers for checkout.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}