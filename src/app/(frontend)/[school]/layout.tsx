import { notFound } from 'next/navigation'
import { getCurrentSchool, isFeatureEnabled } from '@/lib/school'
import Navbar from '@/components/Navbar/Navbar'
import Link from 'next/link'

export default async function SchoolLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ school: string }>
}) {
  // Await params before accessing its properties
  const { school: schoolSlug } = await params

  // Ottieni la scuola corrente
  const school = await getCurrentSchool(schoolSlug)

  // Se la scuola non esiste o non è attiva, mostra 404
  if (!school) {
    notFound()
  }

  return (
    <>
      {/* Applica i colori personalizzati della scuola */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          :root {
            --color-primary: ${school.primaryColor || '#3b82f6'};
            --color-secondary: ${school.secondaryColor || '#8b5cf6'};
            --color-background-primary: ${school.backgroundPrimaryColor || '#fa8899'};
            --color-background-secondary: ${school.backgroundSecondaryColor || '#228899'};
          }
          
          /* Override colori Tailwind */
          .bg-primary { background-color: var(--color-primary) !important; }
          .text-primary { color: var(--color-primary) !important; }
          .border-primary { border-color: var(--color-primary) !important; }
          
          .bg-secondary { background-color: var(--color-secondary) !important; }
          .text-secondary { color: var(--color-secondary) !important; }
          .border-secondary { border-color: var(--color-secondary) !important; }
        `,
        }}
      />

      {/* Navbar con branding della scuola */}
      <Navbar
        schoolName={school.name}
        schoolLogo={
          school.logo && typeof school.logo === 'object' ? school.logo.url || undefined : undefined
        }
        baseHref={`/${schoolSlug}`}
        schoolId={school.id}
        school={school}
      />

      {/* Contenuto della pagina */}
      <main className="min-h-screen">{children}</main>

      {/* Footer con info della scuola */}
      <footer className="bg-gray-100 dark:bg-gray-900 border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Info scuola */}
            <div>
              <h3 className="font-bold text-lg mb-4">{school.name}</h3>
              {school.contactInfo?.address && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  📍 {school.contactInfo.address}
                </p>
              )}
              {school.contactInfo?.email && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  ✉️ {school.contactInfo.email}
                </p>
              )}
              {school.contactInfo?.phone && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  📞 {school.contactInfo.phone}
                </p>
              )}
            </div>

            {/* Link rapidi */}
            <div>
              <h3 className="font-bold text-lg mb-4">Link Rapidi</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <Link href={`/${schoolSlug}`} className="hover:text-primary">
                    Home
                  </Link>
                </li>
                {isFeatureEnabled(school, 'blog') && (
                  <li>
                    <Link href={`/${schoolSlug}/blog`} className="hover:text-primary">
                      Blog
                    </Link>
                  </li>
                )}
                {isFeatureEnabled(school, 'events') && (
                  <li>
                    <Link href={`/${schoolSlug}/eventi`} className="hover:text-primary">
                      Eventi
                    </Link>
                  </li>
                )}
                {isFeatureEnabled(school, 'calendar') && (
                  <li>
                    <Link href={`/${schoolSlug}/calendario`} className="hover:text-primary">
                      Calendario
                    </Link>
                  </li>
                )}
                {isFeatureEnabled(school, 'communications') && (
                  <li>
                    <Link href={`/${schoolSlug}/comunicazioni`} className="hover:text-primary">
                      Comunicazioni
                    </Link>
                  </li>
                )}
                {isFeatureEnabled(school, 'menu') && (
                  <li>
                    <Link href={`/${schoolSlug}/mensa`} className="hover:text-primary">
                      Menù Mensa
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} {school.name}
                <br />
                Tutti i diritti riservati
              </p>
              <ul className="space-y-2 mt-4 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <Link href={`/${schoolSlug}/privacy-policy`} className="hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href={`/${schoolSlug}/cookie-policy`} className="hover:text-primary">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

/**
 * Genera metadata dinamici per ogni scuola
 */
export async function generateMetadata({ params }: { params: Promise<{ school: string }> }) {
  const { school: schoolSlug } = await params
  const school = await getCurrentSchool(schoolSlug)

  if (!school) {
    return {
      title: 'Scuola non trovata',
    }
  }

  return {
    title: school.name,
    description: `Sito ufficiale di ${school.name}`,
    openGraph: {
      title: school.name,
      description: `Sito ufficiale di ${school.name}`,
      images: school.logo && typeof school.logo === 'object' ? [school.logo.url || ''] : [],
    },
  }
}
