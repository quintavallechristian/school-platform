import { CollectionConfig } from 'payload'

// Helper per creare i campi di un giorno
const createDayFields = (dayName: string, emoji: string = '🗓️') => ({
  name: dayName.toLowerCase(),
  type: 'group' as const,
  label: `${emoji} ${dayName}`,
  admin: {
    style: {
      borderBottom: '1px solid #e5e7eb',
      paddingBottom: '1rem',
      marginBottom: '1rem',
    },
  },
  fields: [
    {
      name: 'isSpecialDish',
      type: 'checkbox' as const,
      label: 'Piatto Unico',
      defaultValue: false,
    },
    {
      name: 'dishes',
      type: 'array' as const,
      label: 'Piatti',
      fields: [
        {
          name: 'dish',
          type: 'text' as const,
          required: true,
        },
      ],
    },
  ],
})

// Helper per creare i campi di una settimana
const createWeekFields = (weekNumber: number) => ({
  name: `week${weekNumber}`,
  type: 'group' as const,
  fields: [
    createDayFields('Lunedì'),
    createDayFields('Martedì'),
    createDayFields('Mercoledì'),
    createDayFields('Giovedì'),
    createDayFields('Venerdì'),
    {
      name: 'notes',
      type: 'textarea' as const,
      label: `Note settimana ${weekNumber}`,
      admin: {
        description: `Note o variazioni specifiche per la settimana ${weekNumber} (opzionale)`,
      },
    },
  ],
})

export const Menu: CollectionConfig = {
  slug: 'menu',
  admin: {
    useAsTitle: 'name',
    description: 'Gestisci i menù stagionali della mensa',
    defaultColumns: ['name', 'isActive', 'validFrom', 'validTo', 'updatedAt'],
  },
  access: {
    read: () => true, // pubblico
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Nome del menù (es. "Menù Autunno 2025", "Menù Inverno 2025")',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Menù Attivo',
      defaultValue: false,
      admin: {
        description:
          'Solo il menù attivo sarà visualizzato sul sito. Può esserci solo un menù attivo alla volta.',
        position: 'sidebar',
      },
    },
    {
      name: 'validFrom',
      type: 'date',
      label: 'Valido dal',
      admin: {
        description: 'Data di inizio validità',
        position: 'sidebar',
      },
    },
    {
      name: 'validTo',
      type: 'date',
      label: 'Valido fino al',
      admin: {
        description: 'Data di fine validità',
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: '📅 Settimana 1',
          fields: [createWeekFields(1)],
        },
        {
          label: '📅 Settimana 2',
          fields: [createWeekFields(2)],
        },
        {
          label: '📅 Settimana 3',
          fields: [createWeekFields(3)],
        },
        {
          label: '📅 Settimana 4',
          fields: [createWeekFields(4)],
        },
      ],
    },
    {
      name: 'generalNotes',
      type: 'textarea',
      label: 'Note Generali',
      admin: {
        description: 'Note generali valide per tutto il menù (es. informazioni sugli allergeni)',
      },
    },
  ],
}
