import { DodoPayments } from 'dodopayments'

const dodo = new DodoPayments({
    apiKey: process.env.DODO_PAYMENTS_API_KEY!,
    environment: 'test' // Always use test mode
})

export interface CreateCheckoutParams {
    productId: string
    customerEmail: string
    customerName: string
    successUrl: string
    cancelUrl: string
    metadata?: Record<string, any>
}

export interface SubscriptionPlan {
    id: string
    name: string
    price: number
    interval: 'month' | 'year'
    features: string[]
    dodoProductId: string
}

export const subscriptionPlans: SubscriptionPlan[] = [
    {
        id: 'personal',
        name: 'Personal',
        price: 9,
        interval: 'month',
        features: [
            'Everything in Free',
            'AI-generated community summaries',
            'Personalized commute planning',
            'Advanced notification settings',
            'Priority community suggestions',
            'Export community data',
            'Email support'
        ],
        dodoProductId: 'personal_monthly_9'
    },
    {
        id: 'business',
        name: 'Business',
        price: 29,
        interval: 'month',
        features: [
            'Everything in Personal',
            'Verified business badge',
            'Community partnership opportunities',
            'Business analytics dashboard',
            'Custom business profile',
            'Featured business listings',
            'Dedicated account manager',
            'Phone & email support'
        ],
        dodoProductId: 'business_monthly_29'
    }
]

export async function createCheckoutSession(params: CreateCheckoutParams) {
    try {
        const session = await dodo.checkout.create({
            product_id: params.productId,
            customer: {
                email: params.customerEmail,
                name: params.customerName
            },
            success_url: params.successUrl,
            cancel_url: params.cancelUrl,
            metadata: params.metadata || {}
        })

        return session
    } catch (error) {
        console.error('Dodo Payments checkout error:', error)
        throw error
    }
}

export async function getSubscription(subscriptionId: string) {
    try {
        const subscription = await dodo.subscriptions.retrieve(subscriptionId)
        return subscription
    } catch (error) {
        console.error('Dodo Payments subscription retrieval error:', error)
        throw error
    }
}

export async function cancelSubscription(subscriptionId: string) {
    try {
        const subscription = await dodo.subscriptions.cancel(subscriptionId)
        return subscription
    } catch (error) {
        console.error('Dodo Payments subscription cancellation error:', error)
        throw error
    }
}

export async function getCustomer(customerId: string) {
    try {
        const customer = await dodo.customers.retrieve(customerId)
        return customer
    } catch (error) {
        console.error('Dodo Payments customer retrieval error:', error)
        throw error
    }
}

export async function downloadReceipt(paymentId: string) {
    try {
        const receipt = await dodo.payments.getReceipt(paymentId)
        return receipt
    } catch (error) {
        console.error('Dodo Payments receipt download error:', error)
        throw error
    }
}