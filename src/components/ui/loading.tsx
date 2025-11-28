'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

/**
 * Componente Loading accessibile conforme WCAG 2.1 AA
 * - Annunciato agli screen reader con role="status"
 * - Testo nascosto visivamente ma leggibile
 * - Supporto aria-live per aggiornamenti dinamici
 */

export interface LoadingSpinnerProps {
  /**
   * Testo da annunciare agli screen reader
   * @default "Caricamento in corso"
   */
  label?: string

  /**
   * Dimensione dello spinner
   * @default "default"
   */
  size?: 'sm' | 'default' | 'lg'

  /**
   * Mostra il testo visivamente (non solo per screen reader)
   * @default false
   */
  showLabel?: boolean

  /**
   * Classe CSS aggiuntiva
   */
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  default: 'h-8 w-8',
  lg: 'h-12 w-12',
}

export function LoadingSpinner({
  label = 'Caricamento in corso',
  size = 'default',
  showLabel = false,
  className,
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn('flex items-center justify-center gap-2', className)}
    >
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} aria-hidden="true" />
      <span className={cn(!showLabel && 'sr-only')}>{label}</span>
    </div>
  )
}

/**
 * Skeleton loader accessibile per contenuti in caricamento
 */
export interface SkeletonProps {
  /**
   * Classe CSS aggiuntiva
   */
  className?: string

  /**
   * Testo da annunciare agli screen reader
   * @default "Caricamento contenuto"
   */
  label?: string
}

export function Skeleton({ className, label = 'Caricamento contenuto' }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn('animate-pulse rounded-md bg-muted', className)}
    >
      <span className="sr-only">{label}</span>
    </div>
  )
}

/**
 * Loading overlay a schermo intero
 */
export interface LoadingOverlayProps {
  /**
   * Visibilità dell'overlay
   */
  visible: boolean

  /**
   * Testo da mostrare
   * @default "Caricamento in corso..."
   */
  message?: string

  /**
   * Mostra il messaggio visivamente
   * @default true
   */
  showMessage?: boolean
}

export function LoadingOverlay({
  visible,
  message = 'Caricamento in corso...',
  showMessage = true,
}: LoadingOverlayProps) {
  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="assertive"
      aria-busy="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" aria-hidden="true" />
        <p className={cn('text-lg font-medium', !showMessage && 'sr-only')}>{message}</p>
      </div>
    </div>
  )
}

/**
 * Progress bar accessibile
 */
export interface ProgressBarProps {
  /**
   * Valore corrente (0-100)
   */
  value: number

  /**
   * Label descrittivo
   */
  label: string

  /**
   * Mostra la percentuale visivamente
   * @default true
   */
  showPercentage?: boolean

  /**
   * Classe CSS aggiuntiva
   */
  className?: string
}

export function ProgressBar({ value, label, showPercentage = true, className }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, value))

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        {showPercentage && <span className="text-sm text-muted-foreground">{percentage}%</span>}
      </div>
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-2 w-full overflow-hidden rounded-full bg-secondary"
      >
        <div
          className="h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
