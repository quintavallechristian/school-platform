import type { CollectionConfig } from 'payload'

/**
 * Subscriptions Collection
 *
 * Manages subscription plans independently from schools.
 * A subscription can cover one or more schools depending on the plan:
 * - Starter: 1 school
 * - Professional: 1 school
 * - Enterprise: 2 schools
 */
export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  labels: {
    singular: 'Abbonamento',
    plural: 'Abbonamenti',
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['owner', 'plan', 'status', 'createdAt'],
    group: 'Configurazione',
  },
  access: {
    // Super-admin can do everything
    // School-admin can only read their own subscription
    create: ({ req: { user } }) => {
      return user?.role === 'super-admin'
    },
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true

      // School-admin can only read their own subscription
      if (user.role === 'school-admin') {
        return {
          owner: {
            equals: user.id,
          },
        }
      }

      return false
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true

      // School-admin can only update their own subscription (limited fields via field-level access)
      if (user.role === 'school-admin') {
        return {
          owner: {
            equals: user.id,
          },
        }
      }

      return false
    },
    delete: ({ req: { user } }) => {
      return user?.role === 'super-admin'
    },
  },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Titolare',
      admin: {
        description: "L'utente che gestisce questo abbonamento",
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'plan',
          type: 'select',
          required: true,
          defaultValue: 'starter',
          label: 'Piano',
          options: [
            { label: 'Starter', value: 'starter' },
            { label: 'Professional', value: 'professional' },
            { label: 'Enterprise', value: 'enterprise' },
          ],
          admin: {
            width: '50%',
          },
          access: {
            update: ({ req: { user } }) => user?.role === 'super-admin',
          },
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'trial',
          label: 'Stato',
          options: [
            { label: 'Trial', value: 'trial' },
            { label: 'Attivo', value: 'active' },
            { label: 'Cancellato', value: 'cancelled' },
            { label: 'Scaduto', value: 'expired' },
          ],
          admin: {
            width: '50%',
          },
          access: {
            update: ({ req: { user } }) => user?.role === 'super-admin',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'trialEndsAt',
          type: 'date',
          label: 'Fine Trial',
          admin: {
            width: '33%',
            description: 'Data di fine del periodo di prova',
            date: {
              displayFormat: 'dd/MM/yyyy',
            },
          },
          access: {
            update: ({ req: { user } }) => user?.role === 'super-admin',
          },
        },
        {
          name: 'renewsAt',
          type: 'date',
          label: 'Prossimo Rinnovo',
          admin: {
            width: '33%',
            description: 'Data del prossimo rinnovo automatico',
            date: {
              displayFormat: 'dd/MM/yyyy',
            },
          },
          access: {
            update: ({ req: { user } }) => user?.role === 'super-admin',
          },
        },
        {
          name: 'expiresAt',
          type: 'date',
          label: 'Scadenza',
          admin: {
            width: '33%',
            description: 'Data di scadenza (per abbonamenti cancellati)',
            date: {
              displayFormat: 'dd/MM/yyyy',
            },
          },
          access: {
            update: ({ req: { user } }) => user?.role === 'super-admin',
          },
        },
      ],
    },
    {
      name: 'maxSchools',
      type: 'number',
      required: true,
      defaultValue: 1,
      label: 'Numero Massimo Scuole',
      admin: {
        description: 'Numero massimo di scuole che possono utilizzare questo abbonamento',
      },
      access: {
        update: ({ req: { user } }) => user?.role === 'super-admin',
      },
    },
    {
      type: 'collapsible',
      label: 'Integrazione Stripe',
      admin: {
        condition: (data) => {
          return !!data?.stripeCustomerId || !!data?.stripeSubscriptionId
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'stripeCustomerId',
              type: 'text',
              label: 'Stripe Customer ID',
              admin: {
                width: '50%',
                readOnly: true,
              },
              access: {
                read: ({ req: { user } }) =>
                  user?.role === 'super-admin' || user?.role === 'school-admin',
                update: ({ req: { user } }) => user?.role === 'super-admin',
              },
            },
            {
              name: 'stripeSubscriptionId',
              type: 'text',
              label: 'Stripe Subscription ID',
              admin: {
                width: '50%',
                readOnly: true,
              },
              access: {
                read: ({ req: { user } }) =>
                  user?.role === 'super-admin' || user?.role === 'school-admin',
                update: ({ req: { user } }) => user?.role === 'super-admin',
              },
            },
          ],
        },
        {
          name: 'selectedPriceId',
          type: 'text',
          label: 'Price ID Selezionato',
          admin: {
            description: 'Il priceId Stripe selezionato durante la registrazione',
            readOnly: true,
          },
          access: {
            read: ({ req: { user } }) =>
              user?.role === 'super-admin' || user?.role === 'school-admin',
            update: ({ req: { user } }) => user?.role === 'super-admin',
          },
        },
      ],
    },
    {
      type: 'ui',
      name: 'manageSubscription',
      admin: {
        components: {
          Field: '@/components/SubscriptionManageButton',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Set maxSchools based on plan
        if (operation === 'create' || data.plan) {
          const planLimits: Record<string, number> = {
            starter: 1,
            professional: 1,
            enterprise: 2,
          }
          data.maxSchools = planLimits[data.plan] || 1
        }

        return data
      },
    ],
  },
  timestamps: true,
}
