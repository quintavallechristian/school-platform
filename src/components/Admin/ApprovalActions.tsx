'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface ApprovalActionsProps {
  registrationId: string
  onSuccess?: () => void
}

export default function ApprovalActions({ registrationId, onSuccess }: ApprovalActionsProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleApprove = async () => {
    if (!confirm('Sei sicuro di voler approvare questa richiesta? Verrà creato un nuovo utente genitore.')) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/parent-approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationId,
          action: 'approve',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Errore durante l\'approvazione')
      }

      alert(`Richiesta approvata! Password temporanea: ${result.temporaryPassword}\n\nComunica questa password al genitore.`)
      
      if (onSuccess) {
        onSuccess()
      } else {
        window.location.reload()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    const reason = prompt('Inserisci il motivo del rifiuto (opzionale):')
    if (reason === null) return // User cancelled

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/parent-approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationId,
          action: 'reject',
          rejectionReason: reason,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Errore durante il rifiuto')
      }

      alert('Richiesta rifiutata con successo')
      
      if (onSuccess) {
        onSuccess()
      } else {
        window.location.reload()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button
          onClick={handleApprove}
          disabled={loading}
          variant="default"
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-1" />
              Approva
            </>
          )}
        </Button>
        <Button
          onClick={handleReject}
          disabled={loading}
          variant="destructive"
          size="sm"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <XCircle className="h-4 w-4 mr-1" />
              Rifiuta
            </>
          )}
        </Button>
      </div>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
