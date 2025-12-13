import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Contenuti',
  },
  // Accesso pubblico in lettura per permettere la visualizzazione di loghi e immagini
  access: {
    read: () => true, // Accesso pubblico per la lettura
  },
  // Access control gestito dal plugin multi-tenant per create/update/delete
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
