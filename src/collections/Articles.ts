import { CollectionConfig } from 'payload'
import { filterBySchool } from '../lib/access'
import { createPlanGuardHook } from '../lib/subscriptionAccess'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Articolo',
    plural: 'Articoli',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', 'school'],
    group: 'Contenuti',
    components: {
      beforeList: [
        {
          path: '@/components/UpgradeMessage',
          clientProps: {
            requiredPlan: 'starter',
            featureName: 'Articoli',
            featureFlag: 'showBlog',
          },
        },
      ],
    },
  },
  hooks: {
    beforeChange: [
      createPlanGuardHook({
        requiredPlan: 'starter',
        featureName: 'Articoli',
        featureFlag: 'showBlog',
      }),
    ],
  },
  // Access control gestito dal plugin multi-tenant
  fields: [
    // Campo school gestito automaticamente dal plugin
    {
      name: 'title',
      type: 'text',
      required: true,
    },
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
      label: 'Sfumatura in sovraimpressione sulla Copertina',
      defaultValue: false,
      admin: {
        description:
          "Se abilitato, aggiunge uno sfondo sfumato sopra l'immagine di copertina per migliorare la leggibilità del testo nella copertina",
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'gallery',
      type: 'relationship',
      relationTo: 'gallery',
      label: 'Galleria',
      admin: {
        description: 'Collega una galleria di immagini a questo articolo (opzionale)',
      },
    },
  ],
}
