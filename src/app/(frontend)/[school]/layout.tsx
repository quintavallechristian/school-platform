import { notFound } from 'next/navigation'
import { getCurrentSchool, isFeatureEnabled } from '@/lib/school'
import { getSchoolBaseHref } from '@/lib/linkUtils'
import { headers } from 'next/headers'
import Navbar from '@/components/Navbar/Navbar'
import Link from 'next/link'
import { CommunicationsPopup } from '@/components/CommunicationsPopup/CommunicationsPopup'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { SchoolAdminTrialGuard } from '@/components/TrialGuard/SchoolAdminTrialGuard'
import { SkipLink } from '@/components/SkipLink/SkipLink'

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

  const headersList = await headers()
  const host = headersList.get('host') || ''
  const baseHref = getSchoolBaseHref(school, host)

  return (
    <SchoolAdminTrialGuard schoolSlug={schoolSlug}>
      {/* Skip link per accessibilità */}
      <SkipLink />

      {/* Applica i colori personalizzati della scuola */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          :root {
            /* Colori conformi WCAG 2.1 AA (contrasto >= 4.5:1) */
            --color-primary: ${school.lightTheme?.textPrimary || school.primaryColor || '#ea580c'}; /* Arancione vibrante */
            --color-secondary: ${school.lightTheme?.textSecondary || school.secondaryColor || '#f59e0b'}; /* Giallo ambrato */
            --color-background-primary: ${school.lightTheme?.backgroundPrimary || school.backgroundPrimaryColor || '#ffffff'}; /* Bianco */
            --color-background-secondary: ${school.lightTheme?.backgroundSecondary || school.backgroundSecondaryColor || '#f3f4f6'}; /* Grigio chiaro */
          }
          
          .dark {
            /* Colori conformi WCAG 2.1 AA per dark mode */
            --color-primary: ${school.darkTheme?.textPrimary || school.lightTheme?.textPrimary || school.primaryColor || '#fb923c'}; /* Arancione chiaro */
            --color-secondary: ${school.darkTheme?.textSecondary || school.lightTheme?.textSecondary || school.secondaryColor || '#fbbf24'}; /* Giallo dorato */
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
          
          /* Utility classes per gradienti personalizzati */
          .from-primary { --tw-gradient-from: var(--color-primary) var(--tw-gradient-from-position); --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
          .to-secondary { --tw-gradient-to: var(--color-secondary) var(--tw-gradient-to-position); }
          .via-secondary { --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position); --tw-gradient-stops: var(--tw-gradient-from), var(--color-secondary) var(--tw-gradient-via-position), var(--tw-gradient-to); }
          
          /* Background gradienti personalizzati */
          .bg-gradient-primary {
            background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
          }
          .bg-gradient-primary-br {
            background: linear-gradient(to bottom right, var(--color-background-primary), var(--color-background-secondary));
          }
        `,
        }}
      />

      {/* Navbar con branding della scuola */}
      <Navbar
        schoolName={school.name}
        schoolLogo={
          school.logo && typeof school.logo === 'object' ? school.logo.url || undefined : undefined
        }
        baseHref={baseHref}
        schoolId={school.id}
        school={school}
      />

      {/* Contenuto della pagina con landmark main */}
      <main id="main-content" role="main" tabIndex={-1} className="min-h-screen">
        {children}
      </main>

      {/* Footer con info della scuola */}
      <footer role="contentinfo" className="bg-(--color-background-primary) border-t">
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
                  <Link
                    href={baseHref || '/'}
                    className="hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:rounded"
                  >
                    Home
                  </Link>
                </li>
                {isFeatureEnabled(school, 'blog') && (
                  <li>
                    <Link
                      href={`${baseHref}/blog`}
                      className="hover:text-primary focus-visible:text-primary focus-visible:underline"
                    >
                      Blog
                    </Link>
                  </li>
                )}
                {isFeatureEnabled(school, 'events') && (
                  <li>
                    <Link
                      href={`${baseHref}/eventi`}
                      className="hover:text-primary focus-visible:text-primary focus-visible:underline"
                    >
                      Eventi
                    </Link>
                  </li>
                )}
                {isFeatureEnabled(school, 'calendar') && (
                  <li>
                    <Link
                      href={`${baseHref}/calendario`}
                      className="hover:text-primary focus-visible:text-primary focus-visible:underline"
                    >
                      Calendario
                    </Link>
                  </li>
                )}
                {isFeatureEnabled(school, 'communications') && (
                  <li>
                    <Link
                      href={`${baseHref}/comunicazioni`}
                      className="hover:text-primary focus-visible:text-primary focus-visible:underline"
                    >
                      Comunicazioni
                    </Link>
                  </li>
                )}
                {isFeatureEnabled(school, 'menu') && (
                  <li>
                    <Link
                      href={`${baseHref}/mensa`}
                      className="hover:text-primary focus-visible:text-primary focus-visible:underline"
                    >
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
                  <Link
                    href={`${baseHref}/privacy-policy`}
                    className="hover:text-primary focus-visible:text-primary focus-visible:underline"
                  >
                    Privacy Policy scuola
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tos"
                    className="hover:text-primary focus-visible:text-primary focus-visible:underline"
                  >
                    Termini di Servizio
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/privacy-policy`}
                    className="hover:text-primary focus-visible:text-primary focus-visible:underline"
                  >
                    Privacy Policy scuoleinfanzia.eu
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/cookie-policy`}
                    className="hover:text-primary focus-visible:text-primary focus-visible:underline"
                  >
                    Cookie Policy scuoleinfanzia.eu
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Popup comunicazioni della scuola */}
      <CommunicationsPopup communications={communications} schoolSlug={schoolSlug} />
    </SchoolAdminTrialGuard>
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
    icons:
      school.logo && typeof school.logo === 'object' && school.logo.url
        ? [{ rel: 'icon', url: school.logo.url }]
        : [],
    openGraph: {
      title: school.name,
      description: `Sito ufficiale di ${school.name}`,
      url: `https://${school.slug}.scuoleinfanzia.eu`, // Assuming subdomain or similar structure, adjust if needed based on baseHref logic
      siteName: school.name,
      locale: 'it_IT',
      type: 'website',
      images: school.logo && typeof school.logo === 'object' ? [school.logo.url || ''] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: school.name,
      description: `Sito ufficiale di ${school.name}`,
      images: school.logo && typeof school.logo === 'object' ? [school.logo.url || ''] : [],
    },
    alternates: {
      canonical: `/${school.slug}`,
    },
  }
}
