'use client'

import { CalendarDay } from '@/payload-types'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface CalendarViewProps {
  calendarDays: CalendarDay[]
  schoolSlug?: string
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

export function CalendarView({ calendarDays, schoolSlug }: CalendarViewProps) {
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

                          {day.linkedEvent && typeof day.linkedEvent !== 'string' && (
                            <Link
                              href={
                                schoolSlug
                                  ? `/${schoolSlug}/eventi/${day.linkedEvent.id}`
                                  : `/eventi/${day.linkedEvent.id}`
                              }
                              className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-primary hover:underline"
                            >
                              Vai all&apos;evento
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          )}
                        </div>

                        <div className="shrink-0 space-y-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${colorClass}`}
                          >
                            {typeLabels[day.type as keyof typeof typeLabels]}
                          </span>
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
