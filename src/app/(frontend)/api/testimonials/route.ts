import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    // Forza approved: false lato server
    const testimonial = await (
      await getPayload({ config: configPromise })
    ).create({
      collection: 'testimonials',
      data: {
        ...data,
        approved: false,
        isActive: true,
      },
    })
    return NextResponse.json({ success: true, testimonial })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Errore' },
      { status: 400 },
    )
  }
}
