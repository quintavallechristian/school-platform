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
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return
        if (!doc.isActive) return

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

          // Invia a tutti gli iscritti
          const sendPromises = subscribers.docs.map(async (subscriber) => {
            const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/unsubscribe?token=${subscriber.unsubscribeToken}`

            return sendCommunicationEmail(
              subscriber.email,
              {
                priorityColor: priorityInfo.color,
                priorityEmoji: priorityInfo.emoji,
                priorityLabel: priorityInfo.label,
                title: doc.title,
                publishedDate,
                communicationsUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/${schoolDomain}/comunicazioni`,
                unsubscribeUrl,
                schoolName,
              },
              `${priorityInfo.emoji} Nuova comunicazione: ${doc.title}`,
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
    { name: 'title', type: 'text', required: true },
    { name: 'content', type: 'richText', required: true },
    {
      name: 'priority',
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
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Data scadenza (opzionale)',
    },
    {
      name: 'linkedArticle',
      type: 'relationship',
      relationTo: 'articles',
      admin: { condition: (data) => !data.linkedEvent },
    },
    {
      name: 'linkedEvent',
      type: 'relationship',
      relationTo: 'events',
      admin: { condition: (data) => !data.linkedArticle },
    },
  ],
}
