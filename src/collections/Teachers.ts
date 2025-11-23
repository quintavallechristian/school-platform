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

export const Teachers: CollectionConfig = {
  slug: 'teachers',
  labels: {
    singular: 'Insegnante',
    plural: 'Insegnanti',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'subject', 'school'],
    group: 'Scuola',
    components: {
      beforeList: [
        {
          path: '@/components/UpgradeMessage',
          clientProps: {
            requiredPlan: 'professional',
            featureName: 'Insegnanti',
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
    getSchoolField('Scuola a cui appartiene questa testimonianza'),
    { name: 'name', type: 'text', label: 'Nome', required: true },
    {
      name: 'role',
      type: 'text',
      label: 'Ruolo',
      admin: { description: 'Es: Coordinatore, Insegnante di Matematica' },
    },
    { name: 'subject', type: 'text', label: 'Materia' },
    { name: 'email', type: 'email', label: 'Email' },
    { name: 'bio', type: 'textarea', label: 'Biografia' },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto',
      filterOptions: filterBySchool,
    },
  ],
}
