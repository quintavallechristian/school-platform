'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

export function ParentLoginTracker() {
  useEffect(() => {
    // Track successful parent login (solo alla prima visita dopo login)
    const hasTracked = sessionStorage.getItem('parent_login_tracked')

    if (!hasTracked) {
      trackEvent('parent_login', {
        event_category: 'authentication',
        login_type: 'parent',
      })
      sessionStorage.setItem('parent_login_tracked', 'true')
    }
  }, [])

  return null
}
