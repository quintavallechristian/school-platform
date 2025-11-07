import { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  labels: {
    singular: 'Galleria',
    plural: 'Gallerie',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'images', 'updatedAt'],
  },
  access: {
    read: () => true, // pubblico
  },
  fields: [
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
    // Relazioni con altre collection
    {
      name: 'linkedTo',
      type: 'group',
      label: 'Collegata a',
      admin: {
        description: 'Specifica a quale contenuto è collegata questa galleria (opzionale)',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          label: 'Tipo di contenuto',
          options: [
            { label: 'Nessuno', value: 'none' },
            { label: 'Articolo', value: 'article' },
            { label: 'Pagina', value: 'page' },
            { label: 'Evento', value: 'event' },
          ],
          defaultValue: 'none',
        },
        {
          name: 'article',
          type: 'relationship',
          relationTo: 'articles',
          label: 'Articolo',
          admin: {
            condition: (data, siblingData) => siblingData.type === 'article',
          },
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          label: 'Pagina',
          admin: {
            condition: (data, siblingData) => siblingData.type === 'page',
          },
        },
        {
          name: 'event',
          type: 'relationship',
          relationTo: 'events',
          label: 'Evento',
          admin: {
            condition: (data, siblingData) => siblingData.type === 'event',
          },
        },
      ],
    },
  ],
}
