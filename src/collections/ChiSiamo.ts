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
import { shapeDividerFields } from '../lib/blocks'

export const ChiSiamo: CollectionConfig = {
  slug: 'chi-siamo',
  labels: {
    singular: 'Chi siamo',
    plural: 'Chi siamo',
  },
  admin: {
    group: 'Scuola',
    description: 'Configura i contenuti della pagina Chi Siamo',
    defaultColumns: ['name', 'school', 'isActive'],
    hidden: false,
    components: {
      beforeList: [
        {
          path: '@/components/UpgradeMessage',
          clientProps: {
            requiredPlan: 'starter',
            featureName: 'Chi Siamo',
            featureFlag: 'showChiSiamo',
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
      defaultValue: 'Chi Siamo',
      admin: {
        description: 'Dai un nome a questa versione della pagina Chi Siamo',
      },
    },
    {
      name: 'heroSettings',
      type: 'group',
      label: 'Configurazione copertina',
      admin: {
        description: "Personalizza la copertina di default della pagina",
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
          defaultValue: 'Chi Siamo',
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
            description: "Testo che appare sotto il titolo nella copertina",
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
            description: "Immagine opzionale per lo sfondo della copertina",
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
    {
      name: 'content',
      type: 'richText',
      label: 'Contenuto principale',
      admin: {
        description: 'Testo principale che appare dopo la copertina',
      },
    },
    // Sezione insegnanti
    {
      name: 'teachersSection',
      type: 'group',
      label: 'Sezione Insegnanti',
      admin: {
        description: 'Configura la sezione con la lista degli insegnanti',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Mostra lista insegnanti',
          defaultValue: true,
          admin: {
            description: 'Se abilitato, verrà mostrata la lista degli insegnanti della scuola',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Titolo sezione',
          defaultValue: 'Il Nostro Team',
          admin: {
            description: 'Titolo della sezione insegnanti',
            condition: (data, siblingData) => siblingData?.enabled === true,
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Sottotitolo sezione',
          admin: {
            description: 'Sottotitolo opzionale per la sezione insegnanti',
            condition: (data, siblingData) => siblingData?.enabled === true,
          },
        },
      ],
    },
  ],
}
