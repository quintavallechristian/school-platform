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
    group: 'Area genitori',
    description: 'Gestisci le richieste di registrazione dei genitori in attesa di approvazione',
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
    beforeChange: [
      assignSchoolBeforeChange,
      async ({ data, originalDoc, req, operation }) => {
        // Crea utente e bambino quando si approva una richiesta
        if (
          operation === 'update' &&
          originalDoc?.status === 'pending' &&
          data.status === 'approved' &&
          !data.createdUserId // Evita di ricreare se già creato
        ) {
          try {
            const payload = req.payload
            const email = data.parentEmail || originalDoc.parentEmail

            // 1. Verifica se l'utente esiste già
            const existingUsers = await payload.find({
              collection: 'users',
              where: {
                email: {
                  equals: email,
                },
              },
              limit: 1,
            })

            let newUser
            if (existingUsers.docs.length > 0) {
              // Utente già esistente, usa quello
              newUser = existingUsers.docs[0]
              req.payload.logger.info(`User ${email} already exists, using existing user ${newUser.id}`)
            } else {
              // Crea nuovo utente - Payload hasherà la password automaticamente
              newUser = await payload.create({
                collection: 'users',
                data: {
                  email: email,
                  password: originalDoc.passwordHash, // Payload hasherà questa password
                  role: 'parent',
                  firstName: data.parentFirstName || originalDoc.parentFirstName,
                  lastName: data.parentLastName || originalDoc.parentLastName,
                  schools: [data.school || originalDoc.school],
                },
                disableVerificationEmail: true,
              })
              req.payload.logger.info(`Created new user ${newUser.id}`)
            }

            // 2. Crea il bambino
            const newChild = await payload.create({
              collection: 'children',
              data: {
                firstName: data.childFirstName || originalDoc.childFirstName,
                lastName: data.childLastName || originalDoc.childLastName,
                classroom: data.childClassroom || originalDoc.childClassroom,
                school: data.school || originalDoc.school,
              },
            })
            req.payload.logger.info(`Created child ${newChild.id}`)

            // 3. Aggiorna l'utente genitore con il riferimento al bambino
            const existingChildren = newUser.children || []
            const childrenIds = Array.isArray(existingChildren) 
              ? existingChildren.map(c => typeof c === 'string' ? c : c.id)
              : []
            
            await payload.update({
              collection: 'users',
              id: newUser.id,
              data: {
                children: [...childrenIds, newChild.id],
              },
            })

            // 4. Modifica i dati prima del salvataggio (evita write conflict)
            data.createdUserId = newUser.id
            data.createdChildId = newChild.id
            data.approvedBy = req.user?.id
            data.approvedAt = new Date().toISOString()

            req.payload.logger.info(
              `Created parent user ${newUser.id} and child ${newChild.id} for registration`
            )
          } catch (error) {
            req.payload.logger.error(
              `Failed to create user/child: ${error}`
            )
            throw error
          }
        }
        return data
      },
    ],
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
        {
          name: 'passwordHash',
          type: 'text',
          required: false, // Non required per permettere aggiornamenti dall'admin
          label: 'Password Hash',
          admin: {
            hidden: true,
            description: 'Hash bcrypt della password scelta dal genitore',
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
