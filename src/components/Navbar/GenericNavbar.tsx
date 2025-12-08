'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GuestNavigationMenu, MobileGuestMenuButton } from './GuestNavigationMenu'
import { NavbarWrapper } from './NavbarWrapper'
import { User } from '@/payload-types'
import { ModeToggle } from './ModeToggle'
import { Logo } from '@/components/Logo'

export function GenericNavbar({ user }: { user?: User | null }) {
  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Funzionalità', href: '/#features' },
    { label: 'Prezzi', href: '/#pricing' },
    { label: 'Contatti', href: '/contatti' },
    { label: 'FAQ', href: '/faq' },
  ]

  return (
    <NavbarWrapper>
      <nav role="navigation" aria-label="Navigazione principale">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <MobileGuestMenuButton menuItems={menuItems}>
              <div className="flex flex-col gap-3">
                {user ? (
                  <Link href="/admin">
                    <Button variant="outline" className="w-full justify-start">
                      Entra come {user.firstName}
                    </Button>
                  </Link>
                ) : (
                  <div className="p-4 flex flex-col gap-2">
                    <Link href="/admin">
                      <Button variant="outline" className="w-full justify-start">
                        Accedi
                      </Button>
                    </Link>
                    <Link href="/#pricing">
                      <Button variant="default" className="w-full justify-start">
                        Provalo per 30 giorni
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </MobileGuestMenuButton>
            <Link href="/" className="flex">
              <Logo
                className="text-orange-600 dark:text-amber-500 shrink-0 mt-[-8px] font-normal"
                width={40}
                height={40}
              />
              <span
                className="text-3xl font-bold text-gray-900 dark:text-white opacity-0 -ml-7 whitespace-nowrap hidden sm:inline-block"
                style={{ fontFamily: 'var(--font-scuole)' }}
              >
                s
              </span>
              <span
                className="text-3xl font-bold text-gray-900 dark:text-white whitespace-nowrap hidden sm:inline-block"
                style={{ fontFamily: 'var(--font-scuole)' }}
              >
                cuole Infanzia
              </span>
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
