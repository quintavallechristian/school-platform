import { CollectionConfig } from 'payload'
import {
  assignSchoolBeforeChange,
  getSchoolField,
  tenantCreate,
  tenantDelete,
  tenantRead,
  tenantUpdate,
  filterBySchool,
} from '../lib/access'
import { pageBlocks, shapeDividerFields } from '../lib/blocks'

export const Homepage: CollectionConfig = {
  slug: 'homepage',
  admin: {
    group: 'Configurazione sito',
    description:
      'Qui puoi configurare lo stile della tua homepage. Puoi creare più homepage diverse e attivarle una per volta. Se non imposti alcuna homepage personalizzata, verrà utilizzata una versione di default.',
    defaultColumns: ['name', 'school', 'isActive'],
    useAsTitle: 'name',
  },
  access: {
    read: tenantRead,
    create: tenantCreate,
    update: tenantUpdate,
    delete: tenantDelete,
  },
  hooks: {
    beforeChange: [
      assignSchoolBeforeChange,
      // Valida che i blocchi utilizzati siano abilitati per la scuola
      async ({ req, data }) => {
        // Se non ci sono blocchi o non c'è una scuola, non fare nulla
        if (!data?.blocks || !data?.school) {
          return data
        }

        // Super-admin può usare qualsiasi blocco
        if (req.user?.role === 'super-admin') {
          return data
        }

        try {
          // Ottieni la scuola
          const school = await req.payload.findByID({
            collection: 'schools',
            id: data.school,
          })

          if (!school?.featureVisibility) {
            // Se non ci sono feature flags, permetti tutto per retrocompatibilità
            return data
          }

          const { featureVisibility } = school

          // Mappa dei blocchi alle rispettive funzionalità
          const blockFeatureMap: Record<string, keyof typeof featureVisibility | null> = {
            hero: null, // blocco generale, sempre visibile
            callToAction: null, // blocco generale, sempre visibile
            richText: null, // blocco generale, sempre visibile
            cardGrid: null, // blocco generale, sempre visibile
            fileDownload: null, // blocco generale, sempre visibile
            gallery: null, // blocco generale, sempre visibile
            testimonials: null, // blocco generale, sempre visibile
            articleList: 'showBlog',
            eventList: 'showEvents',
            projectList: 'showProjects',
            educationalOfferingList: 'showEducationalOfferings',
            communications: 'showCommunications',
            teacherList: 'showTeachers',
          }

          // Controlla ogni blocco
          const invalidBlocks: string[] = []
          for (const block of data.blocks) {
            const featureKey = blockFeatureMap[block.blockType]

            // Se il blocco è generale (featureKey === null), è sempre valido
            if (featureKey === null) {
              continue
            }

            // Controlla se la funzionalità è abilitata
            const isEnabled = featureVisibility[featureKey]

            // Se non è abilitata, aggiungi alla lista dei blocchi non validi
            if (!isEnabled) {
              invalidBlocks.push(block.blockType)
            }
          }

          // Se ci sono blocchi non validi, lancia un errore
          if (invalidBlocks.length > 0) {
            const blockNames = {
              articleList: 'Lista Articoli (Blog)',
              eventList: 'Lista Eventi',
              projectList: 'Lista Progetti',
              educationalOfferingList: 'Lista Piano Offerta Formativa',
              communications: 'Lista Comunicazioni',
              teacherList: 'Lista Insegnanti',
            }

            const invalidBlockNames = invalidBlocks
              .map((slug: string) => blockNames[slug as keyof typeof blockNames] || slug)
              .join(', ')

            throw new Error(
              `Non puoi utilizzare questi blocchi perché le funzionalità corrispondenti non sono abilitate per questa scuola: ${invalidBlockNames}. ` +
                `Vai nelle impostazioni della scuola per abilitare le funzionalità necessarie.`,
            )
          }
        } catch (error) {
          // Se l'errore è quello che abbiamo lanciato noi, rilancia
          if (error instanceof Error && error.message.includes('Non puoi utilizzare')) {
            throw error
          }
          // Altrimenti, logga e continua
          console.error('Error validating blocks:', error)
        }

        return data
      },
    ],
  },
  fields: [
    getSchoolField('Scuola a cui appartiene questa configurazione'),
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
      name: 'name',
      type: 'text',
      label: 'Nome',
      defaultValue: 'Home Page',
      admin: {
        description:
          'Puoi creare diverse homepage. Dagli un nome significativo per riconoscerla facilmente.',
      },
    },
    // Configurazione copertina
    {
      name: 'heroSettings',
      type: 'group',
      label: 'Configurazione copertina',
      admin: {
        description: 'Personalizza la copertina di default della pagina',
      },
      fields: [
        {
          name: 'showHero',
          type: 'checkbox',
          label: 'Mostra copertina',
          defaultValue: true,
          admin: {
            description:
              'Se disabilitato, la copertina non verrà mostrata (utile se usi un immagini personalizzate)',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Titolo',
          defaultValue: 'Home Page',
          admin: {
            description: 'Titolo che appare nella copertina',
            condition: (data, siblingData) => siblingData?.showHero === true,
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Sottotitolo',
          admin: {
            description: 'Testo che appare sotto il titolo nella copertina',
            condition: (data, siblingData) => siblingData?.showHero === true,
          },
        },
        {
          name: 'fullHeight',
          type: 'checkbox',
          label: 'Copertina a schermo intero',
          defaultValue: false,
          admin: {
            description: "Se abilitato, la copertina occuperà l'intera altezza dello schermo",
            condition: (data, siblingData) => siblingData?.showHero === true,
          },
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Immagine di sfondo',
          admin: {
            description: 'Immagine opzionale per lo sfondo della copertina',
            condition: (data, siblingData) => siblingData?.showHero === true,
          },
          filterOptions: filterBySchool,
        },
        {
          name: 'parallax',
          type: 'checkbox',
          label: 'Effetto Parallax',
          defaultValue: false,
          admin: {
            description:
              "Se abilitato, l'immagine di sfondo avrà un effetto parallax durante lo scroll",
            condition: (data, siblingData) =>
              siblingData?.showHero === true && siblingData?.backgroundImage,
          },
        },
        {
          name: 'gradientOverlay',
          type: 'checkbox',
          label: 'Overlay Gradiente',
          defaultValue: false,
          admin: {
            description:
              "Se abilitato, aggiunge uno sfondo sfumato sopra l'immagine per migliorare la leggibilità del testo",
            condition: (data, siblingData) =>
              siblingData?.showHero === true && siblingData?.backgroundImage,
          },
        },
        {
          name: 'bottomDivider',
          type: 'group',
          label: 'Divisore Inferiore',
          admin: {
            description: 'Aggiungi un divisore decorativo in fondo alla copertina',
            condition: (data, siblingData) => siblingData?.showHero === true,
          },
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Abilita divisore inferiore',
              defaultValue: false,
            },
            ...shapeDividerFields.map((field) => ({
              ...field,
              admin: {
                ...field.admin,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                condition: (data: Record<string, any>, siblingData: Record<string, any>) =>
                  siblingData?.enabled === true,
              },
            })),
          ],
        },
      ],
    },
    // Blocchi componibili
    {
      name: 'blocks',
      type: 'blocks',
      label: 'Blocchi Personalizzati',
      admin: {
        description:
          'Aggiungi sezioni personalizzate: liste articoli, comunicazioni, gallerie, ecc. I blocchi disponibili dipendono dalle funzionalità attive nelle impostazioni della scuola.',
        components: {
          Field: '@/components/FilteredBlocksField/FilteredBlocksField#FilteredBlocksField',
        },
      },
      blocks: pageBlocks,
    },
  ],
}
