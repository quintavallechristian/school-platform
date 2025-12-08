'use client'

import { usePathname } from 'next/navigation'
import { GenericNavbar } from './GenericNavbar'

import { User } from '@/payload-types'

interface ConditionalGenericNavbarProps {
  user: User | null
  pathname?: string
}

export function ConditionalGenericNavbar({
  user,
  pathname: serverPathname,
}: ConditionalGenericNavbarProps) {
  const clientPathname = usePathname()
  const pathname = serverPathname || clientPathname

  // Lista delle pagine generiche che dovrebbero mostrare GenericNavbar
  const genericRoutes = [
    '/',
    '/privacy-policy',
    '/cookie-policy',
    '/tos',
    '/pricing',
    '/register',
    '/login',
    '/contatti',
    '/faq',
    '/comunicazioni',
  ]

  // Verifica se siamo in una route generica
  // Le route di scuola dopo il rewrite del middleware sono nella forma: /[schoolSlug]/...
  // Quindi se il pathname inizia con uno slug (es. /demo/, /bruno-pizzolato/), NON è una route generica

  const isGenericRoute = genericRoutes.some((route) => {
    if (route === '/') {
      return pathname === '/' // Homepage esatta
    }
    return pathname.startsWith(route)
  })

  // Se non è una route generica, non mostrare GenericNavbar
  if (!isGenericRoute) {
    return null
  }

  return <GenericNavbar user={user} />
}
