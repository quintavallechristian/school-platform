import { notFound } from 'next/navigation'
import { getCurrentSchool, isFeatureEnabled } from '@/lib/school'
import Navbar from '@/components/Navbar/Navbar'
import Link from 'next/link'
import { CommunicationsPopup } from '@/components/CommunicationsPopup/CommunicationsPopup'
import { getPayload } from 'payload'
import config from '@/payload.config'

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

  // Carica le comunicazioni attive DELLA SCUOLA CORRENTE
  const payload = await getPayload({ config })
  const now = new Date()

  const { docs: communications } = await payload.find({
    collection: 'communications',
    where: {
      and: [
        {
          school: {
            equals: school.id,
          },
        },
        {
          isActive: {
            equals: true,
          },
        },
        {
          or: [
            {
              expiresAt: {
                exists: false,
              },
            },
            {
              expiresAt: {
                greater_than: now.toISOString(),
              },
            },
          ],
        },
      ],
    },
    sort: '-priority,-publishedAt',
    limit: 50,
  })

  return (
    <>
      {/* Skip link per accessibilità */}
      <a href="#main-content" className="skip-link">
        Salta al contenuto principale
      </a>

      {/* Applica i colori personalizzati della scuola */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          :root {
            /* Colori conformi WCAG 2.1 AA (contrasto >= 4.5:1) */
            --color-primary: ${school.lightTheme?.textPrimary || school.primaryColor || '#1e40af'}; /* Blu scuro su bianco: 8.59:1 */
            --color-secondary: ${school.lightTheme?.textSecondary || school.secondaryColor || '#7c3aed'}; /* Viola scuro su bianco: 6.37:1 */
            --color-background-primary: ${school.lightTheme?.backgroundPrimary || school.backgroundPrimaryColor || '#ffffff'}; /* Bianco */
            --color-background-secondary: ${school.lightTheme?.backgroundSecondary || school.backgroundSecondaryColor || '#f3f4f6'}; /* Grigio chiaro */
          }
          
          .dark {
            /* Colori conformi WCAG 2.1 AA per dark mode */
            --color-primary: ${school.darkTheme?.textPrimary || school.lightTheme?.textPrimary || school.primaryColor || '#93c5fd'}; /* Blu chiaro su nero: 9.35:1 */
            --color-secondary: ${school.darkTheme?.textSecondary || school.lightTheme?.textSecondary || school.secondaryColor || '#c4b5fd'}; /* Viola chiaro su nero: 10.73:1 */
            --color-background-primary: ${school.darkTheme?.backgroundPrimary || school.lightTheme?.backgroundPrimary || school.backgroundPrimaryColor || '#1f2937'}; /* Grigio scuro */
            --color-background-secondary: ${school.darkTheme?.backgroundSecondary || school.lightTheme?.backgroundSecondary || school.backgroundSecondaryColor || '#111827'}; /* Grigio molto scuro */
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

      {/* Contenuto della pagina con landmark main */}
      <main id="main-content" role="main" className="min-h-screen">
        {children}
      </main>

      {/* Footer con info della scuola */}
      <footer role="contentinfo" className="bg-gray-100 dark:bg-gray-900 border-t">
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
                  <Link href={`/cookie-policy`} className="hover:text-primary">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Popup comunicazioni della scuola */}
      <CommunicationsPopup communications={communications} schoolSlug={schoolSlug} />
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
