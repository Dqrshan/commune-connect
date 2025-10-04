import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const plans = [
            {
                id: 'personal',
                name: 'Personal',
                price: 9.99,
                period: 'month',
                description: 'Enhanced features for active community members',
                popular: true,
                color: 'border-blue-500',
                dodoProductId: 'personal_monthly_plan', // Replace with actual Dodo product ID
                features: [
                    'All Free features included',
                    'AI-Generated Community Summaries',
                    'AI-Powered Daily Planning',
                    'Priority notifications',
                    'Advanced location features',
                    'Custom notification settings',
                    'Export community data',
                    'Premium support'
                ],
                notIncluded: [
                    'Business verification badge',
                    'Partnership opportunities',
                    'Business analytics'
                ]
            },
            {
                id: 'business',
                name: 'Business',
                price: 29.99,
                period: 'month',
                description: 'Complete solution for local businesses',
                popular: false,
                color: 'border-purple-500',
                dodoProductId: 'business_monthly_plan', // Replace with actual Dodo product ID
                features: [
                    'All Personal features included',
                    'Verified Business Badge',
                    'Community Partnership Access',
                    'Business Analytics Dashboard',
                    'Promote services to communities',
                    'Direct customer engagement',
                    'Business listing priority',
                    'Advanced business insights',
                    'Dedicated account manager',
                    'API access for integrations'
                ],
                notIncluded: []
            }
        ]

        return NextResponse.json({ plans })
    } catch (error) {
        console.error('Error fetching plans:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}