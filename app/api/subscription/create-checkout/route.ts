import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { createCheckoutSession } from '@/lib/dodopayments'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, planId, userId } = await request.json()

    if (!productId || !planId) {
      return NextResponse.json({ error: 'Product ID and Plan ID are required' }, { status: 400 })
    }

    // Create checkout session using dodopayments package
    const checkoutSession = await createCheckoutSession({
      productId,
      customerEmail: session.user.email,
      customerName: session.user.name || 'User',
      successUrl: `${process.env.NEXTAUTH_URL}/subscription/success?plan=${planId}`,
      cancelUrl: `${process.env.NEXTAUTH_URL}/subscription`,
      metadata: {
        user_id: userId,
        plan_id: planId,
        upgrade_from: session.user.subscriptionTier || 'FREE'
      }
    })

    return NextResponse.json({
      checkoutUrl: checkoutSession.checkout_url,
      sessionId: checkoutSession.id
    })

  } catch (error) {
    console.error('Checkout creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}