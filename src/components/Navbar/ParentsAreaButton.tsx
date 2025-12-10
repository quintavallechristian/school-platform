'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'
import { User } from '@/payload-types'
import { cn } from '@/lib/utils'

export function ParentsAreaButton({
  href,
  user,
  className,
}: {
  href: string
  user: User | null
  className?: string
}) {
  const handleClick = () => {
    trackEvent('parents_area_click', {
      is_logged_in: !!user,
      destination: href,
    })
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {!!user ? (
        <Button
          variant="ghost"
          size="sm"
          className={cn('text-primary text-md', !className && 'hidden md:flex')}
        >
          {user.firstName} {user.lastName}
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className={cn('w-full', !className && 'hidden md:flex')}
        >
          Accedi all&apos;area genitori
        </Button>
      )}
    </Link>
  )
}
