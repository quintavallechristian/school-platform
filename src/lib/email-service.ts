import * as Brevo from '@getbrevo/brevo'
import { readFileSync } from 'fs'
import { join } from 'path'

// Inizializza Brevo solo se API key presente
let brevo: Brevo.TransactionalEmailsApi | null = null
if (process.env.BREVO_API_KEY) {
  brevo = new Brevo.TransactionalEmailsApi()
  brevo.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY)
}

// Type definitions
type CommunicationPriority = 'low' | 'normal' | 'high' | 'urgent'

interface UserCredentialsData {
  roleLabel: string
  email: string
  password: string
  schoolsList: string
  loginUrl: string
}

interface CommunicationData {
  priorityColor: string
  priorityEmoji: string
  priorityLabel: string
  title: string
  publishedDate: string
  communicationsUrl: string
  unsubscribeUrl: string
  schoolName: string
}

// Template rendering utility
function renderTemplate(templateName: string, data: Record<string, string>): string {
  const templatePath = join(process.cwd(), 'src', 'lib', 'email-templates', `${templateName}.html`)
  let template = readFileSync(templatePath, 'utf-8')

  // Replace all placeholders with actual data
  Object.keys(data).forEach((key) => {
    const placeholder = `{{${key}}}`
    template = template.replace(new RegExp(placeholder, 'g'), data[key] || '')
  })

  return template
}

// Priority configuration
const priorityConfig = {
  emoji: {
    low: 'ℹ️',
    normal: '🔔',
    high: '⚠️',
    urgent: '🚨',
  } as Record<CommunicationPriority, string>,
  labels: {
    low: 'Bassa',
    normal: 'Normale',
    high: 'Alta',
    urgent: 'URGENTE',
  } as Record<CommunicationPriority, string>,
  colors: {
    low: '#3b82f6',
    normal: '#6b7280',
    high: '#f97316',
    urgent: '#ef4444',
  } as Record<CommunicationPriority, string>,
}

/**
 * Send user credentials email
 */
export async function sendUserCredentialsEmail(
  to: string,
  data: UserCredentialsData,
): Promise<void> {
  if (!brevo) {
    console.warn('Brevo not initialized, skipping email')
    return
  }

  const htmlContent = renderTemplate('user-credentials', data as unknown as Record<string, string>)

  await brevo.sendTransacEmail({
    sender: {
      name: process.env.BREVO_SENDER_NAME || 'Scuole Infanzia',
      email: process.env.BREVO_SENDER_EMAIL || 'no-reply@scuoleinfanzia.eu',
    },
    to: [{ email: to }],
    subject: '🎉 Benvenuto! Ecco le tue credenziali di accesso',
    htmlContent,
  })

  console.log(`Email con credenziali inviata a ${to}`)
}

/**
 * Send communication notification email
 */
export async function sendCommunicationEmail(
  to: string,
  data: CommunicationData,
  subject: string,
): Promise<void> {
  if (!brevo) {
    console.warn('Brevo not initialized, skipping email')
    return
  }

  const htmlContent = renderTemplate(
    'communication-notification',
    data as unknown as Record<string, string>,
  )

  await brevo.sendTransacEmail({
    sender: {
      name: process.env.BREVO_SENDER_NAME || 'Scuole Infanzia',
      email: process.env.BREVO_SENDER_EMAIL || 'no-reply@scuoleinfanzia.eu',
    },
    to: [{ email: to }],
    subject,
    htmlContent,
  })
}

/**
 * Generic email sender with custom HTML content
 */
export async function sendEmail(to: string, subject: string, htmlContent: string): Promise<void> {
  if (!brevo) {
    throw new Error('Brevo not initialized')
  }

  await brevo.sendTransacEmail({
    sender: {
      name: process.env.BREVO_SENDER_NAME || 'Scuole Infanzia',
      email: process.env.BREVO_SENDER_EMAIL || 'no-reply@scuoleinfanzia.eu',
    },
    to: [{ email: to }],
    subject,
    htmlContent,
  })
}

/**
 * Get priority configuration for communications
 */
export function getPriorityConfig(priority: CommunicationPriority) {
  return {
    emoji: priorityConfig.emoji[priority],
    label: priorityConfig.labels[priority],
    color: priorityConfig.colors[priority],
  }
}

// Export types
export type { UserCredentialsData, CommunicationData, CommunicationPriority }
