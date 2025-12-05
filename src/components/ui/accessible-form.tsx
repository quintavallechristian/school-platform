'use client'

import * as React from 'react'
import { useId } from 'react'
import { cn } from '@/lib/utils'
import { Label } from './label'

/**
 * Input accessibile conforme WCAG 2.1 AA
 * - Label associato correttamente
 * - Errori annunciati con aria-live
 * - Required fields marcati semanticamente
 * - Descrizioni helper con aria-describedby
 */

export interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
  hideLabel?: boolean
}

export const AccessibleInput = React.forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({ label, error, helperText, required, hideLabel, className, ...props }, ref) => {
    const id = useId()
    const errorId = `${id}-error`
    const helperId = `${id}-helper`

    const describedBy = [error ? errorId : null, helperText ? helperId : null]
      .filter(Boolean)
      .join(' ')

    return (
      <div className="space-y-2">
        <Label
          htmlFor={id}
          className={cn(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            hideLabel && 'sr-only',
          )}
        >
          {label}
          {required && (
            <span className="text-destructive ml-1" aria-label="campo obbligatorio">
              *
            </span>
          )}
        </Label>

        <input
          ref={ref}
          id={id}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive',
            className,
          )}
          {...props}
        />

        {helperText && !error && (
          <p id={helperId} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}

        {error && (
          <div
            id={errorId}
            role="alert"
            aria-live="polite"
            className="text-sm font-medium text-destructive"
          >
            {error}
          </div>
        )}
      </div>
    )
  },
)

AccessibleInput.displayName = 'AccessibleInput'

/**
 * Textarea accessibile
 */
export interface AccessibleTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  helperText?: string
  hideLabel?: boolean
}

export const AccessibleTextarea = React.forwardRef<HTMLTextAreaElement, AccessibleTextareaProps>(
  ({ label, error, helperText, required, hideLabel, className, ...props }, ref) => {
    const id = useId()
    const errorId = `${id}-error`
    const helperId = `${id}-helper`

    const describedBy = [error ? errorId : null, helperText ? helperId : null]
      .filter(Boolean)
      .join(' ')

    return (
      <div className="space-y-2">
        <Label
          htmlFor={id}
          className={cn(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            hideLabel && 'sr-only',
          )}
        >
          {label}
          {required && (
            <span className="text-destructive ml-1" aria-label="campo obbligatorio">
              *
            </span>
          )}
        </Label>

        <textarea
          ref={ref}
          id={id}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive',
            className,
          )}
          {...props}
        />

        {helperText && !error && (
          <p id={helperId} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}

        {error && (
          <div
            id={errorId}
            role="alert"
            aria-live="polite"
            className="text-sm font-medium text-destructive"
          >
            {error}
          </div>
        )}
      </div>
    )
  },
)

AccessibleTextarea.displayName = 'AccessibleTextarea'

/**
 * Select accessibile
 */
export interface AccessibleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  helperText?: string
  hideLabel?: boolean
  options: { value: string; label: string }[]
}

export const AccessibleSelect = React.forwardRef<HTMLSelectElement, AccessibleSelectProps>(
  ({ label, error, helperText, required, hideLabel, options, className, ...props }, ref) => {
    const id = useId()
    const errorId = `${id}-error`
    const helperId = `${id}-helper`

    const describedBy = [error ? errorId : null, helperText ? helperId : null]
      .filter(Boolean)
      .join(' ')

    return (
      <div className="space-y-2">
        <Label
          htmlFor={id}
          className={cn(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            hideLabel && 'sr-only',
          )}
        >
          {label}
          {required && (
            <span className="text-destructive ml-1" aria-label="campo obbligatorio">
              *
            </span>
          )}
        </Label>

        <select
          ref={ref}
          id={id}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive',
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {helperText && !error && (
          <p id={helperId} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}

        {error && (
          <div
            id={errorId}
            role="alert"
            aria-live="polite"
            className="text-sm font-medium text-destructive"
          >
            {error}
          </div>
        )}
      </div>
    )
  },
)

AccessibleSelect.displayName = 'AccessibleSelect'

/**
 * Checkbox accessibile
 */
export interface AccessibleCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
  helperText?: string
}

export const AccessibleCheckbox = React.forwardRef<HTMLInputElement, AccessibleCheckboxProps>(
  ({ label, error, helperText, required, className, ...props }, ref) => {
    const id = useId()
    const errorId = `${id}-error`
    const helperId = `${id}-helper`

    const describedBy = [error ? errorId : null, helperText ? helperId : null]
      .filter(Boolean)
      .join(' ')

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={describedBy || undefined}
            className={cn(
              'h-4 w-4 rounded border-input text-primary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-destructive',
              className,
            )}
            {...props}
          />
          <Label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {required && (
              <span className="text-destructive ml-1" aria-label="campo obbligatorio">
                *
              </span>
            )}
          </Label>
        </div>

        {helperText && !error && (
          <p id={helperId} className="text-sm text-muted-foreground ml-6">
            {helperText}
          </p>
        )}

        {error && (
          <div
            id={errorId}
            role="alert"
            aria-live="polite"
            className="text-sm font-medium text-destructive ml-6"
          >
            {error}
          </div>
        )}
      </div>
    )
  },
)

AccessibleCheckbox.displayName = 'AccessibleCheckbox'
