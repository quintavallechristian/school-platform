'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'

interface ParentAreaButtonProps {
  href: string
  label: string
  className?: string
}

export function ParentAreaButton({ href, label, className }: ParentAreaButtonProps) {
  const handleClick = () => {
    trackEvent('parent_area_click', {
      event_label: label,
      destination: href,
    })
  }

  return (
    <Link href={href} onClick={handleClick}>
      <Button variant="outline" size="sm" className={className}>
        {label}
      </Button>
    </Link>
  )
}
