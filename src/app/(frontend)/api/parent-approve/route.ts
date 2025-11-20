import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'

// Schema di validazione per l'approvazione
const approvalSchema = z.object({
  registrationId: z.string().min(1, 'ID registrazione obbligatorio'),
  action: z.enum(['approve', 'reject']),
  rejectionReason: z.string().optional(),
  temporaryPassword: z.string().min(8, 'La password deve essere di almeno 8 caratteri').optional(),
})

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    // Valida i dati in input
    const validationResult = approvalSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Dati non validi',
          details: validationResult.error.issues,
        },
        { status: 400 }
      )
    }

    const { registrationId, action, rejectionReason, temporaryPassword } = validationResult.data

    // Recupera la richiesta di registrazione
    const registration = await payload.findByID({
      collection: 'parent-registrations',
      id: registrationId,
    })

    if (!registration) {
      return NextResponse.json(
        { error: 'Richiesta di registrazione non trovata' },
        { status: 404 }
      )
    }

    if (registration.status !== 'pending') {
      return NextResponse.json(
        { error: 'Questa richiesta è già stata processata' },
        { status: 400 }
      )
    }

    // Gestisci il rifiuto
    if (action === 'reject') {
      await payload.update({
        collection: 'parent-registrations',
        id: registrationId,
        data: {
          status: 'rejected',
          rejectionReason: rejectionReason || 'Nessun motivo specificato',
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Richiesta rifiutata con successo',
      })
    }

    // Gestisci l'approvazione
    if (action === 'approve') {
      // Verifica che l'email non sia già stata usata (doppio controllo)
      const existingUser = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: registration.parentEmail,
          },
        },
      })

      if (existingUser.docs.length > 0) {
        return NextResponse.json(
          { error: 'Un utente con questa email esiste già' },
          { status: 409 }
        )
      }

      // Genera una password temporanea se non fornita
      const password = temporaryPassword || generateTemporaryPassword()

      // Crea l'utente genitore
      const schoolId = typeof registration.school === 'string' ? registration.school : registration.school?.id
      if (!schoolId) {
        return NextResponse.json(
          { error: 'Scuola non valida' },
          { status: 400 }
        )
      }

      const newUser = await payload.create({
        collection: 'users',
        data: {
          email: registration.parentEmail,
          password: password,
          role: 'parent',
          firstName: registration.parentFirstName,
          lastName: registration.parentLastName,
          schools: [schoolId],
        },
      })

      // Crea il bambino
      const newChild = await payload.create({
        collection: 'children',
        data: {
          school: schoolId,
          firstName: registration.childFirstName,
          lastName: registration.childLastName,
          classroom: registration.childClassroom,
          dateOfBirth: new Date().toISOString(), // Placeholder - potremmo aggiungere questo campo alla registrazione
        },
      })

      // Collega il bambino al genitore
      await payload.update({
        collection: 'users',
        id: newUser.id,
        data: {
          children: [newChild.id],
        },
      })

      // Aggiorna la richiesta di registrazione
      await payload.update({
        collection: 'parent-registrations',
        id: registrationId,
        data: {
          status: 'approved',
          createdUserId: newUser.id,
          createdChildId: newChild.id,
          approvedAt: new Date().toISOString(),
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Richiesta approvata con successo',
        userId: newUser.id,
        childId: newChild.id,
        temporaryPassword: password,
      })
    }

    return NextResponse.json(
      { error: 'Azione non valida' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Errore durante l\'approvazione:', error)
    return NextResponse.json(
      { error: 'Errore durante l\'approvazione. Riprova più tardi.' },
      { status: 500 }
    )
  }
}

// Funzione helper per generare una password temporanea
function generateTemporaryPassword(): string {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}
