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
    group: 'Configurazione sito',
    description:
      'Qui puoi configurare la Privacy Policy. Puoi creare più Privacy Policy diverse e attivarle una per volta. Se non imposti alcuna Privacy Policy personalizzata, verrà utilizzata una versione di default.',
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
        description: 'Se disattivata, la testimonianza non sarà visibile nel sito',
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
