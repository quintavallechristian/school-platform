import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { normalizeSchoolId } from '@/lib/tenantAccess'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })

    if (!user) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
    }

    const { stripeCustomerId } = await req.json()

    if (!stripeCustomerId) {
      return NextResponse.json({ error: 'stripeCustomerId missing' }, { status: 400 })
    }

    const subscriptionResult = await payload.find({
      collection: 'subscriptions',
      where: {
        stripeCustomerId: {
          equals: stripeCustomerId,
        },
      },
      limit: 1,
      depth: 0,
    })

    if (subscriptionResult.docs.length === 0) {
      return NextResponse.json({ error: 'Abbonamento non trovato' }, { status: 404 })
    }

    const subscription = subscriptionResult.docs[0]
    let hasAccess = user.role === 'super-admin'

    const ownerId =
      typeof subscription.owner === 'object' && subscription.owner !== null
        ? subscription.owner.id
        : subscription.owner

    if (!hasAccess && ownerId && ownerId === user.id) {
      hasAccess = true
    }

    if (!hasAccess && Array.isArray(user.schools) && user.schools.length > 0 && subscription.id) {
      const schoolIds = user.schools
        .map(normalizeSchoolId)
        .filter((id): id is string => Boolean(id))

      if (schoolIds.length > 0) {
        const schools = await payload.find({
          collection: 'schools',
          where: {
            and: [
              {
                id: {
                  in: schoolIds,
                },
              },
              {
                subscription: {
                  equals: subscription.id,
                },
              },
            ],
          },
          limit: 1,
        })

        if (schools.docs.length > 0) {
          hasAccess = true
        }
      }
    }

    if (!hasAccess) {
      return NextResponse.json({ error: 'Accesso negato' }, { status: 403 })
    }

    if (!subscription.stripeCustomerId) {
      return NextResponse.json(
        { error: 'Questo abbonamento non è associato a Stripe' },
        { status: 400 },
      )
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('create-portal-session error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
