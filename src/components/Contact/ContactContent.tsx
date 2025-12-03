'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Mail, Send } from 'lucide-react'
import Link from 'next/link'

export function ContactContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Qui implementerai l'invio del form (es. API endpoint)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulazione
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setSubmitStatus('idle')
  }

  return (
    <div className="py-8">
      <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
        <p className="text-muted-foreground text-center mb-12">
          Siamo qui per aiutarti. Compila il form qui sotto o contattaci direttamente tramite i
          nostri canali.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Informazioni di Contatto</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-muted-foreground">info@scuoleinfanzia.it</p>
                <p className="text-muted-foreground">supporto@scuoleinfanzia.it</p>
              </div>
            </div>
          </div>

          {/* FAQ Link */}
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-2">Hai bisogno di risposte immediate?</p>
            <Link
              href="/faq"
              className="text-primary hover:underline font-medium inline-flex items-center"
            >
              Consulta le nostre FAQ →
            </Link>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Inviaci un Messaggio</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Nome e Cognome *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Mario Rossi"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="mario.rossi@example.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefono</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+39 123 456 7890"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="subject">Oggetto *</Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="Come possiamo aiutarti?"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="message">Messaggio *</Label>
              <Textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Descrivi la tua richiesta..."
                rows={6}
                className="mt-1"
              />
            </div>

            {submitStatus === 'success' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                Messaggio inviato con successo! Ti risponderemo al più presto.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                Si è verificato un errore. Riprova più tardi.
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
              {isSubmitting ? (
                'Invio in corso...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Invia Messaggio
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Inviando questo form accetti la nostra{' '}
              <Link href="/privacy-policy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
