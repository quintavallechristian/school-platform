'use server'

import { z } from 'zod'
import { getPayload } from 'payload'
import config from '@payload-config'

const registrationSchema = z.object({
  school: z.string().min(1, 'La scuola è obbligatoria'),
  parentFirstName: z.string().min(1, 'Il nome è obbligatorio'),
  parentLastName: z.string().min(1, 'Il cognome è obbligatorio'),
  parentEmail: z.string().email('Email non valida'),
  password: z.string().min(8, 'La password deve contenere almeno 8 caratteri'),
  confirmPassword: z.string().min(1, 'Conferma la password'),
  childFirstName: z.string().min(1, 'Il nome del bambino è obbligatorio'),
  childLastName: z.string().min(1, 'Il cognome del bambino è obbligatorio'),
  childClassroom: z.string().min(1, 'La sezione è obbligatoria'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Le password non corrispondono',
  path: ['confirmPassword'],
})

export async function registerParent(prevState: unknown, formData: FormData) {
  const data = {
    school: formData.get('school') as string,
    parentFirstName: formData.get('parentFirstName') as string,
    parentLastName: formData.get('parentLastName') as string,
    parentEmail: formData.get('parentEmail') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
    childFirstName: formData.get('childFirstName') as string,
    childLastName: formData.get('childLastName') as string,
    childClassroom: formData.get('childClassroom') as string,
  }

  // Valida i dati
  const validationResult = registrationSchema.safeParse(data)
  if (!validationResult.success) {
    return {
      error: validationResult.error.issues[0].message,
    }
  }

  try {
    const payload = await getPayload({ config })
    const validatedData = validationResult.data

    // Verifica che la scuola esista tramite slug
    const schoolQuery = await payload.find({
      collection: 'schools',
      where: {
        slug: {
          equals: validatedData.school,
        },
      },
    })

    if (schoolQuery.docs.length === 0) {
      return {
        error: 'Scuola non trovata',
      }
    }

    const schoolId = schoolQuery.docs[0].id

    // Verifica che l'email non sia già registrata come utente
    const existingUser = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: validatedData.parentEmail,
        },
      },
    })

    if (existingUser.docs.length > 0) {
      return {
        error: 'Questa email è già registrata. Se hai dimenticato la password, contatta la scuola.',
      }
    }

    // Verifica che non ci sia già una richiesta pending con questa email
    const existingRegistration = await payload.find({
      collection: 'parent-registrations',
      where: {
        and: [
          {
            parentEmail: {
              equals: validatedData.parentEmail,
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
      return {
        error: 'Hai già una richiesta in attesa di approvazione per questa email.',
      }
    }

    // Crea la richiesta di registrazione
    await payload.create({
      collection: 'parent-registrations',
      data: {
        school: schoolId,
        parentFirstName: validatedData.parentFirstName,
        parentLastName: validatedData.parentLastName,
        parentEmail: validatedData.parentEmail,
        passwordHash: validatedData.password, // Verrà hashata dal beforeChange hook
        childFirstName: validatedData.childFirstName,
        childLastName: validatedData.childLastName,
        childClassroom: validatedData.childClassroom,
        status: 'pending',
      },
    })

    return {
      success: true,
      message: 'Richiesta di registrazione inviata con successo. Riceverai una conferma quando sarà approvata.',
    }
  } catch (error) {
    console.error('Errore durante la registrazione:', error)
    return {
      error: 'Errore durante la registrazione. Riprova più tardi.',
    }
  }
}
