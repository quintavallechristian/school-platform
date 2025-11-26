import { ModeToggle } from './ModeToggle'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

import { DicesIcon } from 'lucide-react'
import { GuestNavigationMenu, MobileGuestMenuButton } from './GuestNavigationMenu'
import type { School } from '@/payload-types'
import Image from 'next/image'
import { NavbarWrapper } from './NavbarWrapper'
import { isFeatureEnabled } from '@/lib/school'

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

  const menuItems = [...staticMenuItems.map(({ label, href }) => ({ label, href }))]

  return (
    <NavbarWrapper>
      <nav role="navigation" aria-label="Navigazione principale">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <MobileGuestMenuButton menuItems={menuItems} />
            <Link href={baseHref} className="flex items-center gap-2">
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
              <Link href={`${baseHref}/parents/login`}>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  Area Genitori
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
