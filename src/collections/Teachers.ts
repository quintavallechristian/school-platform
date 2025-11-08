import { CollectionConfig } from 'payload'
import { tenantRead, tenantCreate, tenantUpdate, tenantDelete, assignSchoolBeforeChange } from '../lib/access'

export const Teachers: CollectionConfig = {
  slug: 'teachers',
  labels: {
    singular: 'Insegnante',
    plural: 'Insegnanti',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'subject', 'school'],
    group: 'Contenuti',
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
    {
      name: 'school',
      type: 'relationship',
      relationTo: 'schools',
      required: true,
      label: 'Scuola',
      admin: {
        description: 'Scuola a cui appartiene questo insegnante',
        condition: (data, siblingData, { user }) => {
          return user?.role === 'super-admin'
        },
      },
    },
    { name: 'name', type: 'text', label: 'Nome', required: true },
    { name: 'role', type: 'text', label: 'Ruolo', admin: { description: 'Es: Coordinatore, Insegnante di Matematica' } },
    { name: 'subject', type: 'text', label: 'Materia' },
    { name: 'email', type: 'email', label: 'Email' },
    { name: 'bio', type: 'textarea', label: 'Biografia' },
    { name: 'photo', type: 'upload', relationTo: 'media', label: 'Foto' },
  ],
}
