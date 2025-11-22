import { CollectionConfig } from 'payload'
import * as Brevo from '@getbrevo/brevo'
import {
  tenantRead,
  tenantCreate,
  tenantUpdate,
  tenantDelete,
  assignSchoolBeforeChange,
  getSchoolField,
} from '../lib/access'

// Inizializza Brevo solo se API key presente
let brevo: Brevo.TransactionalEmailsApi | null = null
if (process.env.BREVO_API_KEY) {
  brevo = new Brevo.TransactionalEmailsApi()
  brevo.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
  )
}

// Type for communication priority
type CommunicationPriority = 'low' | 'normal' | 'high' | 'urgent'

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
        if (!brevo) return

        try {
          // Trova iscritti della stessa scuola
          const subscribers = await req.payload.find({
            collection: 'email-subscribers',
            where: {
              and: [
                { isActive: { equals: true } },
                { school: { equals: doc.school } },
              ],
            },
            limit: 1000,
          })

          if (subscribers.docs.length === 0) {
            console.log('Nessun iscritto per questa scuola')
            return
          }

          console.log(
            `Invio comunicazione a ${subscribers.docs.length} iscritti per: ${doc.title}`
          )

          const priority = doc.priority as CommunicationPriority

          const priorityEmoji: Record<CommunicationPriority, string> = {
            low: 'ℹ️',
            normal: '🔔',
            high: '⚠️',
            urgent: '🚨',
          }

          const priorityLabels: Record<CommunicationPriority, string> = {
            low: 'Bassa',
            normal: 'Normale',
            high: 'Alta',
            urgent: 'URGENTE',
          }

          const priorityColors: Record<CommunicationPriority, string> = {
            low: '#3b82f6',
            normal: '#6b7280',
            high: '#f97316',
            urgent: '#ef4444',
          }

          const emailHtml = (unsubscribeUrl: string) => `
            <!DOCTYPE html>
            <html lang="it">
              <body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
                <div style="max-width:600px;margin:0 auto;padding:20px;">
                  <div style="text-align:center;padding:30px 0 20px 0;">
                    <h1 style="margin:0;font-size:24px;color:#1f2937;">🏫 Scuola</h1>
                    <p style="margin:5px 0 0;color:#6b7280;font-size:14px;">Comunicazioni di Servizio</p>
                  </div>

                  <div style="background:white;border-radius:12px;border:1px solid #e5e7eb;">
                    <div style="background:${priorityColors[priority]};padding:12px 20px;">
                      <span style="color:white;font-weight:600;font-size:13px;">
                        ${priorityEmoji[priority]}
                        Priorità: ${priorityLabels[priority]}
                      </span>
                    </div>

                    <div style="padding:30px;">
                      <h2 style="margin:0 0 20px;font-size:22px;color:#1f2937;">${doc.title}</h2>

                      <p style="color:#4b5563;font-size:15px;line-height:1.6;">
                        È stata pubblicata una nuova comunicazione importante.
                      </p>

                      <div style="text-align:center;margin:30px 0;">
                        <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/comunicazioni"
                          style="background:#2563eb;color:white;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:600;">
                          📄 Visualizza Comunicazioni
                        </a>
                      </div>

                      <p style="color:#6b7280;font-size:13px;margin-top:20px;">
                        Pubblicato il ${new Date(doc.publishedAt).toLocaleDateString('it-IT', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div style="text-align:center;padding:20px;">
                    <p style="color:#9ca3af;font-size:12px;">
                      Hai ricevuto questa email perché sei iscritto alle notifiche.
                    </p>
                    <a href="${unsubscribeUrl}" style="font-size:12px;color:#6b7280;text-decoration:underline;">
                      Annulla iscrizione
                    </a>
                  </div>
                </div>
              </body>
            </html>
          `

          // Invia a tutti gli iscritti
          const sendPromises = subscribers.docs.map(async (subscriber) => {
            const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/unsubscribe?token=${subscriber.unsubscribeToken}`

            return brevo!.sendTransacEmail({
              sender: { name: process.env.BREVO_SENDER_NAME!, email: process.env.BREVO_SENDER_EMAIL! },
              to: [{ email: subscriber.email }],
              subject: `${priorityEmoji[priority]} Nuova comunicazione: ${doc.title}`,
              htmlContent: emailHtml(unsubscribeUrl),
            })
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
