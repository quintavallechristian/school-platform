import SpotlightCard from '@/components/SpotlightCard/SpotlightCard'
import { getPayload } from 'payload'
import config from '@payload-config'
import { checkParentLimit } from '@/lib/check-parent-limit'
import LoginForm from './LoginForm'

export default async function ParentLoginPage({
  params,
}: {
  params: Promise<{ school: string }>
}) {
  const { school } = await params
  const payload = await getPayload({ config })

  // Get school data to check parent limit
  let canRegister = false
  let limitMessage: string | undefined

  try {
    const schoolQuery = await payload.find({
      collection: 'schools',
      where: {
        slug: {
          equals: school,
        },
      },
    })

    if (schoolQuery.docs.length > 0) {
      const schoolData = schoolQuery.docs[0]
      const limitCheck = await checkParentLimit(schoolData.id, payload)
      canRegister = limitCheck.canAdd
      limitMessage = limitCheck.message
    }
  } catch (error) {
    console.error('Error checking parent limit:', error)
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <SpotlightCard className="w-full max-w-md">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-center">Area Genitori</h2>
          <div className="text-center">
            Inserisci le tue credenziali per accedere
          </div>
        </div>
        <div>
          <LoginForm school={school} />
          {canRegister && (
            <div className="text-center text-sm mt-4">
              <span className="text-muted-foreground">Non hai un account? </span>
              <a
                href={`/${school}/parents/register`}
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
