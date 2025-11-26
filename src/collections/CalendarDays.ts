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
    group: 'Scuola',
    components: {
      beforeList: [
        {
          path: '@/components/UpgradeMessage',
          clientProps: {
            requiredPlan: 'professional',
            featureName: 'Calendario',
            featureFlag: 'showCalendar',
          },
        },
      ],
    },
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
    {
      name: 'isBookable',
      type: 'checkbox',
      label: 'Prenotabile',
      defaultValue: false,
      admin: {
        description: 'Permetti ai genitori di prenotare appuntamenti per questo evento',
      },
    },
    {
      name: 'bookingSettings',
      type: 'group',
      label: 'Impostazioni Prenotazione',
      admin: {
        condition: (data) => data.isBookable === true,
      },
      fields: [
        {
          name: 'maxCapacity',
          type: 'number',
          label: 'Posti disponibili',
          admin: {
            description:
              'Numero massimo di genitori che possono prenotare (lasciare vuoto per illimitati)',
          },
        },
        {
          name: 'bookingDeadline',
          type: 'date',
          label: 'Scadenza prenotazioni',
          admin: {
            description: 'Data limite per le prenotazioni (opzionale)',
            date: {
              displayFormat: 'dd/MM/yyyy HH:mm',
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'location',
          type: 'text',
          label: "Luogo dell'appuntamento",
          admin: {
            description: 'Es: "Aula 2A", "Sala Riunioni"',
          },
        },
        {
          name: 'duration',
          type: 'number',
          label: 'Durata (minuti)',
          admin: {
            description: 'Durata prevista di ogni appuntamento in minuti (es. 30)',
          },
        },
        {
          name: 'requiresApproval',
          type: 'checkbox',
          label: 'Richiede approvazione',
          defaultValue: true,
          admin: {
            description: 'Se attivo, le prenotazioni devono essere approvate dallo school-admin',
          },
        },
        {
          name: 'useTimeSlots',
          type: 'checkbox',
          label: 'Definisci fasce orarie',
          defaultValue: false,
          admin: {
            description:
              'Se attivo, i genitori potranno scegliere uno specifico slot orario per la prenotazione',
          },
        },
        {
          name: 'slotDuration',
          type: 'select',
          label: 'Durata slot',
          defaultValue: '30',
          options: [
            {
              label: '15 minuti',
              value: '15',
            },
            {
              label: '30 minuti',
              value: '30',
            },
            {
              label: '1 ora',
              value: '60',
            },
          ],
          admin: {
            description: 'Durata di ogni slot orario disponibile',
            condition: (data) => data.bookingSettings?.useTimeSlots === true,
          },
        },
        {
          name: 'startTime',
          type: 'text',
          label: 'Orario inizio',
          admin: {
            description: 'Orario di inizio disponibilità (formato HH:mm, es. 09:00)',
            condition: (data) => data.bookingSettings?.useTimeSlots === true,
          },
        },
        {
          name: 'endTime',
          type: 'text',
          label: 'Orario fine',
          admin: {
            description: 'Orario di fine disponibilità (formato HH:mm, es. 18:00)',
            condition: (data) => data.bookingSettings?.useTimeSlots === true,
          },
        },
      ],
    },
  ],
}
