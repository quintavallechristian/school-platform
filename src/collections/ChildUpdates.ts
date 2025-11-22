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
    group: 'Area genitori',
    components: {
      beforeList: [
        {
          path: '@/components/UpgradeMessage',
          clientProps: {
            requiredPlan: 'professional',
            featureName: 'Area Genitori',
            featureFlag: 'showParentsArea',
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
        } as any
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
        } as any
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
      name: 'child',
      type: 'relationship',
      relationTo: 'children',
      required: true,
      label: 'Bambino',
      admin: {
        description: 'Il bambino a cui si riferisce questo aggiornamento',
        condition: (data) => {
          // Mostra il campo solo se è stata selezionata una scuola
          return !!data.school
        },
      },
      filterOptions: ({ data }) => {
        // Filtra i bambini per mostrare solo quelli della scuola selezionata
        if (data?.school) {
          return {
            school: {
              equals: typeof data.school === 'string' ? data.school : data.school.id,
            },
          }
        }
        // Se non c'è scuola selezionata, restituisci false per non mostrare nessun bambino
        return false
      },
    },
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
