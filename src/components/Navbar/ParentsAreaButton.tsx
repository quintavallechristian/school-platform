'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'

import { cn } from '@/lib/utils'

export function ParentsAreaButton({
  href,
  isLoggedIn,
  className,
}: {
  href: string
  isLoggedIn: boolean
  className?: string
}) {
  const handleClick = () => {
    trackEvent('parents_area_click', {
      is_logged_in: isLoggedIn,
      destination: href,
    })
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      <Button variant="outline" size="sm" className={cn('w-full', !className && 'hidden md:flex')}>
        {isLoggedIn ? 'Area Genitori' : "Accedi all'area genitori"}
      </Button>
    </Link>
  )
}
