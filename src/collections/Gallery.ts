import { CollectionConfig } from 'payload'
import { filterBySchool } from '../lib/access'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  labels: {
    singular: 'Galleria',
    plural: 'Gallerie',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'images', 'school', 'updatedAt'],
    group: 'Contenuti',
  },
  // Access control gestito dal plugin multi-tenant
  fields: [
    // Campo school gestito automaticamente dal plugin
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titolo della Galleria',
      admin: {
        description: 'Nome identificativo della galleria',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descrizione',
      admin: {
        description: 'Breve descrizione della galleria (opzionale)',
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Immagini',
      minRows: 1,
      labels: {
        singular: 'Immagine',
        plural: 'Immagini',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Immagine',
          filterOptions: filterBySchool,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Didascalia',
          admin: {
            description: "Testo descrittivo per l'immagine (opzionale)",
          },
        },
        {
          name: 'order',
          type: 'number',
          label: 'Ordine',
          admin: {
            description: 'Numero per ordinare le immagini (più basso = prima)',
          },
        },
      ],
      admin: {
        description: 'Aggiungi le immagini alla galleria',
      },
    },
  ],
}
