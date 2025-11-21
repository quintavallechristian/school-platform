import type { CollectionConfig } from 'payload'
import {
  publicRead,
  tenantCreate,
  tenantUpdate,
  tenantDelete,
  getSchoolField,
  assignSchoolBeforeChange,
} from '@/lib/access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    singular: 'Testimonianza',
    plural: 'Testimonianze',
  },
  access: {
    read: publicRead,
    create: tenantCreate,
    update: tenantUpdate,
    delete: tenantDelete,
  },
  hooks: {
    beforeValidate: [assignSchoolBeforeChange],
  },
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'role', 'school', 'isActive'],
    group: 'Comunicazioni scuola-famiglia',
  },
  fields: [
    getSchoolField('Scuola a cui appartiene questa testimonianza'),
    {
      name: 'approved',
      type: 'checkbox',
      label: 'Approvata',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Se non approvata, la testimonianza non sarà visibile nel frontend. Solo gli admin possono approvare.',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Attiva',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Se disattivata, la testimonianza non sarà visibile nel frontend',
      },
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
      label: 'Nome Autore',
      admin: {
        description: 'Nome completo della persona che ha rilasciato la testimonianza',
      },
    },
    {
      name: 'role',
      type: 'text',
      label: 'Ruolo',
      admin: {
        description: 'Es: Genitore, Ex Studente, Insegnante, ecc.',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto',
      admin: {
        description: "Foto dell'autore (opzionale)",
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Testimonianza',
      admin: {
        description: 'Testo della testimonianza',
        rows: 5,
      },
    },
    {
      name: 'rating',
      type: 'number',
      label: 'Valutazione',
      min: 1,
      max: 5,
      admin: {
        description: 'Valutazione da 1 a 5 stelle (opzionale)',
        step: 1,
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'In Evidenza',
      defaultValue: false,
      admin: {
        description: 'Se attiva, la testimonianza sarà mostrata in evidenza',
      },
    },
    {
      name: 'date',
      type: 'date',
      label: 'Data',
      admin: {
        description: 'Data della testimonianza (opzionale)',
      },
    },
  ],
}
