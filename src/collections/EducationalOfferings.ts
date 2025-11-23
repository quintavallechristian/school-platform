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

export const EducationalOfferings: CollectionConfig = {
  slug: 'educational-offerings',
  labels: {
    singular: 'Piano Offerta Formativa',
    plural: 'Piani Offerta Formativa',
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
            requiredPlan: 'professional',
            featureName: 'Piano Offerta Formativa',
            featureFlag: 'showEducationalOfferings',
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
    getSchoolField('Scuola a cui appartiene questo piano offerta formativa'),
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Attivo',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Se attivo, questo piano offerta formativa sarà visibile come principale',
      },
    },
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
          "Se abilitato, aggiunge un overlay gradiente sopra l'immagine di copertina per migliorare la leggibilità del testo nell'hero",
      },
    },
    {
      name: 'gallery',
      type: 'relationship',
      relationTo: 'gallery',
      label: 'Galleria',
      admin: {
        description: 'Collega una galleria di immagini a questo piano offerta formativa (opzionale)',
      },
    },
  ],
}
