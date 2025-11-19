import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const { priceId, schoolId, schoolSlug, userId } = await req.json()
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
    success_url: `${process.env.NEXT_PUBLIC_URL}/${schoolSlug}/welcome?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/`,
  })

  return NextResponse.json({ url: session.url })
}
