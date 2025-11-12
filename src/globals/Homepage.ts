import { GlobalConfig } from 'payload'
import { getSchoolField, publicRead, tenantUpdate } from '../lib/access'
import { pageBlocks, shapeDividerFields } from '../lib/blocks'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Home Page',
  admin: {
    group: 'Struttura Sito',
    description: 'Configura i contenuti della home page',
  },
  access: {
    read: publicRead,
    update: tenantUpdate,
  },
  fields: [
    getSchoolField('Scuola a cui appartiene questa configurazione'),
    {
      name: 'customizeHomepage',
      type: 'checkbox',
      label: 'Personalizza Homepage',
      defaultValue: false,
      admin: {
        description:
          'Se disabilitato, verrà mostrata la homepage di default con articoli ed eventi. Se abilitato, puoi personalizzare completamente la homepage.',
      },
    },
    // Configurazione copertina
    {
      name: 'heroSettings',
      type: 'group',
      label: 'Configurazione copertina',
      admin: {
        description: "Personalizza l'hero di default della pagina",
        condition: (data) => data.customizeHomepage === true,
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
            description: "Testo che appare sotto il titolo nell'hero",
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
            description: "Immagine opzionale per lo sfondo dell'hero",
            condition: (data, siblingData) => siblingData?.showHero === true,
          },
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
              "Se abilitato, aggiunge un overlay gradiente sopra l'immagine per migliorare la leggibilità del testo",
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
          'Aggiungi sezioni personalizzate come call-to-action, team cards, feature grids, ecc.',
        condition: (data) => data.customizeHomepage === true,
      },
      blocks: pageBlocks,
    },
  ],
}
