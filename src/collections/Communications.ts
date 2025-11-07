import { CollectionConfig } from 'payload'

export const Communications: CollectionConfig = {
  slug: 'communications',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'priority', 'publishedAt', 'isActive'],
    description: 'Gestisci le comunicazioni di servizio che appaiono nel popup',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titolo',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Contenuto',
    },
    {
      name: 'priority',
      type: 'select',
      required: true,
      label: 'Priorità',
      defaultValue: 'normal',
      options: [
        {
          label: 'Bassa',
          value: 'low',
        },
        {
          label: 'Normale',
          value: 'normal',
        },
        {
          label: 'Alta',
          value: 'high',
        },
        {
          label: 'Urgente',
          value: 'urgent',
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Attiva',
      defaultValue: true,
      admin: {
        description: 'Solo le comunicazioni attive vengono mostrate',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      label: 'Data pubblicazione',
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: {
          displayFormat: 'd MMMM yyyy HH:mm',
        },
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Data scadenza (opzionale)',
      admin: {
        description: 'Dopo questa data la comunicazione non verrà più mostrata',
        date: {
          displayFormat: 'd MMMM yyyy HH:mm',
        },
      },
    },
    {
      name: 'linkedArticle',
      type: 'relationship',
      relationTo: 'articles',
      label: 'Articolo Collegato',
      admin: {
        description: 'Collega un articolo per maggiori dettagli (opzionale)',
        condition: (data) => !data.linkedEvent,
      },
    },
    {
      name: 'linkedEvent',
      type: 'relationship',
      relationTo: 'events',
      label: 'Evento Collegato',
      admin: {
        description: 'Collega un evento per maggiori dettagli (opzionale)',
        condition: (data) => !data.linkedArticle,
      },
    },
  ],
}
