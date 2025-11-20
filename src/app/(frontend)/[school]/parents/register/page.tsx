'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { registerParent } from './action'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import Link from 'next/link'
import { useEffect } from 'react'
import { UserPlus, User, Mail, Baby, School } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Invio in corso...' : 'Invia Richiesta'}
    </Button>
  )
}

export default function ParentRegisterPage() {
  const params = useParams()
  const router = useRouter()
  const school = params.school as string
  const [state, formAction] = useFormState(registerParent, null)

  // Redirect to pending page on success
  useEffect(() => {
    if (state?.success) {
      router.push(`/${school}/parents/register/pending`)
    }
  }, [state?.success, school, router])

  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-12">
      <SpotlightCard className="w-full max-w-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <UserPlus className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Registrazione Genitore</h1>
            </div>
            <p className="text-muted-foreground">
              Compila il modulo per richiedere l&apos;accesso all&apos;area genitori
            </p>
          </div>

          {/* Form */}
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="school" value={school} />

            {/* Parent Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <User className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Dati Genitore</h2>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="parentFirstName" className="text-sm font-medium">
                    Nome *
                  </label>
                  <Input
                    id="parentFirstName"
                    name="parentFirstName"
                    type="text"
                    placeholder="Mario"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="parentLastName" className="text-sm font-medium">
                    Cognome *
                  </label>
                  <Input
                    id="parentLastName"
                    name="parentLastName"
                    type="text"
                    placeholder="Rossi"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="parentEmail" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email *
                </label>
                <Input
                  id="parentEmail"
                  name="parentEmail"
                  type="email"
                  placeholder="mario.rossi@example.com"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Questa email sarà utilizzata per accedere all&apos;area genitori
                </p>
              </div>
            </div>

            {/* Child Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Baby className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Dati Bambino</h2>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="childFirstName" className="text-sm font-medium">
                    Nome *
                  </label>
                  <Input
                    id="childFirstName"
                    name="childFirstName"
                    type="text"
                    placeholder="Luca"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="childLastName" className="text-sm font-medium">
                    Cognome *
                  </label>
                  <Input
                    id="childLastName"
                    name="childLastName"
                    type="text"
                    placeholder="Rossi"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="childClassroom" className="text-sm font-medium flex items-center gap-2">
                  <School className="h-4 w-4" />
                  Sezione/Classe *
                </label>
                <Input
                  id="childClassroom"
                  name="childClassroom"
                  type="text"
                  placeholder="Es: 1A, Sezione Azzurra"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {state?.error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-4">
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  {state.error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <SubmitButton />

            {/* Login Link */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Hai già un account? </span>
              <Link
                href={`/${school}/parents/login`}
                className="font-medium underline underline-offset-4 hover:text-primary"
              >
                Accedi
              </Link>
            </div>
          </form>
        </div>
      </SpotlightCard>
    </div>
  )
}
