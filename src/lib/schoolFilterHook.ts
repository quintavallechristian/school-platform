import type { CollectionBeforeOperationHook } from 'payload'

/**
 * Hook beforeOperation che applica automaticamente il filtro scuola
 * basato sulla selezione dello SchoolSwitcher
 */
export const applySchoolFilterHook: CollectionBeforeOperationHook = async ({ args, operation }) => {
  // Applica solo alle operazioni di lettura (read)
  if (operation !== 'read') {
    return args
  }

  // Solo nel contesto admin (non API pubblica)
  if (!args.req?.user) {
    return args
  }

  // Solo per utenti non super-admin
  if (args.req.user.role === 'super-admin') {
    return args
  }

  // Solo se l'utente ha più di una scuola
  if (!args.req.user.schools || args.req.user.schools.length <= 1) {
    return args
  }

  // Leggi la scuola selezionata dai cookie o headers
  const selectedSchool = args.req.headers?.get?.('x-selected-school')

  if (!selectedSchool || selectedSchool === 'all') {
    return args
  }

  // Applica il filtro alla query
  args.where = {
    ...args.where,
    and: [
      ...(args.where?.and || []),
      {
        school: {
          equals: selectedSchool,
        },
      },
    ],
  }

  return args
}
