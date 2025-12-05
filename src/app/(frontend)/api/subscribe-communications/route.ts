import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const { email, schoolId } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email non valida' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Formato email non valido' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Check if email already exists
    const existing = await payload.find({
      collection: 'email-subscribers',
      where: {
        email: {
          equals: email.toLowerCase(),
        },
        school: {
          equals: schoolId,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      const subscriber = existing.docs[0]

      // If subscriber exists but is inactive, reactivate
      if (!subscriber.isActive) {
        await payload.update({
          collection: 'email-subscribers',
          id: subscriber.id,
          data: {
            isActive: true,
          },
        })
        return NextResponse.json({
          message: 'La tua iscrizione è stata riattivata!',
        })
      }

      return NextResponse.json(
        {
          error: 'Questa email è già iscritta alle notifiche',
        },
        { status: 409 },
      )
    }

    // Create new subscriber
    await payload.create({
      collection: 'email-subscribers',
      data: {
        email: email.toLowerCase(),
        isActive: true,
        school: schoolId,
      },
    })

    return NextResponse.json({
      message: 'Iscrizione completata! Riceverai notifiche per le nuove comunicazioni.',
    })
  } catch (error) {
    console.error('Error subscribing email:', error)
    return NextResponse.json(
      {
        error: "Errore durante l'iscrizione. Riprova più tardi.",
      },
      { status: 500 },
    )
  }
}
