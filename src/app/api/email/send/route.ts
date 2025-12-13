import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email-service'
import { getPayload } from 'payload'
import config from '@payload-config'
import { normalizeSchoolId } from '@/lib/tenantAccess'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })

    if (!user) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
    }

    const { to, subject, html, schoolId } = await req.json()

    if (!to || !subject || !html || !schoolId) {
      return NextResponse.json(
        { error: 'Missing required fields (to, subject, html, schoolId)' },
        { status: 400 },
      )
    }

    // Prevent users dall’inviare comunicazioni per scuole non associate
    if (user.role !== 'super-admin') {
      const allowedSchoolIds = Array.isArray(user.schools)
        ? user.schools.map(normalizeSchoolId).filter((id): id is string => Boolean(id))
        : []

      if (!allowedSchoolIds.includes(String(schoolId))) {
        return NextResponse.json({ error: 'Accesso negato' }, { status: 403 })
      }
    }

    // Verifica che la scuola esista
    try {
      await payload.findByID({
        collection: 'schools',
        id: schoolId,
        depth: 0,
      })
    } catch {
      return NextResponse.json({ error: 'Scuola non trovata' }, { status: 404 })
    }

    await sendEmail(to, subject, html)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email', details: (error as Error).message },
      { status: 500 },
    )
  }
}
