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
            requiredPlan: 'starter',
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
                    cost: doc.cost || undefined,
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
            console.error('Errore durante la creazione automatica di calendario/comunicazione:', error)
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
    {
      name: 'addToCalendar',
      type: 'checkbox',
      label: 'Vuoi aggiungere l\'evento al calendario?',
      defaultValue: false,
      admin: {
        description:
          'Se abilitato, verrà creata automaticamente una entry nel calendario collegata a questo evento',
        position: 'sidebar',
        condition: (data) => {
          console.log("ciao", data)
          if (!data.school) return false
          return true
        },
      },
    },
    {
      name: 'sendCommunication',
      type: 'checkbox',
      label: 'Vuoi inviare una comunicazione?',
      defaultValue: false,
      admin: {
        description:
          'Se abilitato, verrà creata automaticamente una comunicazione per notificare questo evento',
        position: 'sidebar',
        condition: (data) => {
          // Nascondi la checkbox se la scuola non ha la feature comunicazioni
          if (!data.school) return false
          
          // Nota: questa è una condizione sincrona, quindi non possiamo fare query async
          // La validazione vera è nel backend. Qui mostriamo sempre la checkbox
          // ma il backend impedirà la creazione se la feature non è attiva
          return true
        },
      },
    },
  ],
}
