import type { CollectionConfig } from 'payload'
import { filterBySchool } from '@/lib/access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    singular: 'Testimonianza',
    plural: 'Testimonianze',
  },
  // Access control gestito dal plugin multi-tenant
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'role', 'school', 'isActive'],
    group: 'Comunicazioni scuola-famiglia',
  },
  fields: [
    // Campo school gestito automaticamente dal plugin
    {
      name: 'approved',
      type: 'checkbox',
      label: 'Approvata',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Se non approvata, la testimonianza non sarà visibile nel sito. Solo gli admin possono approvare.',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Attiva',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Se disattivata, la testimonianza non sarà visibile nel sito',
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
      filterOptions: filterBySchool,
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
