import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { getSchoolFullUrl } from '@/lib/linkUtils'
import type { Subscription } from '@/payload-types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Authenticate User
    const { user } = await payload.auth({ headers: req.headers })

    if (!user) {
      return NextResponse.json({ error: 'Non autorizzato. Effettua il login.' }, { status: 401 })
    }

    const { schoolSlug, priceId } = await req.json()

    if (!schoolSlug || !priceId) {
      return NextResponse.json({ error: 'schoolSlug e priceId sono richiesti' }, { status: 400 })
    }

    // Find the school with subscription populated
    const schools = await payload.find({
      collection: 'schools',
      where: {
        slug: {
          equals: schoolSlug,
        },
      },
      depth: 1,
      limit: 1,
    })

    if (schools.docs.length === 0) {
      return NextResponse.json({ error: 'Scuola non trovata' }, { status: 404 })
    }

    const school = schools.docs[0]

    const headersList = await headers()
    const host = headersList.get('host') || ''
    const schoolFullUrl = getSchoolFullUrl(school, host)

    // Security Check: Verify user has access to this school
    if (user.role !== 'super-admin') {
      const userSchoolIds = (user.schools || []).map((s) => (typeof s === 'string' ? s : s.id))
      if (!userSchoolIds.includes(school.id)) {
        return NextResponse.json({ error: 'Non autorizzato.' }, { status: 403 })
      }
    }

    // Get subscription from school
    let subscription: Subscription | null = null
    if (typeof school.subscription === 'object' && school.subscription !== null) {
      subscription = school.subscription as Subscription
    } else if (typeof school.subscription === 'string') {
      try {
        subscription = await payload.findByID({
          collection: 'subscriptions',
          id: school.subscription,
        })
      } catch (error) {
        console.error('Error fetching subscription:', error)
        subscription = null
      }
    }

    if (!subscription) {
      console.error('Subscription not found for school:', school.id)
      return NextResponse.json(
        { error: 'Abbonamento non trovato per questa scuola' },
        { status: 404 },
      )
    }

    // Prepare checkout session params
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          subscriptionId: subscription.id,
          userId: user.id,
          schoolSlug: schoolSlug,
        },
      },
      success_url: `${schoolFullUrl}/welcome?subscribed=1`,
      cancel_url: `${schoolFullUrl}`,
    }

    // If subscription already has a Stripe customer ID, use it
    // Otherwise, create a new customer using the user's email
    if (subscription.stripeCustomerId) {
      sessionParams.customer = subscription.stripeCustomerId
    } else {
      sessionParams.customer_email = user.email
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Activate subscription error:', error)
    return NextResponse.json(
      { error: "Errore durante l'attivazione dell'abbonamento." },
      { status: 500 },
    )
  }
}
