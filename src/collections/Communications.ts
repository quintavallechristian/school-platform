import { CollectionConfig } from 'payload'
import { Resend } from 'resend'
import {
  tenantRead,
  tenantCreate,
  tenantUpdate,
  tenantDelete,
  assignSchoolBeforeChange,
  getSchoolField,
} from '../lib/access'

// Inizializza Resend solo se la chiave API è presente
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

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
    group: 'Scuola e genitori',
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
        // Invia email solo quando viene creata una nuova comunicazione attiva
        if (operation === 'create' && doc.isActive && resend) {
          try {
            // Recupera tutti gli iscritti attivi DELLA STESSA SCUOLA
            const subscribers = await req.payload.find({
              collection: 'email-subscribers',
              where: {
                and: [
                  {
                    isActive: {
                      equals: true,
                    },
                  },
                  {
                    school: {
                      equals: doc.school,
                    },
                  },
                ],
              },
              limit: 1000,
            })
            console.log(subscribers.docs);

            if (subscribers.docs.length === 0) {
              console.log('Nessun iscritto trovato per le notifiche email')
              return
            }

            console.log(
              `Invio notifiche email a ${subscribers.docs.length} iscritti per: "${doc.title}"`,
            )

            // Emoji per priorità
            const priorityEmoji = {
              low: 'ℹ️',
              normal: '🔔',
              high: '⚠️',
              urgent: '🚨',
            }

            const priorityLabels = {
              low: 'Bassa',
              normal: 'Normale',
              high: 'Alta',
              urgent: 'URGENTE',
            }

            const priorityColors = {
              low: '#3b82f6',
              normal: '#6b7280',
              high: '#f97316',
              urgent: '#ef4444',
            }

            // Invia email a tutti gli iscritti
            const emailPromises = subscribers.docs.map(async (subscriber) => {
              try {
                console.log(`Tentativo invio email a: ${subscriber.email}`)
                const result = await resend.emails.send({
                  from: 'Scuola <onboarding@resend.dev>', // Email di test di Resend
                  to: subscriber.email,
                  subject: `${priorityEmoji[doc.priority as keyof typeof priorityEmoji]} Nuova comunicazione: ${doc.title}`,
                  html: `
                    <!DOCTYPE html>
                    <html lang="it">
                      <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Nuova Comunicazione</title>
                      </head>
                      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
                        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">

                          <!-- Header -->
                          <div style="text-align: center; padding: 30px 0 20px 0;">
                            <h1 style="color: #1f2937; margin: 0; font-size: 24px;">🏫 Scuola</h1>
                            <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">Comunicazioni di Servizio</p>
                          </div>

                          <!-- Main Card -->
                          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

                            <!-- Priority Badge -->
                            <div style="background: ${priorityColors[doc.priority as keyof typeof priorityColors]}; padding: 12px 20px;">
                              <span style="color: white; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                                ${priorityEmoji[doc.priority as keyof typeof priorityEmoji]}
                                Priorità: ${priorityLabels[doc.priority as keyof typeof priorityLabels]}
                              </span>
                            </div>

                            <!-- Content -->
                            <div style="padding: 30px;">
                              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px; line-height: 1.3;">
                                ${doc.title}
                              </h2>

                              <div style="color: #4b5563; line-height: 1.6; font-size: 15px; margin-bottom: 25px;">
                                <p>È stata pubblicata una nuova comunicazione importante.</p>
                              </div>

                              <div style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/comunicazioni"
                                   style="display: inline-block; padding: 14px 32px; background: #2563eb;
                                          color: white; text-decoration: none; border-radius: 8px;
                                          font-weight: 600; font-size: 15px; box-shadow: 0 2px 4px rgba(37,99,235,0.2);">
                                  📄 Visualizza Comunicazioni
                                </a>
                              </div>

                              <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                                <p style="color: #6b7280; font-size: 13px; margin: 5px 0;">
                                  📅 Pubblicato il ${new Date(doc.publishedAt).toLocaleDateString(
                                    'it-IT',
                                    {
                                      day: '2-digit',
                                      month: 'long',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    },
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>

                          <!-- Footer -->
                          <div style="margin-top: 30px; padding: 20px; text-align: center;">
                            <p style="color: #9ca3af; font-size: 12px; margin: 0 0 10px 0;">
                              Hai ricevuto questa email perché sei iscritto alle notifiche delle comunicazioni.
                            </p>
                            <p style="margin: 0;">
                              <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/api/unsubscribe?token=${subscriber.unsubscribeToken}"
                                 style="color: #6b7280; font-size: 12px; text-decoration: underline;">
                                Annulla iscrizione
                              </a>
                            </p>
                          </div>

                        </div>
                      </body>
                    </html>
                  `,
                })
                console.log(`✅ Email inviata con successo a: ${subscriber.email}`, result)
                return { success: true, email: subscriber.email }
              } catch (error) {
                console.error(`❌ Errore invio email a ${subscriber.email}:`, error)
                return { success: false, email: subscriber.email, error }
              }
            })

            // Attendi tutte le email
            const results = await Promise.allSettled(emailPromises)

            const successful = results.filter((r) => r.status === 'fulfilled').length
            const failed = results.filter((r) => r.status === 'rejected').length

            console.log(`Email inviate: ${successful} successi, ${failed} errori`)
          } catch (error) {
            console.error("Errore durante l'invio delle notifiche email:", error)
          }
        }
      },
    ],
  },
  fields: [
    getSchoolField('Scuola a cui appartiene questa comunicazione'),
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
      name: 'priority',
      type: 'select',
      required: true,
      label: 'Priorità',
      defaultValue: 'normal',
      options: [
        {
          label: 'Bassa',
          value: 'low',
        },
        {
          label: 'Normale',
          value: 'normal',
        },
        {
          label: 'Alta',
          value: 'high',
        },
        {
          label: 'Urgente',
          value: 'urgent',
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Attiva',
      defaultValue: true,
      admin: {
        description: 'Solo le comunicazioni attive vengono mostrate e inviano notifiche',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      label: 'Data pubblicazione',
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: {
          displayFormat: 'd MMMM yyyy HH:mm',
        },
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Data scadenza (opzionale)',
      admin: {
        description: 'Dopo questa data la comunicazione non verrà più mostrata',
        date: {
          displayFormat: 'd MMMM yyyy HH:mm',
        },
      },
    },
    {
      name: 'linkedArticle',
      type: 'relationship',
      relationTo: 'articles',
      label: 'Articolo Collegato',
      admin: {
        description: 'Collega un articolo per maggiori dettagli (opzionale)',
        condition: (data) => !data.linkedEvent,
      },
    },
    {
      name: 'linkedEvent',
      type: 'relationship',
      relationTo: 'events',
      label: 'Evento Collegato',
      admin: {
        description: 'Collega un evento per maggiori dettagli (opzionale)',
        condition: (data) => !data.linkedArticle,
      },
    },
  ],
}
