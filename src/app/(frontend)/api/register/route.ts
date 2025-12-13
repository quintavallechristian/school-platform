import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { generateUniqueSlug } from '@/lib/slug'
import { registerSchoolSchema } from '@/lib/validations/register'
import { getPlanFromPrice } from '@/lib/plans'

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

    const { email, firstName, lastName, schoolName, password, priceId } = body

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
    // Calculate trial expiration date (30 days from now)
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 30)

    // Determine the plan from the priceId
    const plan = priceId ? getPlanFromPrice(priceId) : 'starter'

    // Determine maxSchools based on plan
    const planLimits: Record<string, number> = {
      starter: 1,
      professional: 1,
      enterprise: 2,
    }
    const maxSchools = planLimits[plan] || 1

    // Step 1: Create the user first (needed as subscription owner)
    const { id: userId } = await payload.create({
      collection: 'users',
      data: {
        email: email.toLowerCase(),
        firstName: firstName || '',
        lastName: lastName || '',
        password,
        role: 'school-admin',
        schools: [], // Will be updated after school creation
        // Salva l'accettazione dei termini durante la registrazione
        acceptedPrivacyPolicy: true,
        acceptedTermsOfService: true,
        acceptanceDate: new Date().toISOString(),
      },
    })

    // Step 2: Create the subscription linked to the user
    const { id: subscriptionId } = await payload.create({
      collection: 'subscriptions',
      data: {
        owner: userId,
        plan: plan,
        status: 'trial',
        trialEndsAt: trialEndsAt.toISOString(),
        maxSchools: maxSchools,
        selectedPriceId: priceId || null,
      },
    })

    // Step 3: Create the school linked to the subscription
    const { id: schoolId } = await payload.create({
      collection: 'schools',
      data: {
        name: schoolName,
        slug: schoolSlug,
        isActive: true, // Attiva immediatamente la scuola
        subscription: subscriptionId,
      },
    })

    // Step 4: Update the user with the school reference
    await payload.update({
      collection: 'users',
      id: userId,
      data: {
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
      subscriptionId,
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
