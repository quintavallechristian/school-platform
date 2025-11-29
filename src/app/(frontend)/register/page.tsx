'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { useSearchParams } from 'next/navigation'
import EmptyArea from '@/components/EmptyArea/EmptyArea'
import { getPlanFromPrice, priceIdList } from '@/lib/plans'
import { registerSchoolSchema } from '@/lib/validations/register'
import { Suspense, useState } from 'react'
import { z } from 'zod'
import { PrivacyPolicyModal } from '@/components/PrivacyPolicy/PrivacyPolicyModal'
import { TermsOfServiceModal } from '@/components/TermsOfService/TermsOfServiceModal'
import { DpaModal } from '@/components/Dpa/DpaModal'

async function handleCheckout(
  priceId: string,
  schoolId: string,
  schoolSlug: string,
  userId: string,
) {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    body: JSON.stringify({ priceId, schoolId, schoolSlug, userId }),
  })
  const data = await res.json()
  window.location.href = data.url // redirect al checkout
}

function SignupContent() {
  const searchParams = useSearchParams()
  const priceId = searchParams.get('priceId')

  // State per i dati del form e gli errori
  const [formData, setFormData] = useState({
    email: '',
    schoolName: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    acceptPrivacy: false,
    acceptTerms: false,
    acceptDpa: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!priceId || priceId === '' || !priceIdList.includes(priceId)) {
    return (
      <EmptyArea title="Piano non selezionato" message="Seleziona un piano prima di registrarti." />
    )
  }

  // Validazione di un singolo campo
  const validateField = (fieldName: keyof typeof formData, value: string | boolean) => {
    // Crea un oggetto parziale per validare
    const partialData = { ...formData, [fieldName]: value }
    const result = registerSchoolSchema.safeParse(partialData)

    if (result.success) {
      // Se la validazione passa, rimuovi l'errore per questo campo
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    } else {
      // Trova l'errore specifico per questo campo
      const fieldError = result.error.issues.find((issue) => issue.path[0] === fieldName)
      if (fieldError) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: fieldError.message,
        }))
      } else {
        // Se non c'è errore per questo campo specifico, rimuovilo
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[fieldName]
          return newErrors
        })
      }
    }
  }

  // Handler per il cambio di valore nei campi
  const handleFieldChange = (fieldName: keyof typeof formData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
  }

  // Handler per la validazione on blur
  const handleFieldBlur = (fieldName: keyof typeof formData) => {
    validateField(fieldName, formData[fieldName])
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Validazione completa prima dell'invio
    try {
      const validatedData = registerSchoolSchema.parse(formData)
      setErrors({}) // Pulisci tutti gli errori
      setIsSubmitting(true)

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      })

      const data = await response.json()

      if (response.ok) {
        handleCheckout(priceId!, data.schoolId, data.schoolSlug, data.userId)
        toast(data.message || 'Iscrizione completata con successo!')
      } else {
        toast(data.error || "Errore durante l'iscrizione")
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Mostra tutti gli errori di validazione
        const newErrors: Record<string, string> = {}
        error.issues.forEach((issue) => {
          const fieldName = issue.path[0] as string
          newErrors[fieldName] = issue.message
        })
        setErrors(newErrors)
        toast('Correggi gli errori nel form prima di continuare')
      } else {
        toast('Errore di connessione. Riprova più tardi.')
        console.error('Subscription error:', error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <div>
        <SpotlightCard>Stai attivando il piano {getPlanFromPrice(priceId!)}</SpotlightCard>
        <SpotlightCard className="mt-6">
          <h1 className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mb-2 text-center">
            Crea la tua scuola
          </h1>
          <p className="text-gray-500 dark:text-gray-300 text-center mb-6">
            Benvenuto! Registrati per partecipare alle partite e gestire il tuo profilo.
          </p>
          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            <div>
              <label
                htmlFor="schoolName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Nome scuola
              </label>
              <Input
                type="text"
                id="schoolName"
                name="schoolName"
                value={formData.schoolName}
                onChange={(e) => handleFieldChange('schoolName', e.target.value)}
                onBlur={() => handleFieldBlur('schoolName')}
                autoComplete="organization"
                className="focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
              {errors.schoolName && (
                <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>
              )}
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Nome responsabile
                </label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleFieldChange('firstName', e.target.value)}
                  onBlur={() => handleFieldBlur('firstName')}
                  autoComplete="given-name"
                  className="focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Cognome responsabile
                </label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleFieldChange('lastName', e.target.value)}
                  onBlur={() => handleFieldBlur('lastName')}
                  autoComplete="family-name"
                  className="focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email responsabile
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                onBlur={() => handleFieldBlur('email')}
                autoComplete="email"
                className="focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Password
                </label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  onBlur={() => handleFieldBlur('password')}
                  className="focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Conferma Password
                </label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                  onBlur={() => handleFieldBlur('confirmPassword')}
                  className="focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
            <div className="space-y-3 mt-8">
              <div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                    checked={formData.acceptPrivacy}
                    onChange={(e) => handleFieldChange('acceptPrivacy', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-700 dark:text-gray-300">
                    Accetto la{' '}
                    <PrivacyPolicyModal>
                      <span className="underline cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        privacy policy
                      </span>
                    </PrivacyPolicyModal>
                  </label>
                </div>
                {errors.acceptPrivacy && (
                  <p className="text-red-500 text-sm mt-1 ml-6">{errors.acceptPrivacy}</p>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="tos"
                    name="tos"
                    checked={formData.acceptTerms}
                    onChange={(e) => handleFieldChange('acceptTerms', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="tos" className="text-sm text-gray-700 dark:text-gray-300">
                    Accetto i{' '}
                    <TermsOfServiceModal>
                      <span className="underline cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        termini e condizioni
                      </span>
                    </TermsOfServiceModal>
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-red-500 text-sm mt-1 ml-6">{errors.acceptTerms}</p>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="dpa"
                    name="dpa"
                    checked={formData.acceptDpa}
                    onChange={(e) => handleFieldChange('acceptDpa', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="dpa" className="text-sm text-gray-700 dark:text-gray-300">
                    Accetto il{' '}
                    <DpaModal>
                      <span className="underline cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        Data processing agreement
                      </span>
                    </DpaModal>
                  </label>
                </div>
                {errors.acceptDpa && (
                  <p className="text-red-500 text-sm mt-1 ml-6">{errors.acceptDpa}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Registrazione in corso...' : 'Registrati'}
              </Button>
            </div>
          </form>
        </SpotlightCard>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Caricamento...</div>}>
      <SignupContent />
    </Suspense>
  )
}
