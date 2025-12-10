import { CollectionConfig } from 'payload'
import {
  tenantRead,
  tenantCreate,
  tenantUpdate,
  tenantDelete,
  assignSchoolBeforeChange,
  getSchoolField,
  filterBySchool,
} from '../lib/access'
import { richTextToPlainText } from '../lib/richTextUtils'

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
    components: {
      beforeList: [
        {
          path: '@/components/UpgradeMessage',
          clientProps: {
            requiredPlan: 'professional',
            featureName: 'Eventi',
            featureFlag: 'showEvents',
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
    beforeValidate: [assignSchoolBeforeChange],
    afterChange: [
      async ({ doc, operation, req }) => {
        // Esegui solo quando viene creato un nuovo evento
        if (operation === 'create') {
          try {
            // 1. Crea entry nel calendario se richiesto
            if (doc.addToCalendar) {
              console.log(`Creazione entry calendario per evento: "${doc.title}"`)

              // Verifica che la scuola abbia accesso alla feature calendario
              const school = await req.payload.findByID({
                collection: 'schools',
                id: typeof doc.school === 'string' ? doc.school : doc.school.id,
              })

              // Controlla se la feature calendario è abilitata
              const calendarEnabled = school?.featureVisibility?.showCalendar ?? false

              if (!calendarEnabled) {
                console.warn(
                  `⚠️  La scuola "${school?.name}" non ha accesso alla feature Calendario. Entry non creata.`,
                )
                // Non creare l'entry ma non bloccare la creazione dell'evento
              } else {
                // Converti la descrizione RichText in testo semplice
                const plainTextDescription = doc.description
                  ? richTextToPlainText(doc.description)
                  : `Evento: ${doc.title}`

                await req.payload.create({
                  collection: 'calendar-days',
                  data: {
                    title: doc.title,
                    description: plainTextDescription,
                    type: 'event',
                    startDate: doc.date,
                    linkedEvent: doc.id,
                    school: doc.school,
                  },
                })

                console.log(`✅ Entry calendario creata con successo per: "${doc.title}"`)
              }
            }

            // 2. Crea comunicazione se richiesto
            if (doc.sendCommunication) {
              // Verifica che la scuola abbia accesso alla feature calendario
              const school = await req.payload.findByID({
                collection: 'schools',
                id: typeof doc.school === 'string' ? doc.school : doc.school.id,
              })

              // Controlla se la feature calendario è abilitata
              const communicationsEnabled = school?.featureVisibility?.showCommunications ?? false

              if (!communicationsEnabled) {
                console.warn(
                  `⚠️  La scuola "${school?.name}" non ha accesso alla feature Comunicazioni. Entry non creata.`,
                )
                // Non creare l'entry ma non bloccare la creazione dell'evento
              } else {
                console.log(`Creazione comunicazione per evento: "${doc.title}"`)
                await req.payload.create({
                  collection: 'communications',
                  data: {
                    title: `Nuovo evento: ${doc.title}`,
                    content: doc.description || {
                      root: {
                        type: 'root',
                        children: [
                          {
                            type: 'paragraph',
                            children: [
                              {
                                type: 'text',
                                text: `È stato pubblicato un nuovo evento: ${doc.title}`,
                              },
                            ],
                          },
                          {
                            type: 'paragraph',
                            children: [
                              {
                                type: 'text',
                                text: `Data: ${new Date(doc.date).toLocaleDateString('it-IT', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric',
                                })}`,
                              },
                            ],
                          },
                          ...(doc.location
                            ? [
                                {
                                  type: 'paragraph',
                                  children: [
                                    {
                                      type: 'text',
                                      text: `Luogo: ${doc.location}`,
                                    },
                                  ],
                                },
                              ]
                            : []),
                        ],
                      },
                    },
                    priority: 'normal',
                    isActive: true,
                    publishedAt: new Date().toISOString(),
                    linkedEvent: doc.id,
                    school: doc.school,
                  },
                })
                console.log(`✅ Comunicazione creata con successo per: "${doc.title}"`)
              }
            }
          } catch (error) {
            console.error(
              'Errore durante la creazione automatica di calendario/comunicazione:',
              error,
            )
          }
        }
      },
    ],
  },
  fields: [
    getSchoolField('Scuola a cui appartiene questo evento'),
    { name: 'title', type: 'text', label: 'Titolo', required: true },
    { name: 'date', type: 'date', label: 'Data', required: true },
    { name: 'description', type: 'richText', label: 'Descrizione' },
    { name: 'location', type: 'text', label: 'Luogo' },
    {
      name: 'cost',
      type: 'text',
      label: 'Costo',
      admin: {
        description: 'Costo dell\'evento (es. "15€" o "Gratuito")',
      },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: 'Copertina',
      filterOptions: filterBySchool,
    },
    {
      name: 'gradientOverlay',
      type: 'checkbox',
      label: 'Sfumatura in sovraimpressione sulla Copertina',
      defaultValue: false,
      admin: {
        description:
          "Se abilitato, aggiunge uno sfondo sfumato sopra l'immagine di copertina per migliorare la leggibilità del testo nella copertina",
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
    {
      name: 'isBookable',
      type: 'checkbox',
      label: 'Prenotabile',
      defaultValue: false,
      admin: {
        description: 'Permetti ai genitori di prenotare appuntamenti per questo evento',
        position: 'sidebar',
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
    {
      name: 'addToCalendar',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/Events/AddToCalendarField',
        },
      },
    },
    {
      name: 'sendCommunication',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/Events/SendCommunicationField',
        },
      },
    },
  ],
}
