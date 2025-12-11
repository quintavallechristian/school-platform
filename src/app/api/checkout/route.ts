import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { getSchoolBaseHref } from '@/lib/linkUtils'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config })

    // 1. Security Check: Authenticate User
    const { user } = await payload.auth({ headers: req.headers })

    if (!user) {
      return NextResponse.json({ error: 'Non autorizzato. Effettua il login.' }, { status: 401 })
    }

    const { priceId, schoolId, schoolSlug, userId } = await req.json()

    // Find the school
    const schools = await payload.find({
      collection: 'schools',
      where: {
        slug: {
          equals: schoolSlug,
        },
      },
      limit: 1,
    })

    if (schools.docs.length === 0) {
      return NextResponse.json({ error: 'Scuola non trovata' }, { status: 404 })
    }

    const school = schools.docs[0]
    const headersList = await headers()
    const host = headersList.get('host') || ''
    const baseHref = getSchoolBaseHref(school, host)

    // 2. Security Check: Validate User
    // Ensure the user initiating the checkout is the same as the one in the body,
    // OR the user is a super-admin.
    if (user.id !== userId && user.role !== 'super-admin') {
      return NextResponse.json({ error: 'Non autorizzato.' }, { status: 403 })
    }

    const trialEnd = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // 30 giorni
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_end: trialEnd,
        metadata: {
          schoolId,
          userId,
          schoolSlug,
        },
      },
      success_url: `/${baseHref}/welcome?subscribed=1`,
      cancel_url: `/${baseHref}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Errore durante la creazione della sessione di checkout.' },
      { status: 500 },
    )
  }
}
