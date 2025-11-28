'use client'

import React, { useState } from 'react'
import { Calendar, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Event } from '@/payload-types'
import Link from 'next/link'

interface EventBookingProps {
  event: Event
  isParent: boolean
  userId: string | null
  existingBooking?: {
    id: string
    status: string
    timeSlot?: string | null
  } | null
}

function generateTimeSlots(startTime: string, endTime: string, duration: number): string[] {
  const slots: string[] = []
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)

  let currentTime = startHour * 60 + startMin
  const endTimeMin = endHour * 60 + endMin

  while (currentTime + duration <= endTimeMin) {
    const slotStart = `${String(Math.floor(currentTime / 60)).padStart(2, '0')}:${String(currentTime % 60).padStart(2, '0')}`
    const slotEnd = `${String(Math.floor((currentTime + duration) / 60)).padStart(2, '0')}:${String((currentTime + duration) % 60).padStart(2, '0')}`
    slots.push(`${slotStart}-${slotEnd}`)
    currentTime += duration
  }

  return slots
}

export const EventBooking: React.FC<EventBookingProps> = ({
  event,
  isParent,
  userId,
  existingBooking,
}) => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [showSlots, setShowSlots] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  if (!event.isBookable || !event.bookingSettings) {
    return null
  }

  const { bookingDeadline, maxCapacity, useTimeSlots, slotDuration, startTime, endTime } =
    event.bookingSettings

  const isDeadlinePassed = bookingDeadline && new Date(bookingDeadline) < new Date()

  const timeSlots =
    useTimeSlots && startTime && endTime && slotDuration
      ? generateTimeSlots(startTime, endTime, parseInt(slotDuration))
      : []

  const handleBooking = async (timeSlot?: string) => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/book-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          timeSlot: timeSlot || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setBookingSuccess(true)
        setMessage(data.message || 'Prenotazione confermata!')
        setShowSlots(false)
      } else {
        setMessage(data.error || 'Errore durante la prenotazione')
      }
    } catch (_error) {
      setMessage('Errore di connessione')
    } finally {
      setLoading(false)
    }
  }

  if (!userId) {
    return (
      <div className="p-6 rounded-xl bg-muted/50 border border-border">
        <h3 className="text-lg font-semibold mb-2">Prenotazione Evento</h3>
        <p className="text-muted-foreground mb-4">
          Devi accedere come genitore per prenotare questo evento.
        </p>
        <Button asChild variant="outline">
          <Link href="/admin/login">Accedi</Link>
        </Button>
      </div>
    )
  }

  if (!isParent) {
    return null // Only parents can book
  }

  if (existingBooking || bookingSuccess) {
    return (
      <div className="p-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
          <span className="text-xl">✓</span>
          Prenotazione Confermata
        </h3>
        <p className="text-green-700 dark:text-green-400">
          Hai prenotato questo evento.
          {existingBooking?.timeSlot && (
            <span className="block mt-1 font-medium">
              Fascia oraria: {existingBooking.timeSlot}
            </span>
          )}
        </p>
        {message && <p className="mt-2 text-sm text-green-600 dark:text-green-400">{message}</p>}
      </div>
    )
  }

  if (isDeadlinePassed) {
    return (
      <div className="p-6 rounded-xl bg-muted/50 border border-border">
        <h3 className="text-lg font-semibold mb-2">Prenotazioni Chiuse</h3>
        <p className="text-destructive font-medium">
          Il termine per le prenotazioni è scaduto il{' '}
          {new Date(bookingDeadline!).toLocaleDateString('it-IT')}.
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        Prenota il tuo posto
      </h3>

      <div className="space-y-4">
        {maxCapacity && !useTimeSlots && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Posti totali: {maxCapacity}</span>
          </div>
        )}

        {useTimeSlots && timeSlots.length > 0 ? (
          <div className="space-y-4">
            {!showSlots ? (
              <Button onClick={() => setShowSlots(true)} disabled={loading} className="w-full">
                <Clock className="mr-2 h-4 w-4" />
                Scegli fascia oraria
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium">Seleziona una fascia oraria:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                        selectedSlot === slot
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted border-input'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleBooking(selectedSlot)}
                    disabled={!selectedSlot || loading}
                    className="flex-1"
                  >
                    {loading ? 'Prenotazione...' : 'Conferma'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowSlots(false)
                      setSelectedSlot('')
                    }}
                  >
                    Annulla
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Button onClick={() => handleBooking()} disabled={loading} className="w-full">
            {loading ? 'Prenotazione...' : 'Prenota ora'}
          </Button>
        )}

        {message && <p className="text-sm text-destructive mt-2">{message}</p>}
      </div>
    </div>
  )
}
