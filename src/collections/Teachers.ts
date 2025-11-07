import { CollectionConfig } from 'payload'

export const Teachers: CollectionConfig = {
  slug: 'teachers',
  labels: {
    singular: 'Insegnante',
    plural: 'Insegnanti',
  },
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Nome', required: true },
    { name: 'subject', type: 'text', label: 'Materia' },
    { name: 'bio', type: 'textarea', label: 'Biografia' },
    { name: 'photo', type: 'upload', relationTo: 'media', label: 'Foto' },
  ],
}
