import type { CollectionConfig } from 'payload'
import { sendUserCredentialsEmail } from '../lib/email-service'
import { headers } from 'next/headers'
import { getSchoolBaseHref } from '@/lib/linkUtils'
import { School } from '@/payload-types'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Utente',
    plural: 'Utenti',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'schools', 'createdAt'],
    group: 'Utenti',
  },
  auth: true,
  access: {
    // Super-admin vedono tutti, gli altri solo utenti con almeno una scuola in comune
    admin: ({ req: { user } }) => {
      // I genitori non possono accedere al pannello admin
      return user?.role !== 'parent'
    },
    read: ({ req }) => {
      const user = req.user
      if (!user) return false
      if (user.role === 'super-admin') return true

      const schoolIDs = user.schools?.map((s) => (typeof s === 'object' ? s.id : s))

      if (schoolIDs?.length) {
        return {
          and: [
            {
              schools: {
                in: schoolIDs,
              },
            },
            {
              role: {
                not_equals: 'super-admin',
              },
            },
          ],
        } as any
      }

      return false
    },
    // Solo super-admin possono creare utenti per qualsiasi scuola
    create: ({ req: { user } }) => {
      return user?.role === 'super-admin' || user?.role === 'school-admin'
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true

      // School-admin può modificare solo utenti con almeno una scuola in comune (eccetto super-admin)
      if (user.role === 'school-admin' && user.schools && user.schools.length > 0) {
        const schoolIDs = user.schools?.map((s) => (typeof s === 'object' ? s.id : s))
        if (schoolIDs?.length) {
          return {
            and: [
              {
                schools: {
                  in: schoolIDs,
                },
              },
              {
                role: {
                  not_equals: 'super-admin',
                },
              },
            ],
          } as any
        }
      }
      return false
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true

      // School-admin può eliminare solo utenti con almeno una scuola in comune (eccetto se stesso e super-admin)
      if (user.role === 'school-admin' && user.schools && user.schools.length > 0) {
        const schoolIDs = user.schools?.map((s) => (typeof s === 'object' ? s.id : s))
        if (schoolIDs?.length) {
          return {
            and: [
              {
                schools: {
                  in: schoolIDs,
                },
              },
              {
                id: {
                  not_equals: user.id,
                },
              },
              {
                role: {
                  not_equals: 'super-admin',
                },
              },
            ],
          } as any
        }
      }
      return false
    },
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        {
          label: 'Super Admin',
          value: 'super-admin',
        },
        {
          label: 'Amministratore',
          value: 'school-admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'Genitore',
          value: 'parent',
        },
      ],
      admin: {
        description:
          'Amministratore: gestisce la propria scuola | Editor: può modificare contenuti | Genitore: area riservata',
        condition: (data, siblingData, { user }) => {
          // School-admin può vedere il campo per creare genitori
          return user?.role === 'super-admin' || user?.role === 'school-admin'
        },
      },
      // Filtra le opzioni per nascondere super-admin agli utenti non super-admin
      filterOptions: ({ options, req }) => {
        // Se l'utente non è super-admin, rimuovi l'opzione super-admin
        if (req.user?.role !== 'super-admin') {
          return options.filter((option) => {
            const optionValue = typeof option === 'string' ? option : option.value
            return optionValue !== 'super-admin'
          })
        }
        return options
      },
      access: {
        // Solo super-admin può modificare i ruoli
        update: ({ req: { user } }) => user?.role === 'super-admin',
      },
      validate: async (value: any, options: any) => {
        const { data, req, operation } = options
        // Check parent limit when creating a new parent user
        if (operation === 'create' && value === 'parent') {
          // Super-admin can bypass the limit
          if (req.user?.role !== 'super-admin') {
            if (!data?.schools || data.schools.length === 0) {
              return 'Almeno una scuola deve essere assegnata al genitore'
            }

            const schoolId =
              typeof data.schools[0] === 'string' ? data.schools[0] : data.schools[0].id
            const { checkParentLimit } = await import('../lib/check-parent-limit')
            const limitCheck = await checkParentLimit(schoolId, req.payload)

            if (!limitCheck.canAdd) {
              return limitCheck.message || 'Impossibile creare il genitore: limite raggiunto'
            }
          }
        }
        return true
      },
    },
    {
      name: 'schools',
      type: 'relationship',
      relationTo: 'schools',
      hasMany: true,
      required: false, // Temporaneamente opzionale per permettere la migrazione
      admin: {
        description: 'Scuole di appartenenza',
        condition: () => {
          // Super-admin può assegnare qualsiasi scuola
          // School-admin vede solo la propria scuola
          return true
        },
      },
      access: {
        update: ({ req: { user } }) => {
          // Solo super-admin può cambiare le scuole di un utente
          return user?.role === 'super-admin'
        },
      },
      validate: (value, { operation }) => {
        // Durante l'update dell'account, permetti valori vuoti (migrazione in corso)
        if (operation === 'update') {
          return true
        }
        // Durante la creazione, richiedi almeno una scuola
        if (operation === 'create' && (!value || value.length === 0)) {
          return 'Almeno una scuola deve essere assegnata'
        }
        return true
      },
    },

    {
      name: 'firstName',
      type: 'text',
      label: 'Nome',
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Cognome',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefono',
    },
    {
      name: 'acceptedPrivacyPolicy',
      type: 'checkbox',
      label: 'Privacy Policy Accettata',
      defaultValue: false,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: "Indica se l'utente ha accettato la Privacy Policy",
      },
    },
    {
      name: 'acceptedTermsOfService',
      type: 'checkbox',
      label: 'Termini di Servizio Accettati',
      defaultValue: false,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: "Indica se l'utente ha accettato i Termini di Servizio",
      },
    },
    {
      name: 'acceptanceDate',
      type: 'date',
      label: 'Data Accettazione',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: "Data in cui l'utente ha accettato Privacy Policy e ToS",
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, data, operation, context }) => {
        // Migrazione automatica: converte school → schools
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const oldData = data as any
        if (oldData.school && (!data.schools || data.schools.length === 0)) {
          const schoolId = typeof oldData.school === 'string' ? oldData.school : oldData.school.id
          data.schools = [schoolId]
          delete oldData.school
        }

        // Normalizza sempre schools a ID (in caso di oggetti completi)
        if (data.schools && Array.isArray(data.schools)) {
          data.schools = data.schools.map((school) =>
            typeof school === 'string' ? school : school.id,
          )
        }

        // Se non è super-admin, non può assegnare il ruolo super-admin
        if (req.user?.role !== 'super-admin' && data.role === 'super-admin') {
          data.role = 'editor'
        }

        // Salva la password inserita nel context per inviarla via email
        if (operation === 'create' && data.password) {
          const rolesNeedingEmail = ['school-admin', 'editor', 'parent']
          if (rolesNeedingEmail.includes(data.role)) {
            context.userPassword = data.password
          }
        }

        return data
      },
    ],
    afterRead: [
      ({ doc }) => {
        // Migrazione automatica durante la lettura: converte school → schools
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const oldDoc = doc as any
        if (oldDoc.school && (!doc.schools || doc.schools.length === 0)) {
          const schoolId = typeof oldDoc.school === 'string' ? oldDoc.school : oldDoc.school.id
          doc.schools = [schoolId]
        }
        return doc
      },
    ],
    afterChange: [
      async ({
        doc,
        context,
        operation,
        req,
      }: {
        doc: any
        context: any
        operation: string
        req: any
      }) => {
        // Invia email con credenziali solo per nuovi utenti
        if (operation !== 'create') return
        if (!context.userPassword) return

        const rolesNeedingEmail = ['school-admin', 'editor', 'parent']
        if (!rolesNeedingEmail.includes(doc.role)) return

        try {
          const roleLabels = {
            'school-admin': 'Amministratore',
            editor: 'Editor',
            parent: 'Genitore',
          }

          // Recupera i nomi delle scuole e lo slug per i genitori
          let schoolNames: string[] = []
          let schools: School[] = []
          let schoolSlug: string | undefined
          if (doc.schools && doc.schools.length > 0) {
            const schoolIds = doc.schools.map((school: any) =>
              typeof school === 'string' ? school : school.id,
            )

            const retrievedSchools = await req.payload.find({
              collection: 'schools',
              where: {
                id: {
                  in: schoolIds,
                },
              },
            })

            schools = retrievedSchools.docs

            schoolNames = schools.map((school: any) => school.name)
            // Per i genitori, usa lo slug della prima scuola
            if (doc.role === 'parent' && schools.length > 0) {
              schoolSlug = schools[0].slug
            }
          }

          const headersList = await headers()
          const host = headersList.get('host') || ''
          const baseHref = getSchoolBaseHref(schools[0], host)

          // Genera l'URL di login in base al ruolo
          let loginUrl: string
          if (doc.role === 'parent' && schoolSlug) {
            loginUrl = `${baseHref}/parents/login`
          } else {
            loginUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/admin`
          }

          // Crea la lista delle scuole per l'email
          const schoolsList =
            schoolNames.length > 0
              ? `<p style="margin:0 0 10px;color:#6b7280;font-size:13px;font-weight:600;">SCUOLA/E</p>
               <p style="margin:0 0 20px;color:#1f2937;font-size:15px;">${schoolNames.join(', ')}</p>`
              : ''

          await sendUserCredentialsEmail(doc.email, {
            roleLabel: roleLabels[doc.role as keyof typeof roleLabels],
            email: doc.email,
            password: context.userPassword,
            schoolsList,
            loginUrl,
          })
        } catch (error) {
          console.error('Errore invio email credenziali:', error)
        }
      },
    ],
  },
  timestamps: true,
}
