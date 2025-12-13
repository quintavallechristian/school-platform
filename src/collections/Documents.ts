import { CollectionConfig } from 'payload'
import { createPlanGuardHook } from '../lib/subscriptionAccess'

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: {
    singular: 'Documento',
    plural: 'Documenti',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'school', 'updatedAt'],
    group: 'Comunicazioni scuola-famiglia',
    description: 'Gestisci le sezioni di documenti scaricabili',
    components: {
      beforeList: [
        {
          path: '@/components/UpgradeMessage',
          clientProps: {
            requiredPlan: 'starter',
            featureName: 'Documenti',
            featureFlag: 'showDocuments',
          },
        },
      ],
    },
  },
  hooks: {
    beforeChange: [
      createPlanGuardHook({
        requiredPlan: 'starter',
        featureName: 'Documenti',
        featureFlag: 'showDocuments',
      }),
    ],
  },
  // Access control gestito dal plugin multi-tenant
  fields: [
    // Campo school gestito automaticamente dal plugin
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titolo Sezione',
      admin: {
        description:
          'Titolo della sezione che raggruppa questi documenti (es: "Modulistica", "Regolamenti")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descrizione Sezione',
      admin: {
        description: 'Breve descrizione della sezione (opzionale)',
      },
    },
    {
      name: 'files',
      type: 'array',
      label: 'File',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'File',
          admin: {
            description: 'PDF, DOC, XLS, o altri documenti',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Nome del documento',
          admin: {
            description: 'Nome descrittivo del documento',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descrizione del documento',
          admin: {
            description: 'Breve descrizione del contenuto (opzionale)',
          },
        },
        {
          name: 'version',
          type: 'text',
          label: 'Versione (opzionale)',
          admin: {
            description: 'Es: "v1.2", "Anno Scolastico 2024/25"',
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          label: 'In evidenza',
          defaultValue: false,
          admin: {
            description: 'Se attivo, questo documento verrà mostrato nella sezione "In evidenza"',
          },
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ordine',
      defaultValue: 0,
      admin: {
        description: 'Numero per ordinare le sezioni (più basso = prima)',
      },
    },
    {
      name: 'requiresAuth',
      type: 'checkbox',
      label: 'Richiede autenticazione',
      defaultValue: false,
      admin: {
        description: 'Se attivo, solo gli utenti autenticati potranno scaricare questi file',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Data di pubblicazione',
      admin: {
        description: 'Data in cui il documento è stato pubblicato (opzionale)',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Data di scadenza',
      admin: {
        description: 'Data dopo la quale il documento non sarà più visibile (opzionale)',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
  ],
}
