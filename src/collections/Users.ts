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
    admin: ({ req: { user } }) => {
      // I genitori non possono accedere al pannello admin
      return user?.role !== 'parent'
    },
    read: ({ req }) => {
      const user = req.user
      if (!user) return false
      if (user.role === 'super-admin') return true

      const schoolIDs = user.schools?.map((s) => (typeof s === 'object' ? s.id : s))

      if (schoolIDs?.length) {
        return {
          schools: {
            in: schoolIDs,
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
        const schoolIDs = user.schools?.map((s) => (typeof s === 'object' ? s.id : s))
        if (schoolIDs?.length) {
          return {
            schools: {
              in: schoolIDs,
            },
          }
        }
      }
      return false
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true

      // School-admin può eliminare solo utenti con almeno una scuola in comune (eccetto se stesso)
      if (user.role === 'school-admin' && user.schools && user.schools.length > 0) {
        const schoolIDs = user.schools?.map((s) => (typeof s === 'object' ? s.id : s))
        if (schoolIDs?.length) {
          return {
            schools: {
              in: schoolIDs,
            },
            id: {
              not_equals: user.id,
            },
          }
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
        {
          label: 'Genitore',
          value: 'parent',
        },
      ],
      admin: {
        description:
          'Super Admin: accesso globale | School Admin: gestisce la propria scuola | Editor: può modificare contenuti | Viewer: solo lettura | Genitore: area riservata',
        condition: (data, siblingData, { user }) => {
          // School-admin può vedere il campo per creare genitori
          return user?.role === 'super-admin' || user?.role === 'school-admin'
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
      name: 'children',
      type: 'relationship',
      relationTo: 'children',
      hasMany: true,
      label: 'Figli',
      admin: {
        description: 'Bambini associati a questo genitore',
        condition: (data, siblingData) => {
          return siblingData?.role === 'parent'
        },
      },
      access: {
        read: ({ req: { user }, data }) => {
          // Super-admin e school-admin possono sempre leggere
          if (user?.role === 'super-admin' || user?.role === 'school-admin') return true
          // Parent può vedere solo i propri figli
          if (user?.role === 'parent' && data && data.id === user.id) return true
          return false
        },
        update: ({ req: { user } }) => {
          // Solo super-admin e school-admin possono assegnare figli
          return user?.role === 'super-admin' || user?.role === 'school-admin'
        },
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const oldData = data as any
        if (oldData.school && (!data.schools || data.schools.length === 0)) {
          const schoolId = typeof oldData.school === 'string' ? oldData.school : oldData.school.id
          data.schools = [schoolId]
          delete oldData.school
        }

        // Se non è super-admin e sta creando un utente, assegna automaticamente le sue scuole
        if (operation === 'create' && req.user && req.user.role !== 'super-admin') {
          // Normalizza a ID
          data.schools = req.user.schools?.map((school) =>
            typeof school === 'string' ? school : school.id
          )
        }

        // Normalizza sempre schools a ID (in caso di oggetti completi)
        if (data.schools && Array.isArray(data.schools)) {
          data.schools = data.schools.map((school) =>
            typeof school === 'string' ? school : school.id
          )
        }

        // Normalizza anche children a ID
        if (data.children && Array.isArray(data.children)) {
          data.children = data.children.map((child) =>
            typeof child === 'string' ? child : child.id
          )
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const oldDoc = doc as any
        if (oldDoc.school && (!doc.schools || doc.schools.length === 0)) {
          const schoolId = typeof oldDoc.school === 'string' ? oldDoc.school : oldDoc.school.id
          doc.schools = [schoolId]
        }
        return doc
      },
    ],
  },
  timestamps: true,
}
