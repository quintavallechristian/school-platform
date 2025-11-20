import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'

// Schema di validazione per la registrazione
const registrationSchema = z.object({
  school: z.string().min(1, 'La scuola è obbligatoria'),
  parentFirstName: z.string().min(1, 'Il nome del genitore è obbligatorio'),
  parentLastName: z.string().min(1, 'Il cognome del genitore è obbligatorio'),
  parentEmail: z.string().email('Email non valida'),
  childFirstName: z.string().min(1, 'Il nome del bambino è obbligatorio'),
  childLastName: z.string().min(1, 'Il cognome del bambino è obbligatorio'),
  childClassroom: z.string().min(1, 'La sezione/classe è obbligatoria'),
})

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    // Valida i dati in input
    const validationResult = registrationSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Dati non validi',
          details: validationResult.error.issues,
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Verifica che la scuola esista
    const school = await payload.findByID({
      collection: 'schools',
      id: data.school,
    })

    if (!school) {
      return NextResponse.json(
        { error: 'Scuola non trovata' },
        { status: 404 }
      )
    }

    // Verifica che l'email non sia già registrata come utente
    const existingUser = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: data.parentEmail,
        },
      },
    })

    if (existingUser.docs.length > 0) {
      return NextResponse.json(
        { error: 'Questa email è già registrata. Se hai dimenticato la password, contatta la scuola.' },
        { status: 409 }
      )
    }

    // Verifica che non ci sia già una richiesta pending con questa email
    const existingRegistration = await payload.find({
      collection: 'parent-registrations',
      where: {
        and: [
          {
            parentEmail: {
              equals: data.parentEmail,
            },
          },
          {
            status: {
              equals: 'pending',
            },
          },
        ],
      },
    })

    if (existingRegistration.docs.length > 0) {
      return NextResponse.json(
        { error: 'Hai già una richiesta in attesa di approvazione per questa email.' },
        { status: 409 }
      )
    }

    // Crea la richiesta di registrazione
    const registration = await payload.create({
      collection: 'parent-registrations',
      data: {
        school: data.school,
        parentFirstName: data.parentFirstName,
        parentLastName: data.parentLastName,
        parentEmail: data.parentEmail,
        childFirstName: data.childFirstName,
        childLastName: data.childLastName,
        childClassroom: data.childClassroom,
        status: 'pending',
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Richiesta di registrazione inviata con successo. Riceverai una conferma via email quando sarà approvata.',
        registrationId: registration.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Errore durante la registrazione:', error)
    return NextResponse.json(
      { error: 'Errore durante la registrazione. Riprova più tardi.' },
      { status: 500 }
    )
  }
}
