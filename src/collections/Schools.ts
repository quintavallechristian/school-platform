import type { CollectionConfig } from 'payload'

export const Schools: CollectionConfig = {
  slug: 'schools',
  labels: {
    singular: 'Scuola',
    plural: 'Scuole',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'domain', 'isActive', 'createdAt'],
    group: 'Sistema',
  },
  access: {
    // Solo super-admin possono creare/modificare scuole
    create: ({ req: { user } }) => {
      return user?.role === 'super-admin'
    },
    read: ({ req: { user } }) => {
      // Super-admin vedono tutte le scuole
      if (user?.role === 'super-admin') {
        return true
      }
      // Gli altri utenti vedono solo le loro scuole
      if (user?.schools && user.schools.length > 0) {
        return {
          id: {
            in: user.schools,
          },
        }
      }
      return false
    },

    delete: ({ req: { user } }) => {
      return user?.role === 'super-admin'
    },
    update: ({ req: { user } }) => {
      if (user?.role === 'super-admin') {
        return true
      }
      if (user?.role === 'school-admin' && user.schools && user.schools.length > 0) {
        return {
          id: {
            in: user.schools,
          },
        }
      }
      return false
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nome Scuola',
      admin: {
        description: 'Il nome completo della scuola',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'Identificatore univoco per URL (es: scuola-primaria-roma)',
      },
    },
    {
      name: 'domain',
      type: 'text',
      label: 'Dominio',
      unique: true,
      admin: {
        description: 'Dominio personalizzato (es: scuola.example.com) - opzionale',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      admin: {
        description: 'Logo della scuola',
      },
    },
    {
      name: 'primaryColor',
      type: 'text',
      label: 'Colore Primario',
      defaultValue: '#3b82f6',
      admin: {
        description: 'Colore principale del tema',
        components: {
          Field: '@/components/ColorPicker/ColorPickerField',
        },
      },
    },
    {
      name: 'secondaryColor',
      type: 'text',
      label: 'Colore Secondario',
      defaultValue: '#8b5cf6',
      admin: {
        description: 'Colore secondario del tema',
        components: {
          Field: '@/components/ColorPicker/ColorPickerField',
        },
      },
    },
    {
      name: 'backgroundPrimaryColor',
      type: 'text',
      label: 'Colore di Sfondo Primario',
      defaultValue: '#fa8899',
      admin: {
        description: 'Colore di sfondo primario del tema',
        components: {
          Field: '@/components/ColorPicker/ColorPickerField',
        },
      },
    },
    {
      name: 'backgroundSecondaryColor',
      type: 'text',
      label: 'Colore di Sfondo Secondario',
      defaultValue: '#228899',
      admin: {
        description: 'Colore di sfondo secondario del tema',
        components: {
          Field: '@/components/ColorPicker/ColorPickerField',
        },
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Scuola Attiva',
      defaultValue: false,
      admin: {
        description: 'Se disattivata, il sito della scuola non sarà accessibile',
      },
    },
    {
      name: 'contactInfo',
      type: 'group',
      label: 'Informazioni di Contatto',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Telefono',
        },
        {
          name: 'address',
          type: 'textarea',
          label: 'Indirizzo',
        },
      ],
    },
    {
      name: 'featureVisibility',
      type: 'group',
      label: 'Funzionalità attive',
      admin: {
        description: 'Scegli quali funzionalità mostrare nel sito della tua scuola',
      },
      fields: [
        {
          name: 'showChiSiamo',
          type: 'checkbox',
          label: 'Mostra Chi Siamo',
          defaultValue: true,
          admin: {
            description: '📦 Piano Starter | Se attivo, la sezione "Chi Siamo" sarà visibile nel sito',
          },
        },
        {
          name: 'showBlog',
          type: 'checkbox',
          label: 'Mostra Blog',
          defaultValue: true,
          admin: {
            description: '📦 Piano Starter | Se attivo, la sezione Blog sarà visibile nel sito',
          },
        },
        {
          name: 'showEvents',
          type: 'checkbox',
          label: 'Mostra Eventi',
          defaultValue: true,
          admin: {
            description: '📦 Piano Starter | Se attivo, la sezione Eventi sarà visibile nel sito',
          },
        },
        {
          name: 'showProjects',
          type: 'checkbox',
          label: 'Mostra Progetti',
          defaultValue: false,
          admin: {
            description: '💼 Piano Professional | Aggiorna il tuo piano per attivare questa funzionalità',
          },
          access: {
            update: ({ req: { user }, data }) => {
              if (user?.role === 'super-admin') return true
              const plan = data?.subscription?.plan
              return plan === 'professional' || plan === 'enterprise'
            },
          },
        },
        {
          name: 'showCommunications',
          type: 'checkbox',
          label: 'Mostra Comunicazioni',
          defaultValue: false,
          admin: {
            description: '🏢 Piano Enterprise | Aggiorna il tuo piano per attivare questa funzionalità',
          },
          access: {
            update: ({ req: { user }, data }) => {
              if (user?.role === 'super-admin') return true
              const plan = data?.subscription?.plan
              return plan === 'enterprise'
            },
          },
        },
        {
          name: 'showCalendar',
          type: 'checkbox',
          label: 'Mostra Calendario',
          defaultValue: false,
          admin: {
            description: '💼 Piano Professional | Aggiorna il tuo piano per attivare questa funzionalità',
          },
          access: {
            update: ({ req: { user }, data }) => {
              if (user?.role === 'super-admin') return true
              const plan = data?.subscription?.plan
              return plan === 'professional' || plan === 'enterprise'
            },
          },
        },
        {
          name: 'showMenu',
          type: 'checkbox',
          label: 'Mostra Mensa',
          defaultValue: false,
          admin: {
            description: '💼 Piano Professional | Aggiorna il tuo piano per attivare questa funzionalità',
          },
          access: {
            update: ({ req: { user }, data }) => {
              if (user?.role === 'super-admin') return true
              const plan = data?.subscription?.plan
              return plan === 'professional' || plan === 'enterprise'
            },
          },
        },
        {
          name: 'showDocuments',
          type: 'checkbox',
          label: 'Mostra Documenti',
          defaultValue: false,
          admin: {
            description: '🏢 Piano Enterprise | Aggiorna il tuo piano per attivare questa funzionalità',
          },
          access: {
            update: ({ req: { user }, data }) => {
              if (user?.role === 'super-admin') return true
              const plan = data?.subscription?.plan
              return plan === 'enterprise'
            },
          },
        },
        {
          name: 'showParentsArea',
          type: 'checkbox',
          label: 'Mostra Area Riservata Genitori',
          defaultValue: false,
          admin: {
            description: '🏢 Piano Enterprise | Aggiorna il tuo piano per attivare questa funzionalità',
          },
          access: {
            update: ({ req: { user }, data }) => {
              if (user?.role === 'super-admin') return true
              const plan = data?.subscription?.plan
              return plan === 'enterprise'
            },
          },
        },
      ],
    },
    {
      name: 'subscription',
      type: 'group',
      label: 'Abbonamento',
      admin: {
        description: 'Informazioni sul piano di abbonamento',
      },

      fields: [
        {
          name: 'plan',
          type: 'select',
          label: 'Piano',
          defaultValue: 'starter',
          options: [
            { label: 'Starter', value: 'starter' },
            { label: 'Professional', value: 'professional' },
            { label: 'Enterprise', value: 'enterprise' },
          ],
          access: {
            read: ({ req: { user } }) => user?.role === 'super-admin' || user?.role === 'school-admin',
            update: ({ req: { user } }) => user?.role === 'super-admin',
          },
        },
        {
          name: 'isTrial',
          type: 'checkbox',
          label: 'Periodo di Prova',
          defaultValue: false,
          admin: {
            description: 'Se disattivata, il sito della scuola avrà terminato il periodo di prova',
          },
          access: {
            read: ({ req: { user } }) => user?.role === 'super-admin' || user?.role === 'school-admin',
            update: ({ req: { user } }) => user?.role === 'super-admin',
          },
        },
        {
          name: 'expiresAt',
          type: 'date',
          label: 'Scadenza Abbonamento',
          admin: {
            description: 'Data di scadenza del piano corrente',
            date: {
              displayFormat: 'dd/MM/YYYY',
            },
          },
          access: {
            read: ({ req: { user } }) => user?.role === 'super-admin' || user?.role === 'school-admin',
            update: ({ req: { user } }) => user?.role === 'super-admin',
          },
        },
        {
          name: 'maxUsers',
          type: 'number',
          label: 'Massimo Utenti',
          defaultValue: 5,
          admin: {
            description: 'Numero massimo di utenti amministratori',
          },
          access: {
            read: ({ req: { user } }) => user?.role === 'super-admin',
          },
        },
        {
          name: 'maxStorage',
          type: 'number',
          label: 'Storage Massimo (MB)',
          defaultValue: 1000,
          admin: {
            description: 'Spazio di archiviazione massimo in MB',
          },
          access: {
            read: ({ req: { user } }) => user?.role === 'super-admin',
          },
        },
        {
          name: 'stripeCustomerId',
          type: 'text',
          admin: {
            readOnly: true,
          },
          access: {
            read: ({ req }) => req.user?.role === 'super-admin',
            update: ({ req }) => req.user?.role === 'super-admin',
          },
        },
        {
          type: 'ui',
          name: 'manageSubscription',
          admin: {
            components: {
              Field: '@/components/ChangePlanPortalButton',
            },
          },
        },
      ],
    },
  ],
  timestamps: true,
}
