'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'

export function EmailSubscription() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/subscribe-communications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || 'Iscrizione completata con successo!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || "Errore durante l'iscrizione")
      }
    } catch (error) {
      setStatus('error')
      setMessage('Errore di connessione. Riprova più tardi.')
      console.error('Subscription error:', error)
    }
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-primary/10 p-3">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Ricevi notifiche via email</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Inserisci la tua email per ricevere notifiche quando vengono pubblicate nuove
            comunicazioni importanti.
          </p>

          {status === 'success' ? (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="text-sm text-green-700 dark:text-green-300">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tuaemail@esempio.it"
                  required
                  className="flex-1 px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={status === 'loading'}
                />
                <Button type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Iscrizione...' : 'Iscriviti'}
                </Button>
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                La tua email verrà utilizzata solo per inviarti notifiche sulle comunicazioni.
                Potrai disiscriverti in qualsiasi momento.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
