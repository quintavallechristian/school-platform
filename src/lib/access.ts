import type { Access, CollectionBeforeChangeHook, Field } from 'payload'

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
 * Hook beforeChange per assegnare automaticamente la scuola
 * ai nuovi contenuti creati
 */
export const assignSchoolBeforeChange: CollectionBeforeChangeHook = ({ req, data, operation }) => {
  // Se è un'operazione di creazione
  if (operation === 'create' && req.user) {
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
        data.school = typeof firstSchool === 'string' ? firstSchool : firstSchool.id
      }
    }
  }

  // In fase di update, valida che la scuola scelta sia tra quelle permesse
  if (operation === 'update' && req.user && data.school !== undefined) {
    // Super-admin può cambiare a qualsiasi scuola
    if (req.user.role === 'super-admin') {
      return data
    }

    // Altri utenti possono cambiare solo tra le loro scuole assegnate
    if (req.user.schools && req.user.schools.length > 0) {
      const schoolIds = req.user.schools.map((school) =>
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
  user?: { role?: string; schools?: string[] | { id: string }[] }
}) => {
  if (!user) return false

  if (user.role === 'super-admin') {
    return true
  }

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
      const schoolIds = user.schools.map((school) =>
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
