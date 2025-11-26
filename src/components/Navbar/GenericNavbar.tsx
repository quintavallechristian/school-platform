'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DicesIcon } from 'lucide-react'
import { GuestNavigationMenu, MobileGuestMenuButton } from './GuestNavigationMenu'
import { NavbarWrapper } from './NavbarWrapper'
import { User } from '@/payload-types'
import { ModeToggle } from './ModeToggle'

export function GenericNavbar({ user }: { user?: User | null }) {
  const pathname = usePathname()

  // Define generic paths that should show this navbar
  // Note: '/' matches exactly, others match start
  const isGenericPage =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/cookie-policy') ||
    pathname.startsWith('/privacy-policy') ||
    pathname.startsWith('/tos') ||
    pathname.startsWith('/comunicazioni')

  // If we are not on a generic page, don't render anything
  // This assumes that any other path is a school path (/[school]/...)
  if (!isGenericPage) {
    return null
  }

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Funzionalità', href: '/#features' },
    { label: 'Prezzi', href: '/#pricing' },
    { label: 'Contatti', href: '/#contact' },
  ]

  return (
    <NavbarWrapper>
      <nav role="navigation" aria-label="Navigazione principale">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <MobileGuestMenuButton menuItems={menuItems} />
            <Link href="/" className="flex items-center gap-2">
              <DicesIcon
                className="h-8 w-8 text-indigo-600 dark:text-indigo-400"
                aria-hidden="true"
              />
              <span className="text-xl font-bold">Scuole Infanzia</span>
            </Link>
          </div>
          <GuestNavigationMenu menuItems={menuItems} />
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/admin">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  Entra come {user.firstName}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="hidden md:flex">
                    Accedi
                  </Button>
                </Link>
                <Link href="/#pricing">
                  <Button variant="default" size="sm" className="hidden md:flex">
                    Provalo per 30 giorni
                  </Button>
                </Link>
              </>
            )}
            <ModeToggle />
          </div>
        </div>
      </nav>
    </NavbarWrapper>
  )
}
