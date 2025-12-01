import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { getPayload } from 'payload'
import config from '@payload-config'
import { checkParentLimit } from '@/lib/check-parent-limit'
import LoginForm from './LoginForm'
import { getCurrentSchool } from '@/lib/school'
import { getSchoolBaseHref } from '@/lib/linkUtils'
import { headers } from 'next/headers'

export default async function ParentLoginPage({ params }: { params: Promise<{ school: string }> }) {
  const { school: schoolSlug } = await params
  const payload = await getPayload({ config })

  // Get school data to check parent limit and baseHref
  const school = await getCurrentSchool(schoolSlug)
  let canRegister = false
  let baseHref = `/${schoolSlug}`

  if (school) {
    const headersList = await headers()
    const host = headersList.get('host') || ''
    baseHref = getSchoolBaseHref(school, host)

    try {
      const limitCheck = await checkParentLimit(school.id, payload)
      canRegister = limitCheck.canAdd
    } catch (error) {
      console.error('Error checking parent limit:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <SpotlightCard className="w-full max-w-md">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-center">Area Genitori</h2>
          <div className="text-center">Inserisci le tue credenziali per accedere</div>
        </div>
        <div>
          <LoginForm school={schoolSlug} />
          {canRegister && (
            <div className="text-center text-sm mt-4">
              <span className="text-muted-foreground">Non hai un account? </span>
              <a
                href={`${baseHref}/parents/register`}
                className="font-medium underline underline-offset-4 hover:text-primary"
              >
                Registrati
              </a>
            </div>
          )}
        </div>
      </SpotlightCard>
    </div>
  )
}
