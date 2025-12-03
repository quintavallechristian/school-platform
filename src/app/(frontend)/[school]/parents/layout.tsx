import { getCurrentSchool, isFeatureEnabled } from '@/lib/school'
import { redirect } from 'next/navigation'
import { ParentsTermsGuard } from '@/components/ParentsTermsGuard'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function ParentsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ school: string }>
}) {
  const { school: schoolSlug } = await params

  // Get the current school
  const school = await getCurrentSchool(schoolSlug)

  // If school doesn't exist, redirect to home
  if (!school) {
    redirect('/')
  }

  // Check if parents area feature is enabled
  if (!isFeatureEnabled(school, 'parentsArea')) {
    redirect(`/${schoolSlug}`)
  }

  // Get user from payload-token cookie (only for authenticated pages)
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  let user = null

  if (token) {
    const payload = await getPayload({ config })
    try {
      const result = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) })
      user = result.user
    } catch (error) {
      console.error('Auth error in parents layout:', error)
    }
  }

  return (
    <ParentsTermsGuard initialUser={user} schoolSlug={schoolSlug}>
      {children}
    </ParentsTermsGuard>
  )
}
