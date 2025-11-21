import { CollectionConfig } from 'payload'
import {
  tenantRead,
  tenantCreate,
  tenantUpdate,
  tenantDelete,
  assignSchoolBeforeChange,
  getSchoolField,
} from '../lib/access'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Articolo',
    plural: 'Articoli',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', 'school'],
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
    getSchoolField('Scuola a cui appartiene questo articolo'),
    {
      name: 'title',
      type: 'text',
      required: true,
    },
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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'gallery',
      type: 'relationship',
      relationTo: 'gallery',
      label: 'Galleria',
      admin: {
        description: 'Collega una galleria di immagini a questo articolo (opzionale)',
      },
    },
  ],
}
