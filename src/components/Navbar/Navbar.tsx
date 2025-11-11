import { ModeToggle } from './ModeToggle'

import Link from 'next/link'

import { DicesIcon } from 'lucide-react'
import { GuestNavigationMenu, MobileGuestMenuButton } from './GuestNavigationMenu'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Page } from '@/payload-types'
import Image from 'next/image'
import { NavbarWrapper } from './NavbarWrapper'

export default async function Navbar({
  schoolName,
  schoolLogo,
  baseHref = '/',
  schoolId,
}: {
  schoolName?: string
  schoolLogo?: string
  baseHref?: string
  schoolId?: string | number
}) {
  // Carica le pagine che devono apparire nella navbar
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const pagesData = schoolId
    ? await payload.find({
        collection: 'pages',
        where: {
          and: [{ showInNavbar: { equals: true } }, { school: { equals: schoolId } }],
        },
        sort: 'navbarOrder',
        limit: 20,
      })
    : await payload.find({
        collection: 'pages',
        where: {
          showInNavbar: {
            equals: true,
          },
        },
        sort: 'navbarOrder',
        limit: 20,
      })

  const navbarPages = pagesData.docs as Page[]

  // Menu items statici + pagine dinamiche
  const menuItems = [
    { label: 'Blog', href: `${baseHref}/blog` },
    { label: 'Eventi', href: `${baseHref}/eventi` },
    { label: 'Progetti', href: `${baseHref}/progetti` },
    { label: 'Calendario', href: `${baseHref}/calendario` },
    { label: 'Comunicazioni', href: `${baseHref}/comunicazioni` },
    { label: 'Mensa', href: `${baseHref}/mensa` },
    // Aggiungi le pagine dal CMS
    ...navbarPages.map((page) => ({
      label: page.title,
      href: `${baseHref}/pagine/${page.slug}`,
    })),
  ]

  return (
    <NavbarWrapper>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <MobileGuestMenuButton menuItems={menuItems} />
          <Link href={baseHref} className="flex items-center gap-2">
            {schoolLogo ? (
              <div className="relative h-8 w-8">
                <Image
                  src={schoolLogo}
                  alt={schoolName || 'Logo'}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <DicesIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            )}
            <span className="text-xl font-bold">{schoolName || 'BrunoPizzolato'}</span>
          </Link>
        </div>
        <GuestNavigationMenu menuItems={menuItems} />
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>
    </NavbarWrapper>
  )
}
