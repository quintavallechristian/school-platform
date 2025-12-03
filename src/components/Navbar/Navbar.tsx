import { ModeToggle } from './ModeToggle'
import config from '@payload-config'
import { cookies } from 'next/headers'

import Link from 'next/link'

import { GuestNavigationMenu, MobileGuestMenuButton } from './GuestNavigationMenu'
import type { School } from '@/payload-types'
import Image from 'next/image'
import { NavbarWrapper } from './NavbarWrapper'
import { isFeatureEnabled } from '@/lib/school'
import { getPayload } from 'payload'
import { Logo } from '../Logo'
import { ParentsAreaButton } from './ParentsAreaButton'

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

  type FeatureKey =
    | 'blog'
    | 'events'
    | 'projects'
    | 'educationalOfferings'
    | 'communications'
    | 'calendar'
    | 'menu'
    | 'documents'
    | 'chiSiamo'
    | 'parentsArea'

  // Feature to label mapping
  const featureToLabel: Record<string, string> = {
    chiSiamo: 'Chi Siamo',
    blog: 'Blog',
    events: 'Eventi',
    projects: 'Progetti',
    educationalOfferings: 'Piano Offerta Formativa',
    calendar: 'Calendario',
    communications: 'Comunicazioni',
    menu: 'Mensa',
    documents: 'Documenti',
  }

  // Feature to href mapping
  const featureToHref: Record<string, string> = {
    chiSiamo: `${baseHref}/chi-siamo`,
    blog: `${baseHref}/blog`,
    events: `${baseHref}/eventi`,
    projects: `${baseHref}/progetti`,
    educationalOfferings: `${baseHref}/piano-offerta-formativa`,
    calendar: `${baseHref}/calendario`,
    communications: `${baseHref}/comunicazioni`,
    menu: `${baseHref}/mensa`,
    documents: `${baseHref}/documenti`,
  }

  let menuItems: Array<{
    label: string
    href?: string
    items?: Array<{ label: string; href: string; description?: string }>
  }> = []

  if (school?.navbarStructure && school.navbarStructure.length > 0) {
    console.log('🔍 DEBUG: navbarStructure found, sections:', school.navbarStructure.length)

    // Usa la struttura custom della navbar
    for (const section of school.navbarStructure) {
      console.log('🔍 DEBUG: Processing section:', section.label, 'items:', section.items?.length)

      if (!section.items || section.items.length === 0) {
        console.log('⚠️ DEBUG: Section skipped - no items')
        continue
      }

      // Mappa gli items filtrando quelli disabilitati
      const sectionItems = section.items
        .map((item) => {
          let href = ''
          let label = ''

          if (item.feature) {
            const isEnabled = isFeatureEnabled(school, item.feature as FeatureKey)
            console.log('🔍 DEBUG: Feature', item.feature, 'enabled:', isEnabled)

            if (!isEnabled) return null
            href = featureToHref[item.feature] || ''
            label = featureToLabel[item.feature] || item.feature
          } else if (item.customPage && typeof item.customPage === 'object') {
            href = `${baseHref}/pagine/${item.customPage.slug}`
            label = item.customPage.title || 'Pagina'
            console.log('🔍 DEBUG: Custom page:', label, href)
          }

          if (!href || !label) {
            console.log('⚠️ DEBUG: Item skipped - missing href/label')
            return null
          }

          return {
            label,
            href,
            description: item.description,
          }
        })
        .filter(Boolean) as Array<{ label: string; href: string; description?: string }>

      console.log('🔍 DEBUG: Section', section.label, 'final items:', sectionItems.length)

      if (sectionItems.length > 0) {
        // Tutte le sezioni sono dropdown per consistenza
        menuItems.push({
          label: section.label,
          items: sectionItems,
        })
      } else {
        console.log('⚠️ DEBUG: Section not added - no valid items')
      }
    }

    console.log('🔍 DEBUG: Final menuItems:', menuItems.length)
  } else {
    // Fallback alla logica attuale (lista piatta)
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
      return isFeatureEnabled(school, item.feature as FeatureKey)
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

    menuItems = [
      ...staticMenuItems.map(({ label, href }) => ({ label, href })),
      ...customPages.map(({ label, href }) => ({ label, href })),
    ]
  }

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
                <Logo className="shrink-0 mt-[-8px] font-normal" width={40} height={40} />
              )}
              <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-scuole)' }}>
                {schoolName || 'Scuole Infanzia'}
              </span>
            </Link>
          </div>
          <GuestNavigationMenu menuItems={menuItems} />
          <div className="flex items-center gap-4">
            {school && isFeatureEnabled(school, 'parentsArea') && (
              <ParentsAreaButton
                href={user ? `${baseHref}/parents/dashboard` : `${baseHref}/parents/login`}
                isLoggedIn={!!user}
              />
            )}
            <ModeToggle />
          </div>
        </div>
      </nav>
    </NavbarWrapper>
  )
}
