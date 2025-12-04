import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ school: string }> },
) {
  try {
    const { school: schoolSlug } = await params
    const payload = await getPayload({ config })

    // Authenticate user (optional - allow public access)
    const { user } = await payload.auth({ headers: request.headers })

    // Find the school by slug
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

    // Check if user has access to this school (only for admins)
    const isAdmin = user && (user.role === 'super-admin' || user.role === 'school-admin')

    if (user && user.role === 'school-admin') {
      const userSchoolIds = (user.schools || []).map((s) => (typeof s === 'string' ? s : s.id))
      if (!userSchoolIds.includes(school.id)) {
        return NextResponse.json({ error: 'Accesso negato' }, { status: 403 })
      }
    }

    // Calculate days remaining based on subscription status
    let daysRemaining = 0
    let isExpired = false
    let willRenew = false
    let nextDate: Date | null = null
    let renewalFailed = false

    // Check if subscription will renew (active subscription)
    if (school.subscription?.renewsAt) {
      const renewsAtDate = new Date(school.subscription.renewsAt)
      const now = new Date()
      const diffTime = renewsAtDate.getTime() - now.getTime()

      // If renewsAt is in the past but expiresAt is not set, renewal failed
      if (diffTime < 0 && !school.subscription?.expiresAt) {
        renewalFailed = true
        isExpired = true
        willRenew = false
        daysRemaining = 0
      } else {
        willRenew = true
        nextDate = renewsAtDate
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        // For renewing subscriptions, we don't consider them "expired"
        isExpired = false
      }
    }
    // Check if subscription is cancelled/expired
    else if (school.subscription?.expiresAt) {
      willRenew = false
      nextDate = new Date(school.subscription.expiresAt)
      const now = new Date()
      const diffTime = nextDate.getTime() - now.getTime()
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      isExpired = diffTime <= 0
    }

    // For public users, return only basic info (no sensitive details)
    if (!isAdmin) {
      return NextResponse.json({
        isActive: school.isActive && !isExpired && !renewalFailed,
        isTrial: school.subscription?.isTrial || false,
        expiresAt: null, // Hide exact date from public
        renewsAt: null, // Hide exact date from public
        daysRemaining: isExpired || renewalFailed ? 0 : 1, // Se non scaduto, metti 1 per evitare il modal
        willRenew: false, // Hide renewal info from public
        renewalFailed: false, // Hide error info from public
        plan: 'starter', // Generic plan name
        selectedPriceId: null, // Hide price info from public
      })
    }

    // For admins, return full details
    return NextResponse.json({
      isActive: school.isActive || false,
      isTrial: school.subscription?.isTrial || false,
      expiresAt: school.subscription?.expiresAt || null,
      renewsAt: school.subscription?.renewsAt || null,
      daysRemaining: Math.max(0, daysRemaining),
      willRenew,
      renewalFailed,
      plan: school.subscription?.plan || 'starter',
      selectedPriceId:
        (school.subscription as unknown as { selectedPriceId?: string })?.selectedPriceId || null,
    })
  } catch (error) {
    console.error('Error checking trial status:', error)
    return NextResponse.json(
      { error: 'Errore durante la verifica dello stato del trial' },
      { status: 500 },
    )
  }
}
