'use client'

import { CalendarDay } from '@/payload-types'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import Link from 'next/link'
import { ArrowRight, Calendar, Users, Clock } from 'lucide-react'
import { useState } from 'react'

interface CalendarViewProps {
  calendarDays: CalendarDay[]
  schoolSlug?: string
  isParent?: boolean
  userId?: string | null
}

const typeLabels = {
  holiday: 'Festività',
  closure: 'Chiusura',
  event: 'Evento',
  trip: 'Gita',
}

const typeToColor = {
  holiday: 'destructive',
  closure: 'chart1',
  event: 'chart2',
  trip: 'chart5',
}

const colorClasses = {
  chart1: 'bg-[hsl(var(--chart-1))]/10 border-[hsl(var(--chart-1))]/20 text-[hsl(var(--chart-1))]',
  destructive:
    'bg-[hsl(var(--destructive))]/10 border-[hsl(var(--destructive))]/20 text-[hsl(var(--destructive))]',
  chart2: 'bg-[hsl(var(--chart-2))]/10 border-[hsl(var(--chart-2))]/20 text-[hsl(var(--chart-2))]',
  chart5: 'bg-[hsl(var(--chart-5))]/10 border-[hsl(var(--chart-5))]/20 text-[hsl(var(--chart-5))]',
}

const spotlightColors = {
  chart1: 'rgba(108, 164, 223, 0.3)' as `rgba(${number}, ${number}, ${number}, ${number})`,
  destructive: 'rgba(232, 105, 82, 0.3)' as `rgba(${number}, ${number}, ${number}, ${number})`,
  chart2: 'rgba(129, 201, 149, 0.3)' as `rgba(${number}, ${number}, ${number}, ${number})`,
  chart5: 'rgba(224, 151, 140, 0.3)' as `rgba(${number}, ${number}, ${number}, ${number})`,
}

function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short',
  }).format(date)
}

function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
  }).format(date)
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

function BookingButton({
  eventId,
  useTimeSlots,
  startTime,
  endTime,
  slotDuration,
}: {
  eventId: string
  useTimeSlots?: boolean
  startTime?: string
  endTime?: string
  slotDuration?: string
}) {
  const [loading, setLoading] = useState(false)
  const [booked, setBooked] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [showSlots, setShowSlots] = useState(false)

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
          calendarEventId: eventId,
          timeSlot: timeSlot || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setBooked(true)
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

  if (booked) {
    return <div className="text-sm text-green-600 dark:text-green-400 font-medium">✓ {message}</div>
  }

  if (useTimeSlots && timeSlots.length > 0) {
    return (
      <div className="space-y-3">
        {!showSlots ? (
          <button
            onClick={() => setShowSlots(true)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Clock className="h-4 w-4" />
            Scegli fascia oraria
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium">Seleziona una fascia oraria:</p>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedSlot === slot
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/70'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleBooking(selectedSlot)}
                disabled={!selectedSlot || loading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Calendar className="h-4 w-4" />
                {loading ? 'Prenotazione...' : 'Conferma'}
              </button>
              <button
                onClick={() => {
                  setShowSlots(false)
                  setSelectedSlot('')
                }}
                className="px-4 py-2 rounded-lg bg-muted text-foreground font-medium text-sm hover:bg-muted/70 transition-colors"
              >
                Annulla
              </button>
            </div>
          </div>
        )}
        {message && <p className="text-sm text-destructive">{message}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => handleBooking()}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Calendar className="h-4 w-4" />
        {loading ? 'Prenotazione...' : 'Prenota'}
      </button>
      {message && <p className="text-sm text-destructive">{message}</p>}
    </div>
  )
}

export function CalendarView({ calendarDays, schoolSlug, isParent, userId }: CalendarViewProps) {
  const sortedDays = [...calendarDays].sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  })

  const groupedByMonth = sortedDays.reduce(
    (acc, day) => {
      const date = new Date(day.startDate)
      const monthYear = new Intl.DateTimeFormat('it-IT', {
        month: 'long',
        year: 'numeric',
      }).format(date)

      if (!acc[monthYear]) {
        acc[monthYear] = []
      }
      acc[monthYear].push(day)
      return acc
    },
    {} as Record<string, CalendarDay[]>,
  )

  return (
    <div className="space-y-12">
      {Object.entries(groupedByMonth).map(([monthYear, days]) => (
        <div key={monthYear}>
          <h2 className="text-3xl font-bold mb-6 capitalize bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {monthYear}
          </h2>
          <div className="space-y-3">
            {days.map((day) => {
              const isRange = day.endDate && day.endDate !== day.startDate
              const color = typeToColor[day.type as keyof typeof typeToColor] || 'chart1'
              const colorClass = colorClasses[color as keyof typeof colorClasses]
              const spotlightColor = spotlightColors[color as keyof typeof spotlightColors]

              const isBookable = day.isBookable === true
              const useTimeSlots = day.bookingSettings?.useTimeSlots === true

              return (
                <SpotlightCard
                  key={day.id}
                  spotlightColor={spotlightColor}
                  bgClassName="bg-linear-to-br from-white to-slate-100 dark:from-gray-900 dark:to-gray-800"
                  className="w-full"
                >
                  <div className="flex items-center gap-6">
                    <div className="shrink-0 text-center min-w-[120px]">
                      {isRange ? (
                        <div className="space-y-1">
                          <p className="text-xl font-bold">{formatDateShort(day.startDate)}</p>
                          <p className="text-xs text-muted-foreground">↓</p>
                          <p className="text-xl font-bold">{formatDateShort(day.endDate!)}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-4xl font-bold">{new Date(day.startDate).getDate()}</p>
                          <p className="text-sm font-medium text-muted-foreground capitalize">
                            {new Intl.DateTimeFormat('it-IT', { month: 'short' }).format(
                              new Date(day.startDate),
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {getDayOfWeek(day.startDate)}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="h-16 w-px bg-linear-to-b from-transparent via-border to-transparent" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-1 leading-tight">{day.title}</h3>
                          {day.description && (
                            <p className="text-sm text-muted-foreground">{day.description}</p>
                          )}
                          {day.cost && (
                            <p className="text-sm font-medium text-primary mt-2">
                              💰 Costo: {day.cost}
                            </p>
                          )}

                          {isBookable && day.bookingSettings && (
                            <div className="mt-3 space-y-2">
                              {day.bookingSettings.location && (
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  📍 {day.bookingSettings.location}
                                </p>
                              )}
                              {useTimeSlots &&
                                day.bookingSettings.startTime &&
                                day.bookingSettings.endTime && (
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    Orari disponibili: {day.bookingSettings.startTime} -{' '}
                                    {day.bookingSettings.endTime}
                                    {day.bookingSettings.slotDuration && (
                                      <span className="text-xs">
                                        {' '}
                                        (slot di {day.bookingSettings.slotDuration} min)
                                      </span>
                                    )}
                                  </p>
                                )}
                              {!useTimeSlots && day.bookingSettings.maxCapacity && (
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  Posti disponibili: {day.bookingSettings.maxCapacity}
                                </p>
                              )}
                              {day.bookingSettings.bookingDeadline && (
                                <p className="text-xs text-muted-foreground">
                                  Prenota entro:{' '}
                                  {new Date(day.bookingSettings.bookingDeadline).toLocaleDateString(
                                    'it-IT',
                                  )}
                                </p>
                              )}
                            </div>
                          )}

                          {day.linkedEvent && typeof day.linkedEvent !== 'string' && (
                            <Link
                              href={
                                schoolSlug
                                  ? `/${schoolSlug}/eventi/${day.linkedEvent.id}`
                                  : `/eventi/${day.linkedEvent.id}`
                              }
                              className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-primary hover:underline"
                            >
                              Approfondisci
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          )}

                          {isBookable && isParent && userId && (
                            <div className="mt-4">
                              <BookingButton
                                eventId={day.id}
                                useTimeSlots={useTimeSlots}
                                startTime={day.bookingSettings?.startTime}
                                endTime={day.bookingSettings?.endTime}
                                slotDuration={day.bookingSettings?.slotDuration}
                              />
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 space-y-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${colorClass}`}
                          >
                            {typeLabels[day.type as keyof typeof typeLabels]}
                          </span>
                          {isBookable && (
                            <span className="block text-center bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-xs font-semibold">
                              Prenotabile
                            </span>
                          )}
                          {useTimeSlots && (
                            <span className="block text-center bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full px-3 py-1 text-xs font-semibold">
                              <Clock className="h-3 w-3 inline mr-1" />
                              Fasce
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
