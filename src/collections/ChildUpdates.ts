import { CollectionConfig } from 'payload'
import {
  tenantCreate,
  tenantDelete,
  assignSchoolBeforeChange,
  getSchoolField,
} from '../lib/access'

export const ChildUpdates: CollectionConfig = {
  slug: 'child-updates',
  labels: {
    singular: 'Aggiornamento Bambino',
    plural: 'Aggiornamenti Bambini',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'child', 'type', 'publishedAt'],
    group: 'Area Genitori',
    components: {
      beforeList: [
        {
          path: '@/components/UpgradeMessage',
          clientProps: {
            requiredPlan: 'professional',
            featureName: 'Area Genitori',
          },
        },
      ],
    },
  },
  access: {
    // Parents vedono solo gli updates dei propri figli
    read: ({ req: { user } }) => {
      if (!user) return false
      
      // Super-admin vede tutto
      if (user.role === 'super-admin') return true
      
      // Parent vede solo updates dei propri figli
      if (user.role === 'parent' && user.children && user.children.length > 0) {
        const childrenIds = user.children.map((child) => 
          typeof child === 'string' ? child : child.id
        )
        return {
          child: {
            in: childrenIds,
          },
        }
      }
      
      // School-admin ed editor vedono updates della loro scuola
      if ((user.role === 'school-admin' || user.role === 'editor') && user.schools && user.schools.length > 0) {
        const schoolIds = user.schools.map((school) =>
          typeof school === 'string' ? school : school.id
        )
        return {
          school: {
            in: schoolIds,
          },
        }
      }
      
      return false
    },
    create: tenantCreate, // School-admin ed editor possono creare
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true
      
      // Solo school-admin ed editor, non i genitori
      if ((user.role === 'school-admin' || user.role === 'editor') && user.schools && user.schools.length > 0) {
        const schoolIds = user.schools.map((school) =>
          typeof school === 'string' ? school : school.id
        )
        return {
          school: {
            in: schoolIds,
          },
        }
      }
      
      return false
    },
    delete: tenantDelete,
  },
  hooks: {
    beforeChange: [assignSchoolBeforeChange],
  },
  fields: [
    getSchoolField('Scuola a cui appartiene questo aggiornamento'),
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titolo',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Contenuto',
    },
    {
      name: 'child',
      type: 'relationship',
      relationTo: 'children',
      required: true,
      label: 'Bambino',
      admin: {
        description: 'Il bambino a cui si riferisce questo aggiornamento',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'daily_activity',
      label: 'Tipo',
      options: [
        {
          label: 'Attività giornaliera',
          value: 'daily_activity',
        },
        {
          label: 'Traguardo raggiunto',
          value: 'achievement',
        },
        {
          label: 'Nota importante',
          value: 'note',
        },
        {
          label: 'Evento speciale',
          value: 'event',
        },
      ],
    },
    {
      name: 'photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Foto',
      admin: {
        description: 'Foto delle attività svolte',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      label: 'Data pubblicazione',
      admin: {
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
        },
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'Autore',
      admin: {
        description: 'Chi ha creato questo aggiornamento',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ req }) => {
            return req.user?.id
          },
        ],
      },
    },
  ],
  timestamps: true,
}
