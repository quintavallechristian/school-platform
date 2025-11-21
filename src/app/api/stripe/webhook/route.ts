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
          await payload.update({
            collection: 'schools',
            id: schoolId,
            data: {
              isActive: true,
              subscription: {
                isTrial: true,
                expiresAt: new Date(subscription.trial_end! * 1000).toISOString(),
                stripeCustomerId: subscription.customer as string,
              },
            },
          })
          console.log(`[Webhook] School ${schoolId} activated with trial`)
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
          // Extract current_period_end with proper type handling
          // The Stripe SDK types may not include all properties, so we use unknown as intermediate
          const currentPeriodEnd = subscription.items.data[0].current_period_end

          await payload.update({
            collection: 'schools',
            id: schoolId,
            data: {
              isActive: subscription.status === 'active',
              subscription: {
                isTrial: false,
                expiresAt: new Date(currentPeriodEnd * 1000).toISOString(),
                plan: getPlanFromPrice(subscription.items.data[0].price.id),
              },
            },
          })
          console.log(`[Webhook] School ${schoolId} subscription updated`, {
            status: subscription.status,
            plan: getPlanFromPrice(subscription.items.data[0].price.id),
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
