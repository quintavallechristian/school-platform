'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

export function ChangePasswordForm() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Tutti i campi sono obbligatori')
      return
    }

    if (newPassword.length < 8) {
      setError('La nuova password deve essere di almeno 8 caratteri')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Le password non coincidono')
      return
    }

    if (currentPassword === newPassword) {
      setError('La nuova password deve essere diversa da quella attuale')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/parents/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Errore durante il cambio password')
        return
      }

      setSuccess('Password aggiornata con successo!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.refresh()
      }, 2000)
    } catch (err) {
      console.log(err)
      setError('Errore di connessione. Riprova più tardi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="currentPassword">Password attuale</label>
        <Input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Inserisci la password attuale"
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="newPassword">Nuova password</label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Inserisci la nuova password"
          disabled={isLoading}
          required
        />
        <p className="text-xs text-muted-foreground">Minimo 8 caratteri</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword">Conferma nuova password</label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Conferma la nuova password"
          disabled={isLoading}
          required
        />
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-300 font-medium">{success}</p>
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Aggiornamento in corso...' : 'Aggiorna password'}
      </Button>
    </form>
  )
}
