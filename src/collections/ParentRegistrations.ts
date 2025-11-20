import { CollectionConfig } from 'payload'
import {
  getSchoolField,
  assignSchoolBeforeChange,
} from '../lib/access'

export const ParentRegistrations: CollectionConfig = {
  slug: 'parent-registrations',
  labels: {
    singular: 'Richiesta Genitore',
    plural: 'Richieste Genitori',
  },
  admin: {
    useAsTitle: 'parentEmail',
    defaultColumns: ['parentEmail', 'parentFirstName', 'parentLastName', 'status', 'school', 'createdAt'],
    group: 'Area Genitori',
    description: 'Gestisci le richieste di registrazione dei genitori in attesa di approvazione',
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
    // Solo school-admin ed editor possono vedere le richieste
    read: ({ req: { user } }) => {
      if (!user) return false
      
      // Super-admin vede tutto
      if (user.role === 'super-admin') return true
      
      // School-admin ed editor vedono richieste della loro scuola
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
    // Nessuno può creare manualmente (solo via API pubblica)
    create: () => false,
    // Solo school-admin ed editor possono aggiornare (per approvare/rifiutare)
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true
      
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
    // Solo school-admin può eliminare
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true
      
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
    },
  },
  hooks: {
    beforeChange: [assignSchoolBeforeChange],
  },
  fields: [
    getSchoolField('Scuola per cui il genitore sta richiedendo l\'accesso'),
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'In attesa',
          value: 'pending',
        },
        {
          label: 'Approvato',
          value: 'approved',
        },
        {
          label: 'Rifiutato',
          value: 'rejected',
        },
      ],
      admin: {
        description: 'Stato della richiesta di registrazione',
        position: 'sidebar',
      },
    },
    {
      type: 'collapsible',
      label: 'Informazioni Genitore',
      fields: [
        {
          name: 'parentFirstName',
          type: 'text',
          required: true,
          label: 'Nome Genitore',
        },
        {
          name: 'parentLastName',
          type: 'text',
          required: true,
          label: 'Cognome Genitore',
        },
        {
          name: 'parentEmail',
          type: 'email',
          required: true,
          unique: true,
          label: 'Email Genitore',
          admin: {
            description: 'Verrà utilizzata come username per l\'accesso',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Informazioni Bambino',
      fields: [
        {
          name: 'childFirstName',
          type: 'text',
          required: true,
          label: 'Nome Bambino',
        },
        {
          name: 'childLastName',
          type: 'text',
          required: true,
          label: 'Cognome Bambino',
        },
        {
          name: 'childClassroom',
          type: 'text',
          required: true,
          label: 'Sezione/Classe',
          admin: {
            description: 'Es: "1A", "Sezione Azzurra", ecc.',
          },
        },
      ],
    },
    {
      name: 'createdUserId',
      type: 'text',
      label: 'ID Utente Creato',
      admin: {
        description: 'ID dell\'utente creato dopo l\'approvazione',
        readOnly: true,
        position: 'sidebar',
        condition: (data) => data?.status === 'approved',
      },
    },
    {
      name: 'createdChildId',
      type: 'text',
      label: 'ID Bambino Creato',
      admin: {
        description: 'ID del bambino creato dopo l\'approvazione',
        readOnly: true,
        position: 'sidebar',
        condition: (data) => data?.status === 'approved',
      },
    },
    {
      name: 'approvedBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Approvato da',
      admin: {
        description: 'Utente che ha approvato la richiesta',
        readOnly: true,
        position: 'sidebar',
        condition: (data) => data?.status === 'approved',
      },
    },
    {
      name: 'approvedAt',
      type: 'date',
      label: 'Data Approvazione',
      admin: {
        description: 'Data e ora dell\'approvazione',
        readOnly: true,
        position: 'sidebar',
        condition: (data) => data?.status === 'approved',
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
        },
      },
    },
    {
      name: 'rejectionReason',
      type: 'textarea',
      label: 'Motivo Rifiuto',
      admin: {
        description: 'Motivo per cui la richiesta è stata rifiutata',
        condition: (data) => data?.status === 'rejected',
      },
    },
  ],
  timestamps: true,
}
