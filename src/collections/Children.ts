import { CollectionConfig, Access } from 'payload'
import {
  tenantCreate,
  tenantDelete,
  assignSchoolBeforeChange,
  getSchoolField,
} from '../lib/access'

export const Children: CollectionConfig = {
  slug: 'children',
  labels: {
    singular: 'Bambino',
    plural: 'Bambini',
  },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'classroom', 'school', 'dateOfBirth'],
    group: 'Utenti',
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
    // Parents vedono solo i propri figli, school-admin/editor vedono tutti i bambini della scuola
    read: (({ req: { user } }) => {
      if (!user) return false
      
      // Super-admin vede tutto
      if (user.role === 'super-admin') return true
      
      // Parent vede solo i propri figli
      if (user.role === 'parent' && user.children && user.children.length > 0) {
        const childrenIds = user.children.map((child) => 
          typeof child === 'string' ? child : child.id
        )
        return {
          id: {
            in: childrenIds,
          },
        }
      }
      
      // School-admin ed editor vedono bambini della loro scuola
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
    }) as Access,
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
    delete: tenantDelete, // Solo school-admin
  },
  hooks: {
    beforeChange: [assignSchoolBeforeChange],
  },
  fields: [
    getSchoolField('Scuola a cui è iscritto il bambino'),
    {
      name: 'firstName',
      type: 'text',
      required: true,
      label: 'Nome',
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      label: 'Cognome',
    },
    {
      name: 'fullName',
      type: 'text',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            return `${siblingData.firstName || ''} ${siblingData.lastName || ''}`.trim()
          },
        ],
      },
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      required: false,
      label: 'Data di nascita',
      admin: {
        date: {
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'classroom',
      type: 'text',
      required: true,
      label: 'Classe',
      admin: {
        description: 'Es: "1A", "Sezione Azzurra", ecc.',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto',
      admin: {
        description: 'Foto del bambino',
      },
    },
    {
      name: 'enrollmentDate',
      type: 'date',
      label: 'Data di iscrizione',
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: {
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Note interne',
      admin: {
        description: 'Note visibili solo alla scuola, non ai genitori',
      },
      access: {
        read: ({ req: { user } }) => {
          // Solo school staff può vedere le note, non i genitori
          return user?.role !== 'parent'
        },
      },
    },
  ],
  timestamps: true,
}
