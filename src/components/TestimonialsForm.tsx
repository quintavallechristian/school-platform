'use client'
import React, { useState } from 'react'
import SpotlightCard from './SpotlightCard/SpotlightCard'
import { Button } from './ui/button'
import { Label } from './ui/label'

export type TestimonialFormProps = {
  schoolId: string | number
  onSuccess?: () => void
}

export default function TestimonialForm({ schoolId, onSuccess }: TestimonialFormProps) {
  const [authorName, setAuthorName] = useState('')
  const [role, setRole] = useState('')
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(5)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school: schoolId,
          authorName,
          role,
          content,
          rating,
          isActive: true,
          approved: false,
        }),
      })
      if (!res.ok) throw new Error("Errore durante l'invio. Riprova più tardi.")
      setSuccess(true)
      setAuthorName('')
      setRole('')
      setContent('')
      setRating(5)
      if (onSuccess) onSuccess()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Errore sconosciuto')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-5xl mx-auto p-6">
      <SpotlightCard>
        <h3 className="text-2xl font-bold mb-2">Lascia una testimonianza</h3>
        <div>
          <Label className="block font-semibold mt-4">Nome *</Label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label className="block font-semibold mt-4">Ruolo</Label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Genitore, Ex Studente, Insegnante..."
          />
        </div>
        <div>
          <Label className="block font-semibold mt-4">Testimonianza *</Label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
          />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {success && (
          <div className="text-green-600">
            Grazie! La tua testimonianza è stata inviata e sarà visibile dopo l&apos;approvazione.
          </div>
        )}
        <Button type="submit" className="mt-4 w-full" disabled={submitting}>
          {submitting ? 'Invio in corso...' : 'Invia'}
        </Button>
      </SpotlightCard>
    </form>
  )
}
