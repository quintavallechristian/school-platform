import { headers } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { School } from '@/payload-types'

/**
 * Utility functions per gestire il multi-tenancy nel frontend
 */

/**
 * Ottiene la scuola corrente basandosi sull'hostname o sullo slug
 *
 * @param slug - Slug della scuola (opzionale, per routing basato su path)
 * @returns School | null
 */
export async function getCurrentSchool(slug?: string): Promise<School | null> {
  const payload = await getPayload({ config: configPromise })

  // Se abbiamo lo slug, cerchiamo direttamente
  if (slug) {
    const result = await payload.find({
      collection: 'schools',
      where: {
        and: [{ slug: { equals: slug } }, { isActive: { equals: true } }],
      },
      limit: 1,
    })

    return result.docs[0] || null
  }

  // Altrimenti cerchiamo per hostname (per sottodomini)
  const headersList = await headers()
  const host = headersList.get('host') || ''

  // Estrai sottodominio
  const subdomain = host.split('.')[0]

  // Cerca per domain completo o per slug (sottodominio)
  const result = await payload.find({
    collection: 'schools',
    where: {
      and: [
        {
          or: [{ domain: { equals: host } }, { slug: { equals: subdomain } }],
        },
        { isActive: { equals: true } },
      ],
    },
    limit: 1,
  })

  return result.docs[0] || null
}

/**
 * Ottiene tutti gli articoli di una scuola
 */
export async function getSchoolArticles(schoolId: string | number, limit = 10, page = 1) {
  const payload = await getPayload({ config: configPromise })

  return await payload.find({
    collection: 'articles',
    where: {
      school: { equals: schoolId },
    },
    sort: '-publishedAt',
    limit,
    page,
  })
}

/**
 * Ottiene tutti gli eventi di una scuola
 */
export async function getSchoolEvents(schoolId: string | number, limit = 10, page = 1) {
  const payload = await getPayload({ config: configPromise })

  return await payload.find({
    collection: 'events',
    where: {
      school: { equals: schoolId },
    },
    sort: '-date',
    limit,
    page,
  })
}

/**
 * Ottiene le comunicazioni attive di una scuola
 */
export async function getSchoolCommunications(
  schoolId: string | number,
  priority: ('low' | 'normal' | 'high' | 'urgent')[] = ['low', 'normal', 'high', 'urgent'],
  limit = 50,
  page = 1,
) {
  const payload = await getPayload({ config: configPromise })

  const now = new Date().toISOString()

  return await payload.find({
    collection: 'communications',
    where: {
      and: [
        { school: { equals: schoolId } },
        { isActive: { equals: true } },
        { priority: { in: priority } },
        { publishedAt: { less_than_equal: now } },
        {
          or: [{ expiresAt: { greater_than: now } }, { expiresAt: { exists: false } }],
        },
      ],
    },
    sort: '-publishedAt',
    limit,
    page,
  })
}

/**
 * Ottiene il menù attivo di una scuola
 */
export async function getSchoolActiveMenu(schoolId: string | number) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'menu',
    where: {
      and: [{ school: { equals: schoolId } }, { isActive: { equals: true } }],
    },
    limit: 1,
  })

  return result.docs[0] || null
}

/**
 * Ottiene le pagine da mostrare nella navbar di una scuola
 */
export async function getSchoolNavbarPages(schoolId: string | number) {
  const payload = await getPayload({ config: configPromise })

  return await payload.find({
    collection: 'pages',
    where: {
      and: [{ school: { equals: schoolId } }, { showInNavbar: { equals: true } }],
    },
    sort: 'navbarOrder',
  })
}

/**
 * Ottiene gli insegnanti di una scuola
 */
export async function getSchoolTeachers(schoolId: string | number) {
  const payload = await getPayload({ config: configPromise })

  return await payload.find({
    collection: 'teachers',
    where: {
      school: { equals: schoolId },
    },
    sort: 'name',
  })
}

/**
 * Ottiene i giorni speciali del calendario di una scuola
 */
export async function getSchoolCalendarDays(
  schoolId: string | number,
  startDate?: Date,
  endDate?: Date,
) {
  const payload = await getPayload({ config: configPromise })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let where: any = {
    school: { equals: schoolId },
  }

  if (startDate && endDate) {
    where = {
      and: [
        { school: { equals: schoolId } },
        {
          or: [
            {
              and: [
                { startDate: { greater_than_equal: startDate.toISOString() } },
                { startDate: { less_than_equal: endDate.toISOString() } },
              ],
            },
            {
              and: [
                { endDate: { greater_than_equal: startDate.toISOString() } },
                { endDate: { less_than_equal: endDate.toISOString() } },
              ],
            },
          ],
        },
      ],
    }
  }

  return await payload.find({
    collection: 'calendar-days',
    where,
    sort: 'startDate',
  })
}

/**
 * Ottiene tutte le scuole attive (per landing page)
 */
export async function getAllActiveSchools() {
  const payload = await getPayload({ config: configPromise })

  return await payload.find({
    collection: 'schools',
    where: {
      isActive: { equals: true },
    },
    sort: 'name',
  })
}

/**
 * Verifica se una scuola è attiva e accessibile
 */
export async function isSchoolActive(schoolId: string | number): Promise<boolean> {
  const payload = await getPayload({ config: configPromise })

  try {
    const school = await payload.findByID({
      collection: 'schools',
      id: schoolId,
    })

    return school?.isActive || false
  } catch (_error) {
    return false
  }
}

/**
 * Ottiene una pagina specifica di una scuola per slug
 */
export async function getSchoolPage(schoolId: string | number, pageSlug: string) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    where: {
      and: [{ school: { equals: schoolId } }, { slug: { equals: pageSlug } }],
    },
    limit: 1,
  })

  return result.docs[0] || null
}

/**
 * Ottiene un articolo specifico di una scuola per slug
 */
export async function getSchoolArticle(schoolId: string | number, articleSlug: string) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'articles',
    where: {
      and: [{ school: { equals: schoolId } }, { slug: { equals: articleSlug } }],
    },
    limit: 1,
  })

  return result.docs[0] || null
}

/**
 * Ottiene un articolo specifico di una scuola per slug (alias per compatibilità)
 */
export async function getSchoolArticleBySlug(schoolId: string | number, articleSlug: string) {
  return getSchoolArticle(schoolId, articleSlug)
}

/**
 * Ottiene un evento specifico di una scuola per ID
 */
export async function getSchoolEvent(schoolId: string | number, eventId: string | number) {
  const payload = await getPayload({ config: configPromise })

  try {
    const event = await payload.findByID({
      collection: 'events',
      id: eventId,
    })

    // Verifica che l'evento appartenga alla scuola
    // Il campo school può essere un ID o un oggetto
    const eventSchoolId =
      event.school && typeof event.school === 'object' ? event.school.id : event.school

    if (event && eventSchoolId === schoolId) {
      return event
    }

    return null
  } catch (_error) {
    return null
  }
}

/**
 * Ottiene un evento specifico di una scuola per ID (alias per compatibilità)
 */
export async function getSchoolEventById(schoolId: string | number, eventId: string | number) {
  return getSchoolEvent(schoolId, eventId)
}
