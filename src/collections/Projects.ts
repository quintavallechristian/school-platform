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

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Progetto',
    plural: 'Progetti',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'school'],
    group: 'Scuola',
    components: {
      beforeList: [
        {
          path: '@/components/UpgradeMessage',
          clientProps: {
            requiredPlan: 'starter',
            featureName: 'Progetti',
            featureFlag: 'showProjects',
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
    getSchoolField('Scuola a cui appartiene questo progetto'),
    { name: 'title', type: 'text', label: 'Titolo', required: true },
    { name: 'description', type: 'richText', label: 'Descrizione' },
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
          "Se abilitato, aggiunge uno sfondo sfumato sopra l'immagine di copertina per migliorare la leggibilità del testo nella copertina",
      },
    },
    {
      name: 'gallery',
      type: 'relationship',
      relationTo: 'gallery',
      label: 'Galleria',
      admin: {
        description: 'Collega una galleria di immagini a questo progetto (opzionale)',
      },
    },
  ],
}
