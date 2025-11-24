import type { CollectionConfig } from 'payload'


import {
  mediaRead,
  tenantCreate,
  tenantUpdate,
  tenantDelete,
  assignSchoolBeforeChange,
} from '../lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Contenuti',
  },
  access: {
    read: mediaRead,
    create: tenantCreate,
    update: tenantUpdate,
    delete: tenantDelete,
  },
  hooks: {
    beforeChange: [assignSchoolBeforeChange],
  },
  upload: {
    disableLocalStorage: true, // obbligatorio su Vercel
  },

  fields: [
    {
      name: 'school',
      type: 'relationship',
      relationTo: 'schools',
      required: true,
      label: 'Scuola',
      admin: {
        description: 'Scuola a cui appartiene questo file',
        condition: (data, siblingData, { user }) => {
          return user?.role === 'super-admin'
        },
      },
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
