import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Subscription } from '@/payload-types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ school: string }> },
) {
  try {
    const { school: schoolSlug } = await params
    const payload = await getPayload({ config })

    // Authenticate user (optional - allow public access)
    const { user } = await payload.auth({ headers: request.headers })

    // Find the school by slug with subscription populated
    const schools = await payload.find({
      collection: 'schools',
      where: {
        slug: {
          equals: schoolSlug,
        },
      },
      depth: 1, // Populate subscription relationship
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

    // Get subscription data (may be populated object or just ID)
    const subscription: Subscription | null =
      typeof school.subscription === 'object' ? school.subscription : null

    // If subscription is not populated, fetch it
    let sub = subscription
    if (!sub && typeof school.subscription === 'string') {
      try {
        sub = await payload.findByID({
          collection: 'subscriptions',
          id: school.subscription,
        })
      } catch {
        sub = null
      }
    }

    // Calculate days remaining based on subscription status
    let daysRemaining = 0
    let isExpired = false
    let willRenew = false
    let renewalFailed = false
    const isTrial = sub?.status === 'trial'

    if (sub) {
      const now = new Date()

      // Check trial status
      if (sub.status === 'trial' && sub.trialEndsAt) {
        const trialEndDate = new Date(sub.trialEndsAt)
        const diffTime = trialEndDate.getTime() - now.getTime()
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        isExpired = diffTime <= 0
        willRenew = false
      }
      // Check if subscription will renew (active subscription)
      else if (sub.renewsAt) {
        const renewsAtDate = new Date(sub.renewsAt)
        const diffTime = renewsAtDate.getTime() - now.getTime()

        // If renewsAt is in the past but no expiresAt, renewal might have failed
        if (diffTime < 0 && !sub.expiresAt) {
          renewalFailed = true
          isExpired = true
          willRenew = false
          daysRemaining = 0
        } else {
          willRenew = true
          daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          isExpired = false
        }
      }
      // Check if subscription is cancelled/expired
      else if (sub.expiresAt) {
        willRenew = false
        const expiresAtDate = new Date(sub.expiresAt)
        const diffTime = expiresAtDate.getTime() - now.getTime()
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        isExpired = diffTime <= 0
      }
      // Expired status
      else if (sub.status === 'expired') {
        isExpired = true
        daysRemaining = 0
        willRenew = false
      }
    } else {
      // No subscription means expired
      isExpired = true
      daysRemaining = 0
    }

    // For public users, return only basic info (no sensitive details)
    if (!isAdmin) {
      return NextResponse.json({
        isActive: school.isActive && !isExpired && !renewalFailed,
        isTrial: isTrial,
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
      isTrial: isTrial,
      expiresAt: sub?.expiresAt || sub?.trialEndsAt || null,
      renewsAt: sub?.renewsAt || null,
      daysRemaining: Math.max(0, daysRemaining),
      willRenew,
      renewalFailed,
      plan: sub?.plan || 'starter',
      selectedPriceId: sub?.selectedPriceId || null,
      subscriptionId: sub?.id || null,
    })
  } catch (error) {
    console.error('Error checking trial status:', error)
    return NextResponse.json(
      { error: 'Errore durante la verifica dello stato del trial' },
      { status: 500 },
    )
  }
}
