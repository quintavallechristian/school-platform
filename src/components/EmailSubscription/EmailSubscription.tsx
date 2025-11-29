'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'
import SpotlightCard from '../SpotlightCard/SpotlightCard'

interface EmailSubscriptionProps {
  schoolId: string | number
}

export function EmailSubscription({ schoolId }: EmailSubscriptionProps) {
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
        body: JSON.stringify({ email, schoolId }),
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
    <SpotlightCard>
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
            <div className="flex items-center gap-2 p-3 bg-[hsl(var(--chart-2))]/10 border border-[hsl(var(--chart-2))]/20 rounded-md">
              <CheckCircle className="h-5 w-5 text-[hsl(var(--chart-2))]" />
              <p className="text-sm text-[hsl(var(--chart-2))]">{message}</p>
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
                <div className="flex items-center gap-2 p-3 bg-[hsl(var(--destructive))]/10 border border-[hsl(var(--destructive))]/20 rounded-md">
                  <AlertCircle className="h-5 w-5 text-[hsl(var(--destructive))]" />
                  <p className="text-sm text-[hsl(var(--destructive))]">{message}</p>
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
    </SpotlightCard>
  )
}
