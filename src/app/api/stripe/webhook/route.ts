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
        const subscription = event.data.object as Stripe.Subscription
        const schoolId = subscription.metadata.schoolId

        if (!schoolId) {
          console.error('[Webhook] Missing schoolId in metadata for subscription.created')
          return NextResponse.json({ error: 'Missing schoolId in metadata' }, { status: 400 })
        }

        try {
          // Get current school to preserve selectedPriceId
          const school = await payload.findByID({
            collection: 'schools',
            id: schoolId,
          })

          // When subscription is created from activate-subscription endpoint (no trial)
          // the subscription starts immediately as active
          const updateData: any = {
            isActive: true,
            subscription: {
              isTrial: false, // No more trial when activating subscription
              stripeCustomerId: subscription.customer as string,
              plan: getPlanFromPrice(subscription.items.data[0].price.id),
              selectedPriceId: school.subscription?.selectedPriceId || null,
              expiresAt: null, // Active subscription doesn't have expiration
            },
          }

          // Get current_period_end from subscription or from items
          // Stripe API v2024+ moved this field into items.data[0]
          const currentPeriodEnd = subscription.items.data[0]?.current_period_end

          if (currentPeriodEnd) {
            const renewsAtDate = new Date(currentPeriodEnd * 1000)
            updateData.subscription.renewsAt = renewsAtDate.toISOString()
            console.log('[Webhook] Set subscription renewsAt:', {
              timestamp: currentPeriodEnd,
              date: renewsAtDate,
              iso: updateData.subscription.renewsAt,
            })
          }

          await payload.update({
            collection: 'schools',
            id: schoolId,
            data: updateData,
          })
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Unknown error'
          console.error(`[Webhook] Failed to update school ${schoolId}:`, message)
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const schoolId = subscription.metadata.schoolId

        if (!schoolId) {
          console.error('[Webhook] Missing schoolId in metadata for subscription.updated')
          return NextResponse.json({ error: 'Missing schoolId in metadata' }, { status: 400 })
        }

        try {
          // Get current school to preserve selectedPriceId
          const school = await payload.findByID({
            collection: 'schools',
            id: schoolId,
          })

          // Get current_period_end from subscription or from items
          // Stripe API v2024+ moved this field into items.data[0]
          const currentPeriodEnd = subscription.items.data[0]?.current_period_end

          const updateData: any = {
            isActive: subscription.status === 'active',
            subscription: {
              isTrial: false,
              stripeCustomerId: subscription.customer as string, // Ensure customer ID is always set
              plan: getPlanFromPrice(subscription.items.data[0].price.id),
              selectedPriceId: school.subscription?.selectedPriceId || null,
            },
          }

          // Handle renewsAt and expiresAt based on subscription status
          if (subscription.cancel_at) {
            // Subscription is cancelled but still active until period end
            updateData.subscription.renewsAt = null
            if (subscription.cancel_at) {
              const expiresAtDate = new Date(subscription.cancel_at * 1000)
              updateData.subscription.expiresAt = expiresAtDate.toISOString()
              console.log('[Webhook] Subscription cancelled, set expiresAt:', {
                timestamp: subscription.cancel_at,
                date: expiresAtDate,
                iso: updateData.subscription.expiresAt,
              })
            }
          } else if (subscription.status === 'active') {
            // Subscription is active and will renew
            updateData.subscription.expiresAt = null
            if (currentPeriodEnd) {
              const renewsAtDate = new Date(currentPeriodEnd * 1000)
              updateData.subscription.renewsAt = renewsAtDate.toISOString()
              console.log('[Webhook] Subscription active, set renewsAt:', {
                timestamp: currentPeriodEnd,
                date: renewsAtDate,
                iso: updateData.subscription.renewsAt,
              })
            }
          } else {
            // Other statuses (past_due, unpaid, etc.) - keep expiresAt if available
            updateData.subscription.renewsAt = null
            if (currentPeriodEnd) {
              const expiresAtDate = new Date(currentPeriodEnd * 1000)
              updateData.subscription.expiresAt = expiresAtDate.toISOString()
            }
          }

          await payload.update({
            collection: 'schools',
            id: schoolId,
            data: updateData,
          })

          console.log(`[Webhook] School ${schoolId} subscription updated`, {
            status: subscription.status,
            cancelAt: subscription.cancel_at,
            plan: getPlanFromPrice(subscription.items.data[0].price.id),
            renewsAt: updateData.subscription.renewsAt || 'N/A',
            expiresAt: updateData.subscription.expiresAt || 'N/A',
          })
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Unknown error'
          console.error(`[Webhook] Failed to update school ${schoolId}:`, message)
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const schoolId = subscription.metadata.schoolId

        if (!schoolId) {
          console.error('[Webhook] Missing schoolId in metadata for subscription.deleted')
          return NextResponse.json({ error: 'Missing schoolId in metadata' }, { status: 400 })
        }

        try {
          await payload.update({
            collection: 'schools',
            id: schoolId,
            data: {
              isActive: false,
              subscription: {
                isTrial: false,
                expiresAt: new Date().toISOString(),
                renewsAt: null, // No renewal for deleted subscription
              },
            },
          })
          console.log(`[Webhook] School ${schoolId} deactivated - subscription cancelled`)
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Unknown error'
          console.error(`[Webhook] Failed to deactivate school ${schoolId}:`, message)
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const customerId = invoice.customer as string

        console.warn(`[Webhook] Payment failed for customer ${customerId}`)

        try {
          // Find school by Stripe customer ID
          const schools = await payload.find({
            collection: 'schools',
            where: {
              'subscription.stripeCustomerId': { equals: customerId },
            },
            limit: 1,
          })

          if (schools.docs.length > 0) {
            const school = schools.docs[0]
            console.warn(`[Webhook] Payment failed for school ${school.id} (${school.name})`)
            // TODO: Send email notification to school admin
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
