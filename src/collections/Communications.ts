import { CollectionConfig } from 'payload'
import {
  sendCommunicationEmail,
  getPriorityConfig,
  CommunicationPriority,
} from '../lib/email-service'
import {
  tenantRead,
  tenantCreate,
  tenantUpdate,
  tenantDelete,
  assignSchoolBeforeChange,
  getSchoolField,
} from '../lib/access'

export const Communications: CollectionConfig = {
  slug: 'communications',
  labels: {
    singular: 'Comunicazione',
    plural: 'Comunicazioni',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'priority', 'publishedAt', 'isActive', 'school'],
    description: 'Gestisci le comunicazioni di servizio che appaiono nel popup',
    group: 'Comunicazioni scuola-famiglia',
    components: {
      beforeList: [
        {
          path: '@/components/UpgradeMessage',
          clientProps: {
            requiredPlan: 'professional',
            featureName: 'Comunicazioni',
            featureFlag: 'showCommunications',
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
    afterChange: [
      async ({ doc, operation, req, context }) => {
        // Se non è attivo → niente email
        if (!doc.isActive) return

        // Se è un update ma NON è il cron → niente email
        if (operation === 'update' && !context?.triggeredByCron) {
          return
        }

        // Se è un create ma isActive era false al create → niente email
        if (operation === 'create' && !doc.isActive) return

        try {
          // Fetch school data to check if email communications are enabled
          const schoolId = typeof doc.school === 'string' ? doc.school : doc.school.id
          const school = await req.payload.findByID({
            collection: 'schools',
            id: schoolId,
          })

          // Check if email communications feature is enabled
          if (!school.featureVisibility?.enableEmailCommunications) {
            console.log(
              `Email communications disabled for school ${school.name}. Skipping email sending.`,
            )
            return
          }

          // Trova iscritti della stessa scuola
          const subscribers = await req.payload.find({
            collection: 'email-subscribers',
            where: {
              and: [{ isActive: { equals: true } }, { school: { equals: doc.school } }],
            },
            limit: 1000,
          })

          if (subscribers.docs.length === 0) {
            console.log('Nessun iscritto per questa scuola')
            return
          }

          console.log(`Invio comunicazione a ${subscribers.docs.length} iscritti per: ${doc.title}`)

          const priority = doc.priority as CommunicationPriority
          const priorityInfo = getPriorityConfig(priority)

          const publishedDate = new Date(doc.publishedAt).toLocaleDateString('it-IT', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })

          const schoolDomain = school.slug || 'scuola'
          const schoolName = school.name || 'Scuola'

          // Extract school colors (use light theme colors for emails)
          const primaryColor = school.lightTheme?.textPrimary || '#1e40af'
          const secondaryColor = school.lightTheme?.textSecondary || '#7c3aed'

          // Invia a tutti gli iscritti
          const sendPromises = subscribers.docs.map(async (subscriber) => {
            const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/unsubscribe?token=${subscriber.unsubscribeToken}`

            return sendCommunicationEmail(
              subscriber.email,
              {
                priorityColor: priorityInfo.color,
                priorityLabel: priorityInfo.label,
                title: doc.title,
                publishedDate,
                communicationsUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/${schoolDomain}/comunicazioni`,
                unsubscribeUrl,
                schoolName,
                primaryColor,
                secondaryColor,
              },
              `Nuova comunicazione: ${doc.title}`,
            )
          })

          await Promise.allSettled(sendPromises)

          console.log('Invio completato')
        } catch (error) {
          console.error('Errore invio email Brevo:', error)
        }
      },
    ],
  },

  fields: [
    getSchoolField('Scuola a cui appartiene questa comunicazione'),
    { name: 'title', label: 'Titolo', type: 'text', required: true },
    { name: 'content', label: 'Contenuto', type: 'richText', required: true },
    {
      name: 'priority',
      label: 'Priorità',
      type: 'select',
      required: true,
      defaultValue: 'normal',
      options: [
        { label: 'Bassa', value: 'low' },
        { label: 'Normale', value: 'normal' },
        { label: 'Alta', value: 'high' },
        { label: 'Urgente', value: 'urgent' },
      ],
    },
    {
      name: 'publishedAt',
      label: 'Data di pubblicazione',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        description:
          'Scegli in che giorno inviare la comunicazione. Puoi scegliere anche giorni passati',
        date: {
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'isActive',
      label: 'Attiva',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'Se attivo la comunicazione verrà mostrata nel sito ed inviata a tutti gli iscritti alla newsletter',
        condition: (data) => {
          if (!data.publishedAt) return true
          const publishedDate = new Date(data.publishedAt)
          const now = new Date()
          // Rimuovi le ore per confrontare solo le date
          publishedDate.setHours(0, 0, 0, 0)
          now.setHours(0, 0, 0, 0)
          return publishedDate <= now
        },
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Data scadenza (opzionale)',
      admin: {
        description:
          'Quando viene raggiunta la data di scadenza la comunicazione non verrà più mostrata',
        date: {
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'linkedArticle',
      label: 'Articolo collegato (opzionale)',
      type: 'relationship',
      relationTo: 'articles',
      admin: {
        description: "Se collegato, la comunicazione rimanderà all'articolo",
        condition: (data) => !data.linkedEvent,
      },
    },
    {
      name: 'linkedEvent',
      type: 'relationship',
      relationTo: 'events',
      admin: { hidden: true, condition: (data) => !data.linkedArticle },
    },
  ],
}
