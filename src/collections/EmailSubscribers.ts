import { CollectionConfig } from 'payload'
import { createPlanGuardHook } from '../lib/subscriptionAccess'

export const EmailSubscribers: CollectionConfig = {
  slug: 'email-subscribers',
  labels: {
    singular: 'Iscritto alla newsletter',
    plural: 'Iscritti alla newsletter',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'isActive', 'subscribedAt', 'school'],
    description: 'Gestisci gli iscritti alle notifiche email delle comunicazioni',
    group: 'Comunicazioni scuola-famiglia',
    components: {
      beforeList: [
        {
          path: '@/components/UpgradeMessage',
          clientProps: {
            requiredPlan: 'enterprise',
            featureName: 'Comunicazioni via mail',
            featureFlag: 'enableEmailCommunications',
          },
        },
      ],
    },
  },
  // Access control gestito dal plugin multi-tenant
  hooks: {
    beforeChange: [
      createPlanGuardHook({
        requiredPlan: 'enterprise',
        featureName: 'Comunicazioni via mail',
        featureFlag: 'enableEmailCommunications',
      }),
      async ({ data, operation }) => {
        // Generate unsubscribe token on create
        if (operation === 'create' && !data.unsubscribeToken) {
          data.unsubscribeToken = Math.random().toString(36).substring(2) + Date.now().toString(36)
        }
        return data
      },
    ],
    beforeValidate: [
      async ({ data, req, operation }) => {
        // Verifica che la combinazione email + school sia unica
        if (!data) return data

        if (operation === 'create' && data.email && data.school) {
          const existing = await req.payload.find({
            collection: 'email-subscribers',
            where: {
              and: [
                {
                  email: {
                    equals: data.email,
                  },
                },
                {
                  school: {
                    equals: data.school,
                  },
                },
              ],
            },
            limit: 1,
          })

          if (existing.docs.length > 0) {
            throw new Error('Questa email è già iscritta alle notifiche per questa scuola')
          }
        }
        return data
      },
    ],
  },
  fields: [
    // Campo school gestito automaticamente dal plugin
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email',
      admin: {
        description: 'Indirizzo email per le notifiche (può essere iscritto a più scuole)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Attivo',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Se disattivato, non riceverà più notifiche',
      },
    },
    {
      name: 'subscribedAt',
      type: 'date',
      label: 'Data iscrizione',
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
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
        position: 'sidebar',
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
