import { ModeToggle } from './ModeToggle'
import config from '@payload-config'
import { cookies } from 'next/headers'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

import { DicesIcon } from 'lucide-react'
import { GuestNavigationMenu, MobileGuestMenuButton } from './GuestNavigationMenu'
import type { School } from '@/payload-types'
import Image from 'next/image'
import { NavbarWrapper } from './NavbarWrapper'
import { isFeatureEnabled } from '@/lib/school'
import { getPayload } from 'payload'

export default async function Navbar({
  schoolName,
  schoolLogo,
  baseHref = '/',
  school,
}: {
  schoolName?: string
  schoolLogo?: string
  baseHref?: string
  schoolId?: string | number
  school?: School
}) {
  const payload = await getPayload({ config })
  // Menu items statici - filtrati in base alle impostazioni della scuola
  const staticMenuItems = [
    { label: 'Chi Siamo', href: `${baseHref}/chi-siamo`, feature: 'chiSiamo' as const },
    { label: 'Blog', href: `${baseHref}/blog`, feature: 'blog' as const },
    { label: 'Eventi', href: `${baseHref}/eventi`, feature: 'events' as const },
    { label: 'Progetti', href: `${baseHref}/progetti`, feature: 'projects' as const },
    {
      label: 'Piano Offerta Formativa',
      href: `${baseHref}/piano-offerta-formativa`,
      feature: 'educationalOfferings' as const,
    },
    { label: 'Calendario', href: `${baseHref}/calendario`, feature: 'calendar' as const },
    {
      label: 'Comunicazioni',
      href: `${baseHref}/comunicazioni`,
      feature: 'communications' as const,
    },
    { label: 'Mensa', href: `${baseHref}/mensa`, feature: 'menu' as const },
    { label: 'Documenti', href: `${baseHref}/documenti`, feature: 'documents' as const },
  ].filter((item) => {
    // "Chi Siamo" è sempre visibile
    if (item.feature === null) return true
    // Se non abbiamo l'oggetto school, mostriamo tutti i link (retrocompatibilità)
    if (!school) return true
    return isFeatureEnabled(school, item.feature)
  })

  // Recupera le pagine custom con showInNavbar = true per questa scuola
  let customPages: Array<{ label: string; href: string; order: number }> = []
  if (school) {
    try {
      const pagesResult = await payload.find({
        collection: 'pages',
        where: {
          and: [{ school: { equals: school.id } }, { showInNavbar: { equals: true } }],
        },
        limit: 100,
      })

      customPages = pagesResult.docs
        .map((page) => ({
          label: page.title,
          href: `${baseHref}/pagine/${page.slug}`,
          order: page.navbarOrder ?? 999, // Le pagine senza ordine vanno in fondo
        }))
        .sort((a, b) => a.order - b.order)
    } catch (error) {
      console.error('Errore nel caricamento delle pagine custom per la navbar:', error)
    }
  }

  const menuItems = [
    ...staticMenuItems.map(({ label, href }) => ({ label, href })),
    ...customPages.map(({ label, href }) => ({ label, href })),
  ]

  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  let user = null

  if (token) {
    try {
      const result = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) })
      user = result.user
    } catch (_error) {
      // ignore
    }
  }

  return (
    <NavbarWrapper>
      <nav role="navigation" aria-label="Navigazione principale">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <MobileGuestMenuButton menuItems={menuItems} />
            <Link href={baseHref || '/'} className="flex items-center gap-2">
              {schoolLogo ? (
                <div className="relative h-8 w-8">
                  <Image
                    src={schoolLogo}
                    alt={`Logo ${schoolName || 'della scuola'}`}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <DicesIcon
                  className="h-8 w-8 text-indigo-600 dark:text-indigo-400"
                  aria-hidden="true"
                />
              )}
              <span className="text-xl font-bold">{schoolName || 'Scuole Infanzia'}</span>
            </Link>
          </div>
          <GuestNavigationMenu menuItems={menuItems} />
          <div className="flex items-center gap-4">
            {school && isFeatureEnabled(school, 'parentsArea') && (
              <Link href={user ? `${baseHref}/parents/dashboard` : `${baseHref}/parents/login`}>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  {user ? 'Area Genitori' : "Accedi all'area genitori"}
                </Button>
              </Link>
            )}
            <ModeToggle />
          </div>
        </div>
      </nav>
    </NavbarWrapper>
  )
}
