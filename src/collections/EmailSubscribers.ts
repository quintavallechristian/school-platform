import { CollectionConfig } from 'payload'
import { tenantRead, tenantCreate, tenantUpdate, tenantDelete, assignSchoolBeforeChange } from '../lib/access'

export const EmailSubscribers: CollectionConfig = {
  slug: 'email-subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'isActive', 'subscribedAt', 'school'],
    description: 'Gestisci gli iscritti alle notifiche email delle comunicazioni',
    group: 'Sistema',
  },
  access: {
    read: tenantRead,
    create: tenantCreate, // Permettiamo creazione pubblica tramite form
    update: tenantUpdate,
    delete: tenantDelete,
  },
  hooks: {
    beforeChange: [
      assignSchoolBeforeChange,
      async ({ data, operation }) => {
        // Generate unsubscribe token on create
        if (operation === 'create' && !data.unsubscribeToken) {
          data.unsubscribeToken = Math.random().toString(36).substring(2) + Date.now().toString(36)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'school',
      type: 'relationship',
      relationTo: 'schools',
      required: true,
      label: 'Scuola',
      admin: {
        description: 'Scuola per cui l\'utente riceve notifiche',
        condition: (data, siblingData, { user }) => {
          return user?.role === 'super-admin'
        },
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      label: 'Email',
      admin: {
        description: 'Indirizzo email per le notifiche',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Attivo',
      defaultValue: true,
      admin: {
        description: 'Se disattivato, non riceverà più notifiche',
      },
    },
    {
      name: 'subscribedAt',
      type: 'date',
      label: 'Data iscrizione',
      defaultValue: () => new Date().toISOString(),
      admin: {
        readOnly: true,
        date: {
          displayFormat: 'd MMMM yyyy HH:mm',
        },
      },
    },
    {
      name: 'unsubscribeToken',
      type: 'text',
      label: 'Token di disiscrizione',
      admin: {
        readOnly: true,
        description: 'Token unico per la disiscrizione',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (!value) {
              // Generate a random token for unsubscribe
              return Math.random().toString(36).substring(2) + Date.now().toString(36)
            }
            return value
          },
        ],
      },
    },
  ],
}
