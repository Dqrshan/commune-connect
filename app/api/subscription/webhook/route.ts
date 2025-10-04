import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('dodo-signature')
    
    // Verify webhook signature (implement based on Dodo Payments documentation)
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const event = JSON.parse(body)

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data)
        break
      
      case 'subscription.created':
        await handleSubscriptionCreated(event.data)
        break
      
      case 'subscription.updated':
        await handleSubscriptionUpdated(event.data)
        break
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.data)
        break
      
      case 'payment.succeeded':
        await handlePaymentSucceeded(event.data)
        break
      
      case 'payment.failed':
        await handlePaymentFailed(event.data)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(data: any) {
  try {
    const { customer_email, metadata } = data
    const { user_id, plan_id } = metadata

    // Update user subscription tier
    const subscriptionTier = plan_id.toUpperCase()
    
    await prisma.user.update({
      where: { id: user_id },
      data: { 
        subscriptionTier: subscriptionTier as any,
        updatedAt: new Date()
      }
    })

    console.log(`Updated user ${user_id} to ${subscriptionTier} plan`)
  } catch (error) {
    console.error('Error handling checkout completed:', error)
  }
}

async function handleSubscriptionCreated(data: any) {
  try {
    const { customer_email, plan_id, subscription_id } = data
    
    // Store subscription details in database
    // You might want to create a separate subscriptions table
    console.log(`Subscription created: ${subscription_id} for ${customer_email}`)
  } catch (error) {
    console.error('Error handling subscription created:', error)
  }
}

async function handleSubscriptionUpdated(data: any) {
  try {
    const { customer_email, plan_id, subscription_id } = data
    
    // Update subscription details
    console.log(`Subscription updated: ${subscription_id}`)
  } catch (error) {
    console.error('Error handling subscription updated:', error)
  }
}

async function handleSubscriptionCancelled(data: any) {
  try {
    const { customer_email, subscription_id } = data
    
    // Find user by email and downgrade to free
    const user = await prisma.user.findUnique({
      where: { email: customer_email }
    })

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          subscriptionTier: 'FREE',
          updatedAt: new Date()
        }
      })
    }

    console.log(`Subscription cancelled: ${subscription_id} for ${customer_email}`)
  } catch (error) {
    console.error('Error handling subscription cancelled:', error)
  }
}

async function handlePaymentSucceeded(data: any) {
  try {
    const { customer_email, amount, currency } = data
    
    // Log successful payment
    console.log(`Payment succeeded: ${amount} ${currency} for ${customer_email}`)
  } catch (error) {
    console.error('Error handling payment succeeded:', error)
  }
}

async function handlePaymentFailed(data: any) {
  try {
    const { customer_email, error_message } = data
    
    // Handle failed payment - maybe send notification
    console.log(`Payment failed for ${customer_email}: ${error_message}`)
  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}