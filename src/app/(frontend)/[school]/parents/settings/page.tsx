import config from '@payload-config'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Hero from '@/components/Hero/Hero'
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChangePasswordForm } from '@/components/Auth/ChangePasswordForm'
import { getPayload } from 'payload'
import { ChevronLeft, Lock, User } from 'lucide-react'

export default async function ParentsSettingsPage({
  params,
}: {
  params: Promise<{ school: string }>
}) {
  const { school } = await params
  const payload = await getPayload({ config })

  // Get user from payload-token cookie
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    redirect(`/${school}/parents/login`)
  }

  // Verify token and get user
  let user
  try {
    const result = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) })
    user = result.user
  } catch (error) {
    console.error('Auth error:', error)
    redirect(`/${school}/parents/login`)
  }

  // Solo genitori possono accedere
  if (!user || user.role !== 'parent') {
    redirect(`/${school}/parents/login`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Hero
        title="Impostazioni"
        subtitle="Gestisci le tue preferenze e la sicurezza del tuo account"
        gradientOverlay={true}
        bottomDivider={{
          style: 'waves',
          height: 60,
          flip: true,
        }}
      >
        <Link href={`/${school}/parents/dashboard`}>
          <Button variant="outline" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Torna alla Dashboard
          </Button>
        </Link>
      </Hero>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Account Info Card */}
          <SpotlightCard className="bg-card/50 backdrop-blur-sm border-muted/50">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Informazioni Account</h2>
                <p className="text-muted-foreground">Dettagli del tuo account genitore</p>
              </div>
            </div>

            <div className="space-y-4 bg-muted/20 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nome</p>
                  <p className="font-medium">{user.firstName || 'Non specificato'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Cognome</p>
                  <p className="font-medium">{user.lastName || 'Non specificato'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* Change Password Card */}
          <SpotlightCard className="bg-card/50 backdrop-blur-sm border-muted/50">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Sicurezza</h2>
                <p className="text-muted-foreground">Modifica la password del tuo account</p>
              </div>
            </div>

            <div className="bg-muted/20 p-6 rounded-lg">
              <ChangePasswordForm />
            </div>
          </SpotlightCard>

          {/* Help Section */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">
              💡 Suggerimenti per la sicurezza
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li>• Usa una password di almeno 8 caratteri</li>
              <li>• Combina lettere maiuscole, minuscole, numeri e simboli</li>
              <li>• Non condividere mai la tua password con altri</li>
              <li>• Cambia regolarmente la password per maggiore sicurezza</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
