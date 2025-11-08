import { CollectionConfig } from 'payload'
import { tenantRead, tenantCreate, tenantUpdate, tenantDelete, assignSchoolBeforeChange } from '../lib/access'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Evento',
    plural: 'Eventi',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'location', 'school'],
    group: 'Contenuti',
  },
  access: {
    read: tenantRead,
    create: tenantCreate,
    update: tenantUpdate,
    delete: tenantDelete,
  },
  hooks: {
    beforeChange: [assignSchoolBeforeChange],
  },
  fields: [
    {
      name: 'school',
      type: 'relationship',
      relationTo: 'schools',
      required: true,
      label: 'Scuola',
      admin: {
        description: 'Scuola a cui appartiene questo evento',
        condition: (data, siblingData, { user }) => {
          return user?.role === 'super-admin'
        },
      },
    },
    { name: 'title', type: 'text', label: 'Titolo', required: true },
    { name: 'date', type: 'date', label: 'Data', required: true },
    { name: 'description', type: 'richText', label: 'Descrizione' },
    { name: 'location', type: 'text', label: 'Luogo' },
    { name: 'cover', type: 'upload', relationTo: 'media', label: 'Copertina' },
    {
      name: 'gallery',
      type: 'relationship',
      relationTo: 'gallery',
      label: 'Galleria',
      admin: {
        description: 'Collega una galleria di immagini a questo evento (opzionale)',
      },
    },
  ],
}
