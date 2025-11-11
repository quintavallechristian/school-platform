import { CollectionConfig } from 'payload'
import {
  tenantRead,
  tenantCreate,
  tenantUpdate,
  tenantDelete,
  assignSchoolBeforeChange,
  getSchoolField,
} from '../lib/access'

export const CalendarDays: CollectionConfig = {
  slug: 'calendar-days',
  labels: {
    singular: 'Calendario',
    plural: 'Calendario',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'startDate', 'endDate', 'school'],
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
    getSchoolField('Scuola a cui appartiene questo evento del calendario'),
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titolo',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descrizione',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Tipo',
      options: [
        {
          label: 'Festività',
          value: 'holiday',
        },
        {
          label: 'Chiusura',
          value: 'closure',
        },
        {
          label: 'Evento',
          value: 'event',
        },
        {
          label: 'Gita',
          value: 'trip',
        },
      ],
      defaultValue: 'holiday',
    },
    {
      name: 'cost',
      type: 'text',
      label: 'Costo',
      admin: {
        description: 'Costo dell\'evento (es. "15€" o "Gratuito")',
        condition: (data) => data.type === 'event',
      },
    },
    {
      name: 'linkedEvent',
      type: 'relationship',
      relationTo: 'events',
      label: 'Evento Collegato',
      admin: {
        description: 'Collega un evento per maggiori dettagli',
        condition: (data) => data.type === 'event' || data.type === 'trip',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      label: 'Data inizio',
      admin: {
        date: {
          displayFormat: 'd MMMM yyyy',
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'Data fine (opzionale)',
      admin: {
        description: 'Lasciare vuoto se è un singolo giorno',
        date: {
          displayFormat: 'd MMMM yyyy',
          pickerAppearance: 'dayOnly',
        },
      },
    },
  ],
}
