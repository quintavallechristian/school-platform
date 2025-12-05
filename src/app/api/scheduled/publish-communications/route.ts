import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  const payload = await getPayload({ config })
  const now = new Date().toISOString()

  // Imposta l'inizio di oggi (mezzanotte) per il confronto con expiresAt
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISO = today.toISOString()

  // 1. Trova comunicazioni da pubblicare adesso
  const { docs: toActivate } = await payload.find({
    collection: 'communications',
    where: {
      and: [{ isActive: { equals: false } }, { publishedAt: { less_than_equal: now } }],
    },
    limit: 500,
  })

  for (const doc of toActivate) {
    await payload.update({
      collection: 'communications',
      id: doc.id,
      data: { isActive: true },
      context: { triggeredByCron: true },
    })
  }

  // 2. Trova comunicazioni scadute da disattivare
  const { docs: toDeactivate } = await payload.find({
    collection: 'communications',
    where: {
      and: [
        { isActive: { equals: true } },
        { expiresAt: { exists: true } },
        { expiresAt: { less_than: todayISO } },
      ],
    },
    limit: 500,
  })

  for (const doc of toDeactivate) {
    await payload.update({
      collection: 'communications',
      id: doc.id,
      data: { isActive: false },
      context: { triggeredByCron: true },
    })
  }

  return NextResponse.json({
    activated: toActivate.length,
    deactivated: toDeactivate.length,
  })
}
