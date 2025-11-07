'use client'

import { Communication } from '@/payload-types'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { RichTextRenderer } from '@/components/RichTextRenderer/RichTextRenderer'
import { AlertCircle, Info, AlertTriangle, Bell, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface CommunicationsListProps {
  communications: Communication[]
}

const priorityConfig = {
  low: {
    label: 'Bassa',
    icon: Info,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    spotlightColor: 'rgba(59, 130, 246, 0.2)' as `rgba(${number}, ${number}, ${number}, ${number})`,
  },
  normal: {
    label: 'Normale',
    icon: Bell,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-500/10 border-gray-500/20',
    spotlightColor:
      'rgba(107, 114, 128, 0.2)' as `rgba(${number}, ${number}, ${number}, ${number})`,
  },
  high: {
    label: 'Alta',
    icon: AlertTriangle,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/20',
    spotlightColor: 'rgba(249, 115, 22, 0.2)' as `rgba(${number}, ${number}, ${number}, ${number})`,
  },
  urgent: {
    label: 'Urgente',
    icon: AlertCircle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/20',
    spotlightColor: 'rgba(239, 68, 68, 0.2)' as `rgba(${number}, ${number}, ${number}, ${number})`,
  },
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function CommunicationsList({ communications }: CommunicationsListProps) {
  return (
    <div className="space-y-4">
      {communications.map((comm) => {
        const config = priorityConfig[comm.priority as keyof typeof priorityConfig]
        const Icon = config.icon

        return (
          <SpotlightCard
            key={comm.id}
            spotlightColor={config.spotlightColor}
            bgClassName="bg-linear-to-br from-white to-slate-100 dark:from-gray-900 dark:to-gray-800"
          >
            <div className="flex gap-4">
              {/* Icona priorità */}
              <div className={`shrink-0 ${config.color}`}>
                <Icon className="h-6 w-6" />
              </div>

              {/* Contenuto */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-xl font-semibold">{comm.title}</h3>
                  <span
                    className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-full border ${config.bgColor} ${config.color}`}
                  >
                    {config.label}
                  </span>
                </div>

                <div className="prose prose-sm dark:prose-invert max-w-none mb-3">
                  <RichTextRenderer content={comm.content} />
                </div>

                {/* Links a articoli o eventi */}
                {(comm.linkedArticle || comm.linkedEvent) && (
                  <div className="mb-3 space-x-4">
                    {comm.linkedArticle && typeof comm.linkedArticle !== 'string' && (
                      <Link
                        href={`/blog/${comm.linkedArticle.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        📰 Leggi l&apos;articolo
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                    {comm.linkedEvent && typeof comm.linkedEvent !== 'string' && (
                      <Link
                        href={`/eventi/${comm.linkedEvent.id}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        📅 Vedi l&apos;evento
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  Pubblicato il {formatDate(comm.publishedAt)}
                </p>
              </div>
            </div>
          </SpotlightCard>
        )
      })}
    </div>
  )
}
