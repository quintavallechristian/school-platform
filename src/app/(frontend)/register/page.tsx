'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { toast } from 'sonner'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { useSearchParams, useRouter } from 'next/navigation'
import EmptyArea from '@/components/EmptyArea/EmptyArea'
import { getPlanFromPrice, priceIdList, planDetails } from '@/lib/plans'
import { registerSchoolSchema } from '@/lib/validations/register'
import { Suspense, useState, useMemo } from 'react'
import { z } from 'zod'
import { PrivacyPolicyModal } from '@/components/PrivacyPolicy/PrivacyPolicyModal'
import { TermsOfServiceModal } from '@/components/TermsOfService/TermsOfServiceModal'
import { DpaModal } from '@/components/Dpa/DpaModal'
import { trackEvent } from '@/lib/analytics'
import { Label } from '@/components/ui/label'
import Hero from '@/components/Hero/Hero'

function SignupContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
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

  // Determina il piano selezionato e se è annuale o mensile
  const selectedPlanInfo = useMemo(() => {
    if (!priceId) return null

    for (const plan of planDetails) {
      const isYearly = priceId === plan.yearlyPriceId
      const isMonthly = priceId === plan.monthlyPriceId

      if (isYearly || isMonthly) {
        return {
          ...plan,
          billingPeriod: isYearly ? 'yearly' : 'monthly',
          price: isYearly ? plan.yearlyPrice : plan.monthlyPrice,
        }
      }
    }
    return null
  }, [priceId])

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
        body: JSON.stringify({ ...validatedData, priceId }),
      })

      const data = await response.json()

      if (response.ok) {
        // Track successful registration
        trackEvent('sign_up', {
          method: 'email',
          school_name: validatedData.schoolName,
          plan_selected: getPlanFromPrice(priceId!),
        })

        // Redirect direttamente alla pagina di benvenuto con trial attivo
        toast('Registrazione completata! Il tuo trial di 30 giorni è iniziato.')
        router.push(`/${data.schoolSlug}/welcome?trial=1`)
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
    <div className="min-h-screen">
      <Hero
        title="Inizia la tua prova gratuita"
        subtitle="Crea il tuo account e inizia subito a utilizzare la piattaforma per 30 giorni, senza carta di credito."
      />

      <div className="max-w-6xl mx-auto px-8 py-12 -mt-16">
        {/* Piano selezionato */}
        {selectedPlanInfo && (
          <SpotlightCard className="mb-8 relative overflow-hidden">
            {selectedPlanInfo.highlighted && (
              <div className="absolute top-0 right-0 bg-linear-to-r from-orange-600 to-amber-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg rounded-tr-2xl">
                PIÙ POPOLARE
              </div>
            )}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">
                Piano selezionato:{' '}
                <span className="bg-linear-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                  {selectedPlanInfo.name}
                </span>
              </h2>
              <p className="text-muted-foreground">{selectedPlanInfo.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Pricing */}
              <div className="text-center md:text-left">
                <div className="flex items-baseline gap-2 justify-center md:justify-start mb-4">
                  <span className="text-5xl font-bold bg-linear-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                    €{selectedPlanInfo.price}
                  </span>
                  <span className="text-muted-foreground">
                    /{selectedPlanInfo.billingPeriod === 'monthly' ? 'mese' : 'anno'}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    🎉 {selectedPlanInfo.trialDays} giorni di prova gratuita
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Nessuna carta di credito richiesta
                  </p>
                  {selectedPlanInfo.billingPeriod === 'yearly' && (
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                      Risparmia fino al 20% con il piano annuale
                    </p>
                  )}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold mb-3 text-center md:text-left">
                  Funzionalità incluse:
                </h3>
                <ul className="space-y-2">
                  {selectedPlanInfo.features.slice(0, 5).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                  {selectedPlanInfo.features.length > 5 && (
                    <li className="text-sm text-muted-foreground italic">
                      ... e altre {selectedPlanInfo.features.length - 5} funzionalità
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </SpotlightCard>
        )}

        {/* Form di registrazione */}
        <SpotlightCard>
          <h1 className="text-3xl font-bold mb-2 text-center bg-linear-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
            Crea la tua scuola
          </h1>
          <p className="text-muted-foreground text-center mb-6">
            Compila i dati per iniziare subito la tua prova gratuita
          </p>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <Label htmlFor="schoolName" className="block text-sm font-medium mb-1">
                Nome scuola
              </Label>
              <Input
                type="text"
                id="schoolName"
                name="schoolName"
                value={formData.schoolName}
                onChange={(e) => handleFieldChange('schoolName', e.target.value)}
                onBlur={() => handleFieldBlur('schoolName')}
                autoComplete="organization"
                className="focus:ring-orange-500 focus:border-orange-500"
              />
              {errors.schoolName && (
                <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="block text-sm font-medium mb-1">
                  Nome responsabile
                </Label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleFieldChange('firstName', e.target.value)}
                  onBlur={() => handleFieldBlur('firstName')}
                  autoComplete="given-name"
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName" className="block text-sm font-medium mb-1">
                  Cognome responsabile
                </Label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleFieldChange('lastName', e.target.value)}
                  onBlur={() => handleFieldBlur('lastName')}
                  autoComplete="family-name"
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium mb-1">
                Email responsabile
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                onBlur={() => handleFieldBlur('email')}
                autoComplete="email"
                className="focus:ring-orange-500 focus:border-orange-500"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </Label>
                <PasswordInput
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  onBlur={() => handleFieldBlur('password')}
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                  Conferma Password
                </Label>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                  onBlur={() => handleFieldBlur('confirmPassword')}
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t">
              <div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                    checked={formData.acceptPrivacy}
                    onChange={(e) => handleFieldChange('acceptPrivacy', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <Label htmlFor="privacy" className="text-sm">
                    Accetto la{' '}
                    <PrivacyPolicyModal>
                      <span className="underline cursor-pointer text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300">
                        privacy policy
                      </span>
                    </PrivacyPolicyModal>
                  </Label>
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
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <Label htmlFor="tos" className="text-sm">
                    Accetto i{' '}
                    <TermsOfServiceModal>
                      <span className="underline cursor-pointer text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300">
                        termini e condizioni
                      </span>
                    </TermsOfServiceModal>
                  </Label>
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
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <Label htmlFor="dpa" className="text-sm">
                    Accetto il{' '}
                    <DpaModal>
                      <span className="underline cursor-pointer text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300">
                        Data processing agreement
                      </span>
                    </DpaModal>
                  </Label>
                </div>
                {errors.acceptDpa && (
                  <p className="text-red-500 text-sm mt-1 ml-6">{errors.acceptDpa}</p>
                )}
              </div>
            </div>
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-linear-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-semibold py-6 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registrazione in corso...' : 'Inizia la prova gratuita'}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-3">
                Iniziando la prova gratuita, non ti verrà addebitato nulla per i primi{' '}
                {selectedPlanInfo?.trialDays || 30} giorni
              </p>
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
