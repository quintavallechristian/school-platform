'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'

export function ParentsAreaButton({ href, isLoggedIn }: { href: string; isLoggedIn: boolean }) {
  const handleClick = () => {
    trackEvent('parents_area_click', {
      is_logged_in: isLoggedIn,
      destination: href,
    })
  }

  return (
    <Link href={href} onClick={handleClick}>
      <Button variant="outline" size="sm" className="hidden md:flex">
        {isLoggedIn ? 'Area Genitori' : "Accedi all'area genitori"}
      </Button>
    </Link>
  )
}
