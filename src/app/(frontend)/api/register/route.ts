import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { generateUniqueSlug } from '@/lib/slug'
import { registerSchoolSchema } from '@/lib/validations/register'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input with Zod schema
    const validationResult = registerSchoolSchema.safeParse(body)

    if (!validationResult.success) {
      // Get first error message
      const firstError = validationResult.error.issues[0]
      return NextResponse.json({ error: firstError.message }, { status: 400 })
    }

    const { email, firstName, lastName, schoolName, password } = validationResult.data

    const payload = await getPayload({ config })

    // Check if email already exists
    const existing = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email.toLowerCase(),
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json(
        {
          error: 'Questa email è già iscritta alla piattaforma',
        },
        { status: 409 },
      )
    }

    // Generate unique slug for school
    const schoolSlug = await generateUniqueSlug(schoolName, payload)

    // Check if school with this slug already exists (double check)
    const existingSchool = await payload.find({
      collection: 'schools',
      where: {
        slug: {
          equals: schoolSlug,
        },
      },
      limit: 1,
    })

    if (existingSchool.docs.length > 0) {
      return NextResponse.json(
        {
          error: 'Questa scuola è già iscritta alla piattaforma',
        },
        { status: 409 },
      )
    }
    const { id: schoolId } = await payload.create({
      collection: 'schools',
      data: {
        name: schoolName,
        slug: schoolSlug,
        isActive: false,
      },
    })

    const { id: userId } = await payload.create({
      collection: 'users',
      data: {
        email: email.toLowerCase(),
        firstName: firstName || '',
        lastName: lastName || '',
        password,
        role: 'school-admin',
        schools: [schoolId],
      },
    })

    const { token, user: _user } = await payload.login({
      collection: 'users',
      data: { email: email.toLowerCase(), password },
    })

    if (!token) {
      throw new Error('Failed to generate authentication token')
    }

    // Imposta il cookie della sessione Payload
    const cookieStore = await cookies()
    cookieStore.set({
      name: 'payload-token',
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    })

    return NextResponse.json({
      message: 'Iscrizione completata!',
      schoolId,
      schoolSlug,
      userId,
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
