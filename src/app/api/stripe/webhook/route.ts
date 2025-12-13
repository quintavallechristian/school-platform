import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getPlanFromPrice } from '@/lib/plans'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const payload = await getPayload({ config })

  try {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('[Webhook] Signature verification failed:', message)
      return new NextResponse(`Webhook error: ${message}`, { status: 400 })
    }

    console.log(`[Webhook] Received event: ${event.type}`, { id: event.id })

    switch (event.type) {
      case 'customer.subscription.created': {
        const stripeSubscription = event.data.object as Stripe.Subscription
        const subscriptionId = stripeSubscription.metadata.subscriptionId

        if (!subscriptionId) {
          console.error('[Webhook] Missing subscriptionId in metadata for subscription.created')
          return NextResponse.json({ error: 'Missing subscriptionId in metadata' }, { status: 400 })
        }

        try {
          // Get current_period_end from subscription items
          const currentPeriodEnd = stripeSubscription.items.data[0]?.current_period_end
          const plan = getPlanFromPrice(stripeSubscription.items.data[0].price.id)

          // Determine maxSchools based on plan
          const planLimits: Record<string, number> = {
            starter: 1,
            professional: 1,
            enterprise: 2,
          }

          const updateData: Record<string, unknown> = {
            status: 'active',
            plan: plan,
            maxSchools: planLimits[plan] || 1,
            stripeCustomerId: stripeSubscription.customer as string,
            stripeSubscriptionId: stripeSubscription.id,
            trialEndsAt: null, // No more trial
            expiresAt: null, // Active subscription doesn't have expiration
          }

          if (currentPeriodEnd) {
            const renewsAtDate = new Date(currentPeriodEnd * 1000)
            updateData.renewsAt = renewsAtDate.toISOString()
            console.log('[Webhook] Set subscription renewsAt:', {
              timestamp: currentPeriodEnd,
              date: renewsAtDate,
              iso: updateData.renewsAt,
            })
          }

          await payload.update({
            collection: 'subscriptions',
            id: subscriptionId,
            data: updateData,
          })

          // Update all schools linked to this subscription to be active
          const schools = await payload.find({
            collection: 'schools',
            where: {
              subscription: { equals: subscriptionId },
            },
          })

          for (const school of schools.docs) {
            await payload.update({
              collection: 'schools',
              id: school.id,
              data: { isActive: true },
            })
          }

          console.log(
            `[Webhook] Subscription ${subscriptionId} activated, ${schools.docs.length} schools updated`,
          )
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Unknown error'
          console.error(`[Webhook] Failed to update subscription ${subscriptionId}:`, message)
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
        }
        break
      }

      case 'customer.subscription.updated': {
        const stripeSubscription = event.data.object as Stripe.Subscription
        const subscriptionId = stripeSubscription.metadata.subscriptionId

        if (!subscriptionId) {
          console.error('[Webhook] Missing subscriptionId in metadata for subscription.updated')
          return NextResponse.json({ error: 'Missing subscriptionId in metadata' }, { status: 400 })
        }

        try {
          const currentPeriodEnd = stripeSubscription.items.data[0]?.current_period_end
          const plan = getPlanFromPrice(stripeSubscription.items.data[0].price.id)

          // Determine maxSchools based on plan
          const planLimits: Record<string, number> = {
            starter: 1,
            professional: 1,
            enterprise: 2,
          }

          const updateData: Record<string, unknown> = {
            plan: plan,
            maxSchools: planLimits[plan] || 1,
            stripeCustomerId: stripeSubscription.customer as string,
            stripeSubscriptionId: stripeSubscription.id,
          }

          // Determine status based on Stripe subscription status
          if (stripeSubscription.status === 'active') {
            updateData.status = 'active'
          } else if (
            stripeSubscription.status === 'past_due' ||
            stripeSubscription.status === 'unpaid'
          ) {
            updateData.status = 'active' // Still active but payment issue
          } else {
            updateData.status = 'expired'
          }

          // Handle renewsAt and expiresAt based on subscription status
          if (stripeSubscription.cancel_at) {
            // Subscription is cancelled but still active until period end
            updateData.status = 'cancelled'
            updateData.renewsAt = null
            const expiresAtDate = new Date(stripeSubscription.cancel_at * 1000)
            updateData.expiresAt = expiresAtDate.toISOString()
            console.log('[Webhook] Subscription cancelled, set expiresAt:', {
              timestamp: stripeSubscription.cancel_at,
              date: expiresAtDate,
              iso: updateData.expiresAt,
            })
          } else if (stripeSubscription.status === 'active') {
            // Subscription is active and will renew
            updateData.expiresAt = null
            if (currentPeriodEnd) {
              const renewsAtDate = new Date(currentPeriodEnd * 1000)
              updateData.renewsAt = renewsAtDate.toISOString()
              console.log('[Webhook] Subscription active, set renewsAt:', {
                timestamp: currentPeriodEnd,
                date: renewsAtDate,
                iso: updateData.renewsAt,
              })
            }
          } else {
            // Other statuses - set expiration
            updateData.renewsAt = null
            if (currentPeriodEnd) {
              const expiresAtDate = new Date(currentPeriodEnd * 1000)
              updateData.expiresAt = expiresAtDate.toISOString()
            }
          }

          await payload.update({
            collection: 'subscriptions',
            id: subscriptionId,
            data: updateData,
          })

          // Update school active status based on subscription
          const isActive = updateData.status === 'active' || updateData.status === 'cancelled'
          const schools = await payload.find({
            collection: 'schools',
            where: {
              subscription: { equals: subscriptionId },
            },
          })

          for (const school of schools.docs) {
            await payload.update({
              collection: 'schools',
              id: school.id,
              data: { isActive },
            })
          }

          console.log(`[Webhook] Subscription ${subscriptionId} updated`, {
            status: updateData.status,
            cancelAt: stripeSubscription.cancel_at,
            plan: plan,
            renewsAt: updateData.renewsAt || 'N/A',
            expiresAt: updateData.expiresAt || 'N/A',
            schoolsUpdated: schools.docs.length,
          })
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Unknown error'
          console.error(`[Webhook] Failed to update subscription ${subscriptionId}:`, message)
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const stripeSubscription = event.data.object as Stripe.Subscription
        const subscriptionId = stripeSubscription.metadata.subscriptionId

        if (!subscriptionId) {
          console.error('[Webhook] Missing subscriptionId in metadata for subscription.deleted')
          return NextResponse.json({ error: 'Missing subscriptionId in metadata' }, { status: 400 })
        }

        try {
          await payload.update({
            collection: 'subscriptions',
            id: subscriptionId,
            data: {
              status: 'expired',
              expiresAt: new Date().toISOString(),
              renewsAt: null,
            },
          })

          // Deactivate all schools linked to this subscription
          const schools = await payload.find({
            collection: 'schools',
            where: {
              subscription: { equals: subscriptionId },
            },
          })

          for (const school of schools.docs) {
            await payload.update({
              collection: 'schools',
              id: school.id,
              data: { isActive: false },
            })
          }

          console.log(
            `[Webhook] Subscription ${subscriptionId} deleted, ${schools.docs.length} schools deactivated`,
          )
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Unknown error'
          console.error(`[Webhook] Failed to update subscription ${subscriptionId}:`, message)
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const customerId = invoice.customer as string

        console.warn(`[Webhook] Payment failed for customer ${customerId}`)

        try {
          // Find subscription by Stripe customer ID
          const subscriptions = await payload.find({
            collection: 'subscriptions',
            where: {
              stripeCustomerId: { equals: customerId },
            },
            limit: 1,
          })

          if (subscriptions.docs.length > 0) {
            const subscription = subscriptions.docs[0]
            console.warn(`[Webhook] Payment failed for subscription ${subscription.id}`)
            // TODO: Send email notification to subscription owner
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Unknown error'
          console.error('[Webhook] Error processing payment failure:', message)
          // Don't return error - this is not critical
        }
        break
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Webhook] Unexpected error:', message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
