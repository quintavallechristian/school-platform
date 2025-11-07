'use client'

import { useEffect, useState } from 'react'
import { Communication } from '@/payload-types'
import { X, AlertCircle, Info, AlertTriangle, Bell, ArrowRight } from 'lucide-react'
import { RichTextRenderer } from '@/components/RichTextRenderer/RichTextRenderer'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import Link from 'next/link'
import { Button } from '../ui/button'

interface CommunicationsPopupProps {
  communications: Communication[]
}

const priorityConfig = {
  low: {
    icon: Info,
    color: 'text-blue-600 dark:text-blue-400',
    spotlightColor: 'rgba(59, 130, 246, 0.3)' as `rgba(${number}, ${number}, ${number}, ${number})`,
  },
  normal: {
    icon: Bell,
    color: 'text-gray-600 dark:text-gray-400',
    spotlightColor:
      'rgba(107, 114, 128, 0.3)' as `rgba(${number}, ${number}, ${number}, ${number})`,
  },
  high: {
    icon: AlertTriangle,
    color: 'text-orange-600 dark:text-orange-400',
    spotlightColor: 'rgba(249, 115, 22, 0.3)' as `rgba(${number}, ${number}, ${number}, ${number})`,
  },
  urgent: {
    icon: AlertCircle,
    color: 'text-red-600 dark:text-red-400',
    spotlightColor: 'rgba(239, 68, 68, 0.3)' as `rgba(${number}, ${number}, ${number}, ${number})`,
  },
}

const STORAGE_KEY = 'dismissedCommunications'

export function CommunicationsPopup({ communications }: CommunicationsPopupProps) {
  const [visibleComm, setVisibleComm] = useState<Communication | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Leggi le comunicazioni già chiuse dal localStorage
    const dismissed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as string[]

    // Trova la prima comunicazione non chiusa
    const unreadComm = communications.find((comm) => !dismissed.includes(comm.id))

    if (unreadComm) {
      setVisibleComm(unreadComm)
      setIsOpen(true)
    }
  }, [communications])

  const handleDismiss = () => {
    if (!visibleComm) return

    // Salva l'ID della comunicazione chiusa
    const dismissed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as string[]
    dismissed.push(visibleComm.id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissed))

    setIsOpen(false)

    // Cerca la prossima comunicazione non letta
    setTimeout(() => {
      const nextComm = communications.find((comm) => !dismissed.includes(comm.id))
      if (nextComm) {
        setVisibleComm(nextComm)
        setIsOpen(true)
      } else {
        setVisibleComm(null)
      }
    }, 300)
  }

  if (!isOpen || !visibleComm) return null

  const config = priorityConfig[visibleComm.priority as keyof typeof priorityConfig]
  const Icon = config.icon

  // Determina se c'è un link (articolo O evento)
  const hasLink = visibleComm.linkedArticle || visibleComm.linkedEvent
  const linkedArticle =
    visibleComm.linkedArticle && typeof visibleComm.linkedArticle !== 'string'
      ? visibleComm.linkedArticle
      : null
  const linkedEvent =
    visibleComm.linkedEvent && typeof visibleComm.linkedEvent !== 'string'
      ? visibleComm.linkedEvent
      : null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <SpotlightCard
          spotlightColor={config.spotlightColor}
          bgClassName="bg-linear-to-br from-white to-slate-100 dark:from-gray-900 dark:to-gray-800"
          className="w-full max-w-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center gap-4 pb-4 border-b dark:border-gray-700">
            <div className={`shrink-0 ${config.color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{visibleComm.title}</h2>
            </div>
            <button
              onClick={handleDismiss}
              className="shrink-0 rounded-lg p-1 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Chiudi"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="py-6 max-h-[60vh] overflow-y-auto">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <RichTextRenderer content={visibleComm.content} />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
            <p className="text-xs text-muted-foreground">
              Pubblicato il{' '}
              {new Intl.DateTimeFormat('it-IT', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              }).format(new Date(visibleComm.publishedAt))}
            </p>

            {/* CTA: Se c'è un link mostra il link, altrimenti "Ho capito" */}
            {hasLink ? (
              linkedArticle ? (
                <Link href={`/blog/${linkedArticle.slug}`} onClick={handleDismiss}>
                  <Button className="flex gap-2 items-center">
                    Leggi l'articolo <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : linkedEvent ? (
                <Link href={`/eventi/${linkedEvent.id}`} onClick={handleDismiss}>
                  <Button className="flex gap-2 items-center">
                    Vedi l'evento <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : null
            ) : (
              <Button onClick={handleDismiss} className="flex gap-2 items-center">
                Ho capito <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </SpotlightCard>
      </div>
    </>
  )
}
