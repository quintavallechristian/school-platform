import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'school', 'createdAt'],
    group: 'Sistema',
  },
  auth: true,
  access: {
    // Super-admin vedono tutti, gli altri solo utenti della propria scuola
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true
      
      if (user.school) {
        return {
          school: {
            equals: user.school,
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
      
      // School-admin può modificare solo utenti della propria scuola
      if (user.role === 'school-admin' && user.school) {
        return {
          school: {
            equals: user.school,
          },
        }
      }
      return false
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true
      
      // School-admin può eliminare solo utenti della propria scuola (eccetto se stesso)
      if (user.role === 'school-admin' && user.school) {
        return {
          and: [
            {
              school: {
                equals: user.school,
              },
            },
            {
              id: {
                not_equals: user.id,
              },
            },
          ],
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
        description: 'Super Admin: accesso globale | School Admin: gestisce la propria scuola | Editor: può modificare contenuti | Viewer: solo lettura',
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
      name: 'school',
      type: 'relationship',
      relationTo: 'schools',
      required: true,
      admin: {
        description: 'Scuola di appartenenza',
        condition: (data, siblingData, { user }) => {
          // Super-admin può assegnare qualsiasi scuola
          // School-admin vede solo la propria scuola
          return true
        },
      },
      access: {
        update: ({ req: { user } }) => {
          // Solo super-admin può cambiare la scuola di un utente
          return user?.role === 'super-admin'
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
        // Se non è super-admin e sta creando un utente, assegna automaticamente la sua scuola
        if (operation === 'create' && req.user && req.user.role !== 'super-admin') {
          data.school = req.user.school
        }
        
        // Se non è super-admin, non può assegnare il ruolo super-admin
        if (req.user?.role !== 'super-admin' && data.role === 'super-admin') {
          data.role = 'editor'
        }
        
        return data
      },
    ],
  },
  timestamps: true,
}
