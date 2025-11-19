import { getCurrentSchool } from '@/lib/school'
import { notFound } from 'next/navigation'
import WelcomeContent from './WelcomeContent'

export default async function WelcomePage({ params }: { params: Promise<{ school: string }> }) {
  const { school: schoolSlug } = await params

  // Ottieni la scuola corrente
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    notFound()
  }

  return <WelcomeContent schoolId={String(school.id)} />
}
