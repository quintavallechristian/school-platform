import { CollectionConfig } from 'payload'
import { createPlanGuardHook } from '../lib/subscriptionAccess'

export const CalendarDays: CollectionConfig = {
  slug: 'calendar-days',
  labels: {
    singular: 'Calendario',
    plural: 'Calendario',
  },
  admin: {
    useAsTitle: 'title',
    description:
      'Inserisci gli eventi significativi per la tua scuola, imposta la data di inizio e la eventuale data di fine',
    defaultColumns: ['title', 'type', 'startDate', 'endDate', 'school'],
    group: 'Scuola',
    components: {
      beforeList: [
        {
          path: '@/components/UpgradeMessage',
          clientProps: {
            requiredPlan: 'starter',
            featureName: 'Calendario',
            featureFlag: 'showCalendar',
          },
        },
      ],
    },
  },
  hooks: {
    beforeChange: [
      createPlanGuardHook({
        requiredPlan: 'starter',
        featureName: 'Calendario',
        featureFlag: 'showCalendar',
      }),
    ],
  },
  // Access control gestito dal plugin multi-tenant
  fields: [
    // Campo school gestito automaticamente dal plugin
    {
      name: 'title',
      type: 'text',
      admin: {
        description: "Inserisci il titolo dell'evento a calendario",
      },
      required: true,
      label: 'Titolo',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descrizione (opzionale)',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Tipo',
      admin: {
        position: 'sidebar',
      },
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
      name: 'linkedEvent',
      type: 'relationship',
      relationTo: 'events',
      label: 'Evento Collegato',
      admin: {
        components: {
          Field: '@/components/CalendarDays/LinkedEventField',
        },
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      label: 'Data inizio',
      admin: {
        position: 'sidebar',
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
        position: 'sidebar',
        description: 'Lasciare vuoto se è un singolo giorno',
        date: {
          displayFormat: 'd MMMM yyyy',
          pickerAppearance: 'dayOnly',
        },
      },
    },
  ],
}
