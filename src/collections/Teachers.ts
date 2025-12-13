import { CollectionConfig } from 'payload'
import { filterBySchool } from '../lib/access'
import { createPlanGuardHook } from '../lib/subscriptionAccess'

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
            featureFlag: 'showTeachers',
          },
        },
      ],
    },
  },
  hooks: {
    beforeChange: [
      createPlanGuardHook({
        requiredPlan: 'professional',
        featureName: 'Insegnanti',
        featureFlag: 'showTeachers',
      }),
    ],
  },
  // Access control gestito dal plugin multi-tenant
  fields: [
    // Campo school gestito automaticamente dal plugin
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
