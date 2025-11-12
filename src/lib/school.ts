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
      depth: 2, // Popola le relazioni come homepage
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
    depth: 2, // Popola le relazioni come homepage
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
 * Ottiene tutti i progetti di una scuola
 */
export async function getSchoolProjects(schoolId: string | number, limit = 10, page = 1) {
  const payload = await getPayload({ config: configPromise })

  return await payload.find({
    collection: 'projects',
    where: {
      school: { equals: schoolId },
    },
    sort: '-createdAt',
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
 * Ottiene i testimonials di una scuola
 */
export async function getSchoolTestimonials(schoolId: string | number, limit = 50, page = 1) {
  const payload = await getPayload({ config: configPromise })

  console.log('getSchoolTestimonials called with:', { schoolId, limit, page })
  return await payload.find({
    collection: 'testimonials',
    where: {
      isActive: { equals: true },
      school: { equals: schoolId },
    },
    sort: '-date',
    limit,
    page,
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
 * Ottiene la Global Homepage per una scuola
 */
export async function getSchoolHomepage(schoolId: string | number) {
  const payload = await getPayload({ config: configPromise })

  try {
    const homepage = await payload.findGlobal({
      slug: 'homepage',
      depth: 3,
    })

    // Verifica che la homepage appartenga alla scuola
    const homepageSchoolId =
      homepage.school && typeof homepage.school === 'object' ? homepage.school.id : homepage.school

    if (homepage && String(homepageSchoolId) === String(schoolId)) {
      return homepage
    }

    return null
  } catch (error) {
    console.log('Error finding homepage:', error)
    return null
  }
}

/**
 * Ottiene la Global ChiSiamo per una scuola
 */
export async function getSchoolChiSiamo(schoolId: string | number) {
  const payload = await getPayload({ config: configPromise })

  try {
    const chiSiamo = await payload.findGlobal({
      slug: 'ChiSiamo',
      depth: 2,
    })

    console.log(chiSiamo)
    // Verifica che la pagina appartenga alla scuola
    const chiSiamoSchoolId =
      chiSiamo.school && typeof chiSiamo.school === 'object' ? chiSiamo.school.id : chiSiamo.school

    if (chiSiamo && String(chiSiamoSchoolId) === String(schoolId)) {
      return chiSiamo
    }

    return null
  } catch (error) {
    console.log('Error finding ChiSiamo:', error)
    return null
  }
}

/**
 * Ottiene la Global PrivacyPolicy per una scuola
 */
export async function getSchoolPrivacyPolicy(schoolId: string | number) {
  const payload = await getPayload({ config: configPromise })
  try {
    const privacyPolicy = await payload.findGlobal({
      slug: 'PrivacyPolicy',
      depth: 2,
    })

    const privacyPolicySchoolId =
      privacyPolicy.school && typeof privacyPolicy.school === 'object'
        ? privacyPolicy.school.id
        : privacyPolicy.school
    console.log(privacyPolicy.school)
    if (privacyPolicy && String(privacyPolicySchoolId) === String(schoolId)) {
      return privacyPolicy
    }

    return null
  } catch (error) {
    console.log('Error finding PrivacyPolicy:', error)
    return null
  }
}
/**
 * Ottiene la Global CookiePolicy per una scuola
 */
export async function getSchoolCookiePolicy(schoolId: string | number) {
  const payload = await getPayload({ config: configPromise })
  try {
    const cookiePolicy = await payload.findGlobal({
      slug: 'CookiePolicy',
      depth: 2,
    })

    const cookiePolicySchoolId =
      cookiePolicy.school && typeof cookiePolicy.school === 'object'
        ? cookiePolicy.school.id
        : cookiePolicy.school
    console.log(cookiePolicy.school)
    if (cookiePolicy && String(cookiePolicySchoolId) === String(schoolId)) {
      return cookiePolicy
    }

    return null
  } catch (error) {
    console.log('Error finding CookiePolicy:', error)
    return null
  }
}

/**
 * Ottiene una pagina specifica di una scuola per slug o ID
 */
export async function getSchoolPage(schoolId: string | number, pageSlugOrId: string | number) {
  const payload = await getPayload({ config: configPromise })

  console.log('getSchoolPage called with:', { schoolId, pageSlugOrId })

  // Se pageSlugOrId è un numero o sembra un ID MongoDB (24 caratteri hex), cerca per ID
  const isMongoId =
    typeof pageSlugOrId === 'string' && /^[a-f0-9]{24}$/i.test(pageSlugOrId.toString())
  const isNumeric = typeof pageSlugOrId === 'number' || !isNaN(Number(pageSlugOrId))

  console.log('ID detection:', { isMongoId, isNumeric })

  if (isMongoId || isNumeric) {
    try {
      console.log('Searching page by ID:', pageSlugOrId)
      const page = await payload.findByID({
        collection: 'pages',
        id: pageSlugOrId,
        depth: 2,
      })

      console.log('Page found:', page ? 'YES' : 'NO')
      if (page) {
        console.log('Page school:', page.school)
        console.log('Page title:', page.title)
      }

      // Verifica che la pagina appartenga alla scuola
      const pageSchoolId =
        page.school && typeof page.school === 'object' ? page.school.id : page.school

      console.log('Comparing schools:', {
        pageSchoolId,
        schoolId,
        pageSchoolIdStr: String(pageSchoolId),
        schoolIdStr: String(schoolId),
        match: String(pageSchoolId) === String(schoolId),
      })

      // Normalizza i confronti a stringhe
      if (page && String(pageSchoolId) === String(schoolId)) {
        console.log('School match! Returning page')
        return page
      }

      console.log('School mismatch or no page, returning null')
      return null
    } catch (error) {
      console.log('Error finding page by ID:', error)
      return null
    }
  }

  // Altrimenti cerca per slug
  const result = await payload.find({
    collection: 'pages',
    where: {
      and: [{ school: { equals: schoolId } }, { slug: { equals: pageSlugOrId } }],
    },
    limit: 1,
    depth: 2,
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

/**
 * Ottiene un progetto specifico di una scuola per ID
 */
export async function getSchoolProject(schoolId: string | number, projectId: string | number) {
  const payload = await getPayload({ config: configPromise })

  try {
    const project = await payload.findByID({
      collection: 'projects',
      id: projectId,
    })

    // Verifica che il progetto appartenga alla scuola
    const projectSchoolId =
      project.school && typeof project.school === 'object' ? project.school.id : project.school

    if (project && projectSchoolId === schoolId) {
      return project
    }

    return null
  } catch (_error) {
    return null
  }
}

/**
 * Ottiene un progetto specifico di una scuola per ID (alias per compatibilità)
 */
export async function getSchoolProjectById(schoolId: string | number, projectId: string | number) {
  return getSchoolProject(schoolId, projectId)
}

/**
 * Verifica se una feature è abilitata per una scuola
 */
export function isFeatureEnabled(
  school: School,
  feature: 'blog' | 'events' | 'projects' | 'communications' | 'calendar' | 'menu' | 'documents',
): boolean {
  // Se featureVisibility non è definito, mostra tutte le features per retrocompatibilità
  if (!school.featureVisibility) {
    return true
  }

  const featureMap = {
    blog: school.featureVisibility.showBlog,
    events: school.featureVisibility.showEvents,
    projects: school.featureVisibility.showProjects,
    communications: school.featureVisibility.showCommunications,
    calendar: school.featureVisibility.showCalendar,
    menu: school.featureVisibility.showMenu,
    documents: school.featureVisibility.showDocuments,
  }

  // Se il valore non è esplicitamente definito, mostra la feature per retrocompatibilità
  return featureMap[feature] ?? true
}

/**
 * Ottiene le features abilitate per una scuola
 */
export function getEnabledFeatures(school: School): string[] {
  const features = [
    'blog',
    'events',
    'projects',
    'communications',
    'calendar',
    'menu',
    'documents',
  ] as const
  return features.filter((feature) => isFeatureEnabled(school, feature))
}
