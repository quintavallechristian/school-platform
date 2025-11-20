import { CollectionConfig, Access } from 'payload'
import {
  assignSchoolBeforeChange,
  getSchoolField,
} from '../lib/access'

export const ParentAppointments: CollectionConfig = {
  slug: 'parent-appointments',
  labels: {
    singular: 'Appuntamento Genitore',
    plural: 'Appuntamenti Genitori',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'child', 'parent', 'status'],
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
    // Parents vedono solo i propri appuntamenti
    read: (({ req: { user } }) => {
      if (!user) return false
      
      // Super-admin vede tutto
      if (user.role === 'super-admin') return true
      
      // Parent vede solo i propri appuntamenti
      if (user.role === 'parent') {
        return {
          parent: {
            equals: user.id,
          },
        }
      }
      
      // School-admin ed editor vedono appuntamenti della loro scuola
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
    create: ({ req: { user } }) => {
      // Solo school-admin ed editor possono creare appuntamenti
      return user?.role === 'super-admin' || user?.role === 'school-admin' || user?.role === 'editor'
    },
    update: (({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true
      
      // Parent può cancellare i propri appuntamenti (cambiare status)
      if (user.role === 'parent') {
        return {
          parent: {
            equals: user.id,
          },
        }
      }
      
      // School-admin ed editor possono modificare appuntamenti della loro scuola
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
    delete: (({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true
      
      // Solo school-admin può eliminare
      if (user.role === 'school-admin' && user.schools && user.schools.length > 0) {
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
  },
  hooks: {
    beforeChange: [assignSchoolBeforeChange],
  },
  fields: [
    getSchoolField('Scuola'),
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titolo',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descrizione',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Data e ora',
      admin: {
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'child',
      type: 'relationship',
      relationTo: 'children',
      required: true,
      label: 'Bambino',
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Genitore',
      filterOptions: {
        role: {
          equals: 'parent',
        },
      },
    },
    {
      name: 'teacher',
      type: 'relationship',
      relationTo: 'teachers',
      label: 'Insegnante',
      admin: {
        description: 'Insegnante presente all\'appuntamento (opzionale)',
      },
    },
    {
      name: 'location',
      type: 'text',
      label: 'Luogo',
      admin: {
        description: 'Es: "Aula 2A", "Sala Riunioni"',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'scheduled',
      label: 'Stato',
      options: [
        {
          label: 'Programmato',
          value: 'scheduled',
        },
        {
          label: 'Completato',
          value: 'completed',
        },
        {
          label: 'Annullato',
          value: 'cancelled',
        },
      ],
      access: {
        // Parents possono solo cambiare a "cancelled"
        update: ({ req: { user } }) => {
          if (user?.role === 'parent') {
            // I genitori possono modificare lo status (per cancellare)
            return true
          }
          // School staff può modificare qualsiasi status
          return user?.role === 'super-admin' || user?.role === 'school-admin' || user?.role === 'editor'
        },
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Note post-incontro',
      admin: {
        description: 'Note compilate dopo l\'incontro',
      },
      access: {
        read: ({ req: { user } }) => {
          // Solo school staff può vedere le note
          return user?.role !== 'parent'
        },
        update: ({ req: { user } }) => {
          // Solo school staff può modificare le note
          return user?.role !== 'parent'
        },
      },
    },
  ],
  timestamps: true,
}
