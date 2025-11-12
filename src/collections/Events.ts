import { CollectionConfig } from 'payload'
import {
  tenantRead,
  tenantCreate,
  tenantUpdate,
  tenantDelete,
  assignSchoolBeforeChange,
  getSchoolField,
} from '../lib/access'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Evento',
    plural: 'Eventi',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'location', 'school'],
    group: 'Scuola',
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
    getSchoolField('Scuola a cui appartiene questo evento'),
    { name: 'title', type: 'text', label: 'Titolo', required: true },
    { name: 'date', type: 'date', label: 'Data', required: true },
    { name: 'description', type: 'richText', label: 'Descrizione' },
    { name: 'location', type: 'text', label: 'Luogo' },
    { name: 'cover', type: 'upload', relationTo: 'media', label: 'Copertina' },
    {
      name: 'gradientOverlay',
      type: 'checkbox',
      label: 'Overlay Gradiente sulla Copertina',
      defaultValue: false,
      admin: {
        description:
          "Se abilitato, aggiunge un overlay gradiente sopra l'immagine di copertina per migliorare la leggibilità del testo nell'hero",
      },
    },
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
