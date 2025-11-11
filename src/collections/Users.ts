import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Utente',
    plural: 'Utenti',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'schools', 'createdAt'],
    group: 'Sistema',
  },
  auth: true,
  access: {
    // Super-admin vedono tutti, gli altri solo utenti con almeno una scuola in comune
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true

      if (user.schools && user.schools.length > 0) {
        return {
          schools: {
            in: user.schools,
          },
        }
      }
      return false
    },
    // Solo super-admin possono creare utenti per qualsiasi scuola
    create: ({ req: { user } }) => {
      return user?.role === 'super-admin' || user?.role === 'school-admin'
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true

      // School-admin può modificare solo utenti con almeno una scuola in comune
      if (user.role === 'school-admin' && user.schools && user.schools.length > 0) {
        return {
          schools: {
            in: user.schools,
          },
        }
      }
      return false
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true

      // School-admin può eliminare solo utenti con almeno una scuola in comune (eccetto se stesso)
      if (user.role === 'school-admin' && user.schools && user.schools.length > 0) {
        return {
          schools: {
            in: user.schools,
          },
          id: {
            not_equals: user.id,
          },
        }
      }
      return false
    },
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        {
          label: 'Super Admin',
          value: 'super-admin',
        },
        {
          label: 'School Admin',
          value: 'school-admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'Viewer',
          value: 'viewer',
        },
      ],
      admin: {
        description:
          'Super Admin: accesso globale | School Admin: gestisce la propria scuola | Editor: può modificare contenuti | Viewer: solo lettura',
        condition: (data, siblingData, { user }) => {
          // Solo super-admin può assegnare il ruolo super-admin
          return user?.role === 'super-admin'
        },
      },
      access: {
        // Solo super-admin può modificare i ruoli
        update: ({ req: { user } }) => user?.role === 'super-admin',
      },
    },
    {
      name: 'schools',
      type: 'relationship',
      relationTo: 'schools',
      hasMany: true,
      required: false, // Temporaneamente opzionale per permettere la migrazione
      admin: {
        description: 'Scuole di appartenenza',
        condition: () => {
          // Super-admin può assegnare qualsiasi scuola
          // School-admin vede solo la propria scuola
          return true
        },
      },
      access: {
        update: ({ req: { user } }) => {
          // Solo super-admin può cambiare le scuole di un utente
          return user?.role === 'super-admin'
        },
      },
      validate: (value, { operation }) => {
        // Durante l'update dell'account, permetti valori vuoti (migrazione in corso)
        if (operation === 'update') {
          return true
        }
        // Durante la creazione, richiedi almeno una scuola
        if (operation === 'create' && (!value || value.length === 0)) {
          return 'Almeno una scuola deve essere assegnata'
        }
        return true
      },
    },
    {
      name: 'firstName',
      type: 'text',
      label: 'Nome',
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Cognome',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefono',
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        // Migrazione automatica: converte school → schools
        // @ts-expect-error - Il campo school potrebbe ancora esistere nel database
        if (data.school && (!data.schools || data.schools.length === 0)) {
          // @ts-expect-error - Conversione da vecchio campo
          const schoolId = typeof data.school === 'string' ? data.school : data.school.id
          data.schools = [schoolId]
          // @ts-expect-error - Rimuovi il vecchio campo
          delete data.school
        }

        // Se non è super-admin e sta creando un utente, assegna automaticamente le sue scuole
        if (operation === 'create' && req.user && req.user.role !== 'super-admin') {
          data.schools = req.user.schools
        }

        // Se non è super-admin, non può assegnare il ruolo super-admin
        if (req.user?.role !== 'super-admin' && data.role === 'super-admin') {
          data.role = 'editor'
        }

        return data
      },
    ],
    afterRead: [
      ({ doc }) => {
        // Migrazione automatica durante la lettura: converte school → schools
        // @ts-expect-error - Il campo school potrebbe ancora esistere nel database
        if (doc.school && (!doc.schools || doc.schools.length === 0)) {
          // @ts-expect-error - Conversione da vecchio campo
          const schoolId = typeof doc.school === 'string' ? doc.school : doc.school.id
          doc.schools = [schoolId]
        }
        return doc
      },
    ],
  },
  timestamps: true,
}
