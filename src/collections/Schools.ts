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
    update: ({ req: { user } }) => {
      return user?.role === 'super-admin'
    },
    delete: ({ req: { user } }) => {
      return user?.role === 'super-admin'
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
      defaultValue: true,
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
      name: 'settings',
      type: 'group',
      label: 'Impostazioni',
      fields: [
        {
          name: 'homepage',
          type: 'relationship',
          relationTo: 'pages',
          label: 'Homepage',
          admin: {
            description: 'Seleziona la pagina da usare come homepage della scuola (opzionale)',
            condition: (data) => !!data?.id,
          },
        },
        {
          name: 'allowPublicRegistration',
          type: 'checkbox',
          label: 'Permetti Registrazione Pubblica',
          defaultValue: false,
          admin: {
            description: 'Gli utenti possono auto-registrarsi per questa scuola',
          },
        },
        {
          name: 'timezone',
          type: 'text',
          label: 'Fuso Orario',
          defaultValue: 'Europe/Rome',
          admin: {
            description: 'Fuso orario della scuola (es: Europe/Rome)',
          },
        },
        {
          name: 'language',
          type: 'select',
          label: 'Lingua',
          defaultValue: 'it',
          options: [
            { label: 'Italiano', value: 'it' },
            { label: 'English', value: 'en' },
            { label: 'Français', value: 'fr' },
            { label: 'Español', value: 'es' },
          ],
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
          defaultValue: 'free',
          options: [
            { label: 'Gratuito', value: 'free' },
            { label: 'Basic', value: 'basic' },
            { label: 'Premium', value: 'premium' },
            { label: 'Enterprise', value: 'enterprise' },
          ],
        },
        {
          name: 'expiresAt',
          type: 'date',
          label: 'Scadenza Abbonamento',
          admin: {
            description: 'Data di scadenza del piano corrente',
            date: {
              pickerAppearance: 'dayOnly',
            },
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
        },
        {
          name: 'maxStorage',
          type: 'number',
          label: 'Storage Massimo (MB)',
          defaultValue: 1000,
          admin: {
            description: 'Spazio di archiviazione massimo in MB',
          },
        },
      ],
    },
  ],
  timestamps: true,
}
