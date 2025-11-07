import { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Evento',
    plural: 'Eventi',
  },
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', label: 'Titolo', required: true },
    { name: 'date', type: 'date', label: 'Data', required: true },
    { name: 'description', type: 'richText', label: 'Descrizione' },
    { name: 'location', type: 'text', label: 'Luogo' },
    { name: 'cover', type: 'upload', relationTo: 'media', label: 'Copertina' },
  ],
}
