import { School } from '@/payload-types'
import type { Access, Field, PayloadRequest } from 'payload'

/**
 * Access control per collezioni multi-tenant
 * Filtra automaticamente i dati in base alla scuola dell'utente
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
 * Permette lettura solo ai contenuti della propria scuola
 * Super-admin può vedere tutto
 */
export const tenantRead: Access = ({ req: { user } }) => {
  if (!user) return false

  // Super-admin può vedere tutto
  if (user.role === 'super-admin') {
    return true
  }

  // Altri utenti vedono solo i contenuti delle loro scuole
  if (user.schools && user.schools.length > 0) {
    // Estrai gli ID delle scuole (potrebbero essere oggetti o stringhe)
    const schoolIds = user.schools.map((school) =>
      typeof school === 'string' ? school : school.id,
    )
    return {
      school: {
        in: schoolIds,
      },
    }
  }

  return false
}

/**
 * Permette lettura pubblica di tutti i contenuti
 * Utile per Media e Documents che devono essere accessibili dal frontend
 */
export const publicRead: Access = () => {
  return true
}

/**
 * Permette lettura pubblica per utenti non autenticati (frontend)
 * Per utenti autenticati (admin panel), filtra in base alla scuola
 */
export const mediaRead: Access = ({ req: { user } }) => {
  // Se l'utente non è loggato (frontend), permetti tutto
  if (!user) return true

  // Super-admin può vedere tutto
  if (user.role === 'super-admin') {
    return true
  }

  // Altri utenti vedono solo i contenuti delle loro scuole
  if (user.schools && user.schools.length > 0) {
    // Estrai gli ID delle scuole (potrebbero essere oggetti o stringhe)
    const schoolIds = user.schools.map((school) =>
      typeof school === 'string' ? school : school.id,
    )
    return {
      school: {
        in: schoolIds,
      },
    }
  }

  return false
}

/**
 * Permette creazione solo se l'utente ha i permessi
 * School-admin ed editor possono creare contenuti
 */
export const tenantCreate: Access = ({ req: { user } }) => {
  return Boolean(
    user?.role === 'super-admin' || user?.role === 'school-admin' || user?.role === 'editor',
  )
}

/**
 * Permette aggiornamento solo dei contenuti della propria scuola
 * Super-admin può modificare tutto
 */
export const tenantUpdate: Access = ({ req: { user } }) => {
  if (!user) return false

  // Super-admin può modificare tutto
  if (user.role === 'super-admin') {
    return true
  }

  // School-admin ed editor possono modificare solo contenuti delle loro scuole
  if (
    (user.role === 'school-admin' || user.role === 'editor') &&
    user.schools &&
    user.schools.length > 0
  ) {
    // Estrai gli ID delle scuole (potrebbero essere oggetti o stringhe)
    const schoolIds = user.schools.map((school) =>
      typeof school === 'string' ? school : school.id,
    )
    return {
      school: {
        in: schoolIds,
      },
    }
  }

  return false
}

/**
 * Permette eliminazione solo dei contenuti della propria scuola
 * Solo super-admin e school-admin possono eliminare
 */
export const tenantDelete: Access = ({ req: { user } }) => {
  if (!user) return false

  // Super-admin può eliminare tutto
  if (user.role === 'super-admin') {
    return true
  }

  // School-admin può eliminare solo contenuti delle loro scuole
  if (user.role === 'school-admin' && user.schools && user.schools.length > 0) {
    // Estrai gli ID delle scuole (potrebbero essere oggetti o stringhe)
    const schoolIds = user.schools.map((school) =>
      typeof school === 'string' ? school : school.id,
    )
    return {
      school: {
        in: schoolIds,
      },
    }
  }

  return false
}



/**
 * Hook per assegnare automaticamente la scuola ai nuovi contenuti
 * Può essere usato sia come beforeValidate (consigliato per campi required)
 * che come beforeChange
 */
export const assignSchoolBeforeChange = ({
  req,
  data,
  operation,
}: {
  req: PayloadRequest
  data?: any
  operation: string
}) => {
  // Se è un'operazione di creazione
  if (operation === 'create' && req.user) {
    // Se non ci sono dati, non possiamo fare nulla
    if (!data) {
      return data
    }

    // Se non è stata specificata una scuola, assegna automaticamente
    if (!data.school) {
      // Per super-admin, non assegnare automaticamente (deve scegliere)
      if (req.user.role === 'super-admin') {
        // Non fare nulla, super-admin deve scegliere esplicitamente
        return data
      }

      // Per altri utenti, assegna automaticamente la prima scuola
      if (req.user.schools && req.user.schools.length > 0) {
        const firstSchool = req.user.schools[0]
        const schoolId = typeof firstSchool === 'string' ? firstSchool : firstSchool.id
        
        // Modifica il dato e ritornalo
        data.school = schoolId
        return data
      }
    }
  }

  // In fase di update, valida che la scuola scelta sia tra quelle permesse
  if (operation === 'update' && req.user && data?.school) {
    // Super-admin può cambiare a qualsiasi scuola
    if (req.user.role === 'super-admin') {
      return data
    }

    // Altri utenti possono cambiare solo tra le loro scuole assegnate
    if (req.user.schools && req.user.schools.length > 0) {
      const schoolIds = req.user.schools.map((school: string | { id: string }) =>
        typeof school === 'string' ? school : school.id,
      )

      // Se la scuola selezionata non è tra quelle permesse, errore
      if (!schoolIds.includes(data.school)) {
        throw new Error('Non hai i permessi per assegnare questo contenuto a questa scuola')
      }
    }
  }

  return data
}

/**
 * Filtra le opzioni delle select/relationship in base alla scuola
 */
export const filterBySchool = ({
  user,
}: {
  user: any
}) => {
  if (!user) return false

  if (user.role === 'super-admin') {
    return true
  }

  if (user.schools && user.schools.length > 0) {
    // Estrai gli ID delle scuole (potrebbero essere oggetti o stringhe)
    const schoolIds = user.schools.map((school: string | School) =>
      typeof school === 'string' ? school : school.id,
    )
    return {
      school: {
        in: schoolIds,
      },
    }
  }

  return false
}

/**
 * Configurazione del campo "school" per le collezioni multi-tenant
 * Gestisce automaticamente la visibilità e le opzioni disponibili
 */
export const getSchoolField = (
  description = 'Scuola a cui appartiene questo contenuto',
): Field => ({
  name: 'school',
  type: 'relationship',
  relationTo: 'schools',
  required: true,
  label: 'Scuola',
  admin: {
    description,
    // Mostra il campo se:
    // - Sei super-admin (puoi scegliere qualsiasi scuola), oppure
    // - Sei school-admin/editor con più di una scuola (puoi scegliere tra le tue scuole)
    condition: (data, siblingData, { user }) => {
      if (user?.role === 'super-admin') return true
      if (user?.schools && user.schools.length > 1) return true
      return false
    },
  },
  // Filtra le opzioni per mostrare solo le scuole dell'utente
  filterOptions: ({ user }) => {
    if (!user) return false
    if (user.role === 'super-admin') return true

    if (user.schools && user.schools.length > 0) {
      const schoolIds = user.schools.map((school: any) =>
        typeof school === 'string' ? school : school.id,
    )
      return {
        id: {
          in: schoolIds,
        },
      }
    }
    return false
  },
})

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
    const firstSchoolId =
      typeof user.schools[0] === 'string' ? user.schools[0] : user.schools[0].id

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

