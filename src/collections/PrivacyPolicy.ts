import { CollectionConfig } from 'payload'
import {
  assignSchoolBeforeChange,
  getSchoolField,
  tenantCreate,
  tenantDelete,
  tenantRead,
  tenantUpdate,
} from '../lib/access'

export const PrivacyPolicy: CollectionConfig = {
  slug: 'privacy-policy',
  admin: {
    group: 'Struttura Sito',
    description: 'Configura i contenuti della pagina Privacy Policy',
    defaultColumns: ['name', 'school', 'isActive'],
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
      defaultValue: 'Privacy Policy',
      admin: {
        description: 'Dai un nome a questa versione della pagina Privacy Policy',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Contenuto principale',
      admin: {
        description: 'Testo principale',
      },
    },
  ],
}
