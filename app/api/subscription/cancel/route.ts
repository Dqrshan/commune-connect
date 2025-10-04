import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { cancelSubscription } from '@/lib/dodopayments'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subscriptionId } = await request.json()

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.subscriptionTier === 'FREE') {
      return NextResponse.json({ error: 'Free plan cannot be cancelled' }, { status: 400 })
    }

    // Cancel subscription using dodopayments package
    try {
      await cancelSubscription(subscriptionId)
    } catch (dodoError) {
      console.error('Error cancelling subscription with Dodo Payments:', dodoError)
      return NextResponse.json({
        error: 'Failed to cancel subscription with payment provider'
      }, { status: 500 })
    }

    // Update user to free tier
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionTier: 'FREE',
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully'
    })

  } catch (error) {
    console.error('Error cancelling subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}