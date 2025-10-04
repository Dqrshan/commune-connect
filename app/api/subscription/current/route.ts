import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { getSubscription, getCustomer } from '@/lib/dodopayments'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's current subscription details
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        subscriptionTier: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let subscriptionData = {
      tier: user.subscriptionTier,
      status: 'active',
      subscriptionId: null,
      customerId: null,
      nextBillingDate: null,
      cancelAtPeriodEnd: false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    // If user has a paid subscription, try to fetch real data from Dodo Payments
    if (user.subscriptionTier !== 'FREE') {
      try {
        // In a real app, you'd store the subscription ID and customer ID in your database
        // For now, we'll mock the data but structure it correctly
        subscriptionData = {
          ...subscriptionData,
          subscriptionId: `sub_${user.id}_${user.subscriptionTier.toLowerCase()}`,
          customerId: `cus_${user.id}`,
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false
        }
      } catch (dodoError) {
        console.error('Error fetching subscription from Dodo Payments:', dodoError)
        // Continue with local data if Dodo Payments fails
      }
    }

    return NextResponse.json(subscriptionData)

  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}