'use client'

import { useState, useEffect } from 'react'

export type CookiePreferences = {
  necessary: boolean
  analytics: boolean
}

export function useCookieConsent() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null)
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (consent) {
      try {
        const prefs = JSON.parse(consent)
        setPreferences(prefs)
        setHasConsent(true)
      } catch {
        setHasConsent(false)
      }
    } else {
      setHasConsent(false)
    }
  }, [])

  const updatePreferences = (newPrefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(newPrefs))
    setPreferences(newPrefs)
    setHasConsent(true)
  }

  const revokeConsent = () => {
    localStorage.removeItem('cookie-consent')
    setPreferences(null)
    setHasConsent(false)
  }

  return {
    hasConsent,
    preferences,
    updatePreferences,
    revokeConsent,
  }
}
