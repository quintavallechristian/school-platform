import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Contenuti',
  },
  // Access control gestito dal plugin multi-tenant
  // Il plugin aggiunge automaticamente il campo school
  upload: {
    disableLocalStorage: true, // obbligatorio su Vercel
  },

  fields: [
    // Campo school gestito automaticamente dal plugin
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
