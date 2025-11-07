import { ModeToggle } from './ModeToggle'

import Link from 'next/link'

import { DicesIcon } from 'lucide-react'
import { GuestNavigationMenu, MobileGuestMenuButton } from './GuestNavigationMenu'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Page } from '@/payload-types'

export default async function Navbar() {
  // Carica le pagine che devono apparire nella navbar
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const pagesData = await payload.find({
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
    { label: 'Blog', href: '/blog' },
    { label: 'Eventi', href: '/eventi' },
    { label: 'Calendario', href: '/calendario' },
    { label: 'Comunicazioni', href: '/comunicazioni' },
    { label: 'Mensa', href: '/mensa' },
    // Aggiungi le pagine dal CMS
    ...navbarPages.map((page) => ({
      label: page.title,
      href: `/pagine/${page.slug}`,
    })),
  ]

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <MobileGuestMenuButton menuItems={menuItems} />
        <Link href="/" className="flex items-center gap-2">
          <DicesIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xl font-bold">BrunoPizzolato</span>
        </Link>
      </div>
      <GuestNavigationMenu menuItems={menuItems} />
      <div className="flex items-center gap-4">
        <ModeToggle />
      </div>
    </div>
  )
}
