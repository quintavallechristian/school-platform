import { getCurrentSchool, isFeatureEnabled } from '@/lib/school'
import { redirect } from 'next/navigation'

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

  return <>{children}</>
}
