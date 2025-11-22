import type { CollectionConfig } from 'payload'
import * as Brevo from '@getbrevo/brevo'

// Inizializza Brevo solo se API key presente
let brevo: Brevo.TransactionalEmailsApi | null = null
if (process.env.BREVO_API_KEY) {
  brevo = new Brevo.TransactionalEmailsApi()
  brevo.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
  )
}



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
      name: 'children',
      type: 'relationship',
      relationTo: 'children',
      hasMany: true,
      label: 'Figli',
      admin: {
        description: 'Bambini associati a questo genitore',
        condition: (data, siblingData) => {
          return siblingData?.role === 'parent'
        },
      },
      access: {
        read: ({ req: { user }, data }) => {
          // Super-admin e school-admin possono sempre leggere
          if (user?.role === 'super-admin' || user?.role === 'school-admin') return true
          // Parent può vedere solo i propri figli
          if (user?.role === 'parent' && data && data.id === user.id) return true
          return false
        },
        update: ({ req: { user } }) => {
          // Solo super-admin e school-admin possono assegnare figli
          return user?.role === 'super-admin' || user?.role === 'school-admin'
        },
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
  ],
  hooks: {
    beforeChange: [
      ({ req, data, operation, context }) => {
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
            typeof school === 'string' ? school : school.id
          )
        }

        // Normalizza anche children a ID
        if (data.children && Array.isArray(data.children)) {
          data.children = data.children.map((child) =>
            typeof child === 'string' ? child : child.id
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async ({ doc, context, operation, req }: { doc: any; context: any; operation: string; req: any }) => {
        // Invia email con credenziali solo per nuovi utenti
        if (operation !== 'create') return
        if (!context.userPassword || !brevo) return

        const rolesNeedingEmail = ['school-admin', 'editor', 'parent']
        if (!rolesNeedingEmail.includes(doc.role)) return

        try {
          const roleLabels = {
            'school-admin': 'Amministratore',
            'editor': 'Editor',
            'parent': 'Genitore',
          }

          // Recupera i nomi delle scuole
          let schoolNames: string[] = []
          if (doc.schools && doc.schools.length > 0) {
            const schoolIds = doc.schools.map((school: any) => 
              typeof school === 'string' ? school : school.id
            )
            
            const schools = await req.payload.find({
              collection: 'schools',
              where: {
                id: {
                  in: schoolIds,
                },
              },
            })
            
            schoolNames = schools.docs.map((school: any) => school.name)
          }

          const loginUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/admin`

          // Crea la lista delle scuole per l'email
          const schoolsList = schoolNames.length > 0 
            ? `<p style="margin:0 0 10px;color:#6b7280;font-size:13px;font-weight:600;">SCUOLA/E</p>
               <p style="margin:0 0 20px;color:#1f2937;font-size:15px;">${schoolNames.join(', ')}</p>`
            : ''

          const emailHtml = `
            <!DOCTYPE html>
            <html lang="it">
              <body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
                <div style="max-width:600px;margin:0 auto;padding:20px;">
                  <div style="text-align:center;padding:30px 0 20px 0;">
                    <h1 style="margin:0;font-size:24px;color:#1f2937;">🏫 Benvenuto!</h1>
                    <p style="margin:5px 0 0;color:#6b7280;font-size:14px;">Il tuo account è stato creato</p>
                  </div>

                  <div style="background:white;border-radius:12px;border:1px solid #e5e7eb;padding:30px;">
                    <h2 style="margin:0 0 20px;font-size:20px;color:#1f2937;">
                      Credenziali di accesso
                    </h2>

                    <p style="color:#4b5563;font-size:15px;line-height:1.6;">
                      È stato creato un account per te con il ruolo di <strong>${roleLabels[doc.role as keyof typeof roleLabels]}</strong>.
                    </p>

                    <div style="background:#f3f4f6;border-radius:8px;padding:20px;margin:20px 0;">
                      ${schoolsList}
                      
                      <p style="margin:0 0 10px;color:#6b7280;font-size:13px;font-weight:600;">EMAIL</p>
                      <p style="margin:0 0 20px;color:#1f2937;font-size:15px;font-family:monospace;">${doc.email}</p>

                      <p style="margin:0 0 10px;color:#6b7280;font-size:13px;font-weight:600;">PASSWORD</p>
                      <p style="margin:0;color:#1f2937;font-size:15px;font-family:monospace;">${context.userPassword}</p>
                    </div>

                    <p style="color:#ef4444;font-size:13px;margin:10px 0 20px;">
                      ⚠️ Ti consigliamo di cambiare la password al primo accesso per motivi di sicurezza.
                    </p>

                    <div style="text-align:center;margin:30px 0;">
                      <a href="${loginUrl}"
                        style="background:#2563eb;color:white;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;">
                        🔐 Accedi al pannello
                      </a>
                    </div>

                    <p style="color:#6b7280;font-size:13px;margin-top:20px;">
                      Se hai domande o problemi di accesso, contatta l'amministratore.
                    </p>
                  </div>

                  <div style="text-align:center;padding:20px;">
                    <p style="color:#9ca3af;font-size:12px;">
                      Questa è una email automatica, non rispondere a questo messaggio.
                    </p>
                  </div>
                </div>
              </body>
            </html>
          `

          await brevo.sendTransacEmail({
            sender: {
              name: process.env.BREVO_SENDER_NAME || 'Scuola',
              email: process.env.BREVO_SENDER_EMAIL || 'no-reply@scuola.it'
            },
            to: [{ email: doc.email }],
            subject: `🎉 Benvenuto! Ecco le tue credenziali di accesso`,
            htmlContent: emailHtml,
          })

          console.log(`Email con credenziali inviata a ${doc.email}`)
        } catch (error) {
          console.error('Errore invio email credenziali:', error)
        }
      },
    ],
  },
  timestamps: true,
}
