import type { Access } from 'payload'

/**
 * Access control utilities
 * La maggior parte della logica multi-tenant è ora gestita dal plugin @payloadcms/plugin-multi-tenant
 * Queste funzioni rimangono per logica di business specifica
 */

export const isSuperAdmin: Access = ({ req: { user } }) => {
  return Boolean(user?.role === 'super-admin')
}

export const isSchoolAdminOrAbove: Access = ({ req: { user } }) => {
  return Boolean(user?.role === 'super-admin' || user?.role === 'school-admin')
}

export const canEdit: Access = ({ req: { user } }) => {
  return Boolean(
    user?.role === 'super-admin' || user?.role === 'school-admin' || user?.role === 'editor',
  )
}

/**
 * Permette lettura pubblica di tutti i contenuti
 * Utile per Media e Documents che devono essere accessibili dal frontend
 */
export const publicRead: Access = () => {
  return true
}

/**
 * Filtra le opzioni delle select/relationship in base alla scuola
 * Usato per filterOptions nei campi relationship (es. upload image)
 */
export const filterBySchool = ({ user }: { user: any }) => {
  if (!user) return false

  if (user.role === 'super-admin') {
    return true
  }

  if (user.schools && user.schools.length > 0) {
    // Estrai gli ID delle scuole - supporta vari formati:
    // - stringhe: "id"
    // - oggetti con id: { id: "..." }
    // - oggetti dal plugin multi-tenant: { school: "id" }
    const schoolIds = user.schools
      .map((school: any) => {
        if (typeof school === 'string') return school
        if (typeof school === 'object' && school !== null) {
          return school.school || school.id || school
        }
        return school
      })
      .filter(Boolean)
      .map(String)
    return {
      school: {
        in: schoolIds,
      },
    }
  }

  return false
}

/**
 * Helper per verificare se una feature è abilitata per la scuola dell'utente
 * Usato per controllare la visibilità delle collezioni nella sidebar admin
 */
export const isFeatureEnabledForUser = async ({
  user,
  feature,
}: {
  user?: { role?: string; schools?: string[] | { id: string }[] }
  feature:
    | 'showBlog'
    | 'showEvents'
    | 'showProjects'
    | 'showEducationalOfferings'
    | 'showCalendar'
    | 'showMenu'
    | 'showDocuments'
    | 'showCommunications'
    | 'showParentsArea'
    | 'showChiSiamo'
}): Promise<boolean> => {
  // Super-admin vede sempre tutto
  if (user?.role === 'super-admin') {
    return false // false = non nascondere (show)
  }

  // Se l'utente non ha scuole assegnate, nascondi
  if (!user?.schools || user.schools.length === 0) {
    return true // true = nascondi (hide)
  }

  try {
    // Importa dinamicamente per evitare circular dependencies
    const { getPayload } = await import('payload')
    const configPromise = await import('@payload-config')
    const payload = await getPayload({ config: configPromise.default })

    // Ottieni la prima scuola dell'utente
    const firstSchoolId = typeof user.schools[0] === 'string' ? user.schools[0] : user.schools[0].id

    const school = await payload.findByID({
      collection: 'schools',
      id: firstSchoolId,
    })

    // Se la scuola non ha featureVisibility, mostra tutto (retrocompatibilità)
    if (!school?.featureVisibility) {
      return false // false = non nascondere (show)
    }

    // Controlla il feature flag specifico
    const isEnabled = school.featureVisibility[feature]

    // Se il flag è undefined, mostra per retrocompatibilità
    if (isEnabled === undefined) {
      return false // false = non nascondere (show)
    }

    // Ritorna l'inverso: se enabled = true, nascondi = false
    return !isEnabled
  } catch (error) {
    console.error('Error checking feature visibility:', error)
    // In caso di errore, mostra la collezione per sicurezza
    return false // false = non nascondere (show)
  }
}
