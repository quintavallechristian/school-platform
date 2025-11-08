import type { Access, AccessArgs } from 'payload'

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
    user?.role === 'super-admin' || 
    user?.role === 'school-admin' || 
    user?.role === 'editor'
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
  
  // Altri utenti vedono solo i contenuti della loro scuola
  if (user.school) {
    return {
      school: {
        equals: user.school,
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
    user?.role === 'super-admin' || 
    user?.role === 'school-admin' || 
    user?.role === 'editor'
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
  
  // School-admin ed editor possono modificare solo contenuti della loro scuola
  if ((user.role === 'school-admin' || user.role === 'editor') && user.school) {
    return {
      school: {
        equals: user.school,
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
  
  // School-admin può eliminare solo contenuti della loro scuola
  if (user.role === 'school-admin' && user.school) {
    return {
      school: {
        equals: user.school,
      },
    }
  }
  
  return false
}

/**
 * Hook beforeChange per assegnare automaticamente la scuola
 * ai nuovi contenuti creati
 */
export const assignSchoolBeforeChange = ({ req, data, operation }: any) => {
  // Se è un'operazione di creazione e l'utente non è super-admin
  if (operation === 'create' && req.user) {
    // Se super-admin non assegna automaticamente (può scegliere)
    if (req.user.role === 'super-admin' && !data.school) {
      // Non fare nulla, super-admin deve scegliere esplicitamente
      return data
    }
    
    // Per altri utenti, assegna automaticamente la loro scuola
    if (req.user.school && !data.school) {
      data.school = req.user.school
    }
  }
  
  // Previeni che utenti non super-admin modifichino la scuola
  if (operation === 'update' && req.user?.role !== 'super-admin') {
    // Rimuovi il campo school dai dati se presente
    if (data.school !== undefined) {
      // Mantieni il valore originale
      delete data.school
    }
  }
  
  return data
}

/**
 * Filtra le opzioni delle select/relationship in base alla scuola
 */
export const filterBySchool = ({ user }: any) => {
  if (!user) return false
  
  if (user.role === 'super-admin') {
    return true
  }
  
  if (user.school) {
    return {
      school: {
        equals: user.school,
      },
    }
  }
  
  return false
}
