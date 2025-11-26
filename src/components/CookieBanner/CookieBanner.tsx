'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../ui/button'

type CookiePreferences = {
  necessary: boolean
  analytics: boolean
}

const enableGoogleAnalytics = () => {
  // Verifica se GA_MEASUREMENT_ID è presente
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  if (!measurementId) return

  // Carica lo script di Google Analytics
  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    script.async = true
    document.head.appendChild(script)

    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', {
        page_path: window.location.pathname,
      });
    `
    document.head.appendChild(script2)
  }
}

const initializeCookies = (prefs: CookiePreferences) => {
  if (prefs.analytics) {
    // Inizializza Google Analytics se consentito
    enableGoogleAnalytics()
  }
}

export default function CookieBanner() {
  const pathname = usePathname()
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Sempre true, non modificabile
    analytics: false,
  })

  // Controlla se siamo nella pagina cookie-policy
  const isOnCookiePolicyPage = pathname === '/cookie-policy'

  useEffect(() => {
    // Controlla se l'utente ha già dato il consenso
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowBanner(true)
    } else {
      // Carica le preferenze salvate
      try {
        const savedPreferences = JSON.parse(consent)
        setPreferences(savedPreferences)
        // Inizializza i cookie in base alle preferenze salvate
        initializeCookies(savedPreferences)
      } catch (error) {
        console.error('Errore nel parsing delle preferenze cookie:', error)
        setShowBanner(true)
      }
    }
  }, [])

  const handleAcceptAll = () => {
    const newPreferences: CookiePreferences = {
      necessary: true,
      analytics: true,
    }
    savePreferences(newPreferences)
  }

  const handleRejectAll = () => {
    const newPreferences: CookiePreferences = {
      necessary: true,
      analytics: false,
    }
    savePreferences(newPreferences)
  }

  const handleSavePreferences = () => {
    savePreferences(preferences)
  }

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs))
    setPreferences(prefs)
    setShowBanner(false)
    setShowSettings(false)

    // Inizializza i cookie in base alle preferenze
    initializeCookies(prefs)

    // Ricarica la pagina per applicare le modifiche
    window.location.reload()
  }

  if (!showBanner) return null

  // Se il banner è minimizzato, mostra solo il badge
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-neutral-900 rounded-full shadow-2xl border border-neutral-200 dark:border-neutral-700 hover:scale-105 transition-transform duration-200"
          aria-label="Espandi banner cookie"
        >
          <span className="text-2xl">🍪</span>
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Cookie Settings
          </span>
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Overlay - Non mostrare nella pagina cookie-policy */}
      {!isOnCookiePolicyPage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]" />
      )}

      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6">
        <div className="max-w-6xl mx-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          {!showSettings ? (
            // Vista principale del banner
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-6">
                <span className="text-4xl">🍪</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      Rispettiamo la tua privacy
                    </h3>
                    <button
                      onClick={() => setIsMinimized(true)}
                      className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 p-2"
                      aria-label="Minimizza banner"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    Utilizziamo cookie tecnici necessari per il funzionamento del sito e cookie
                    analitici per migliorare la tua esperienza. Puoi scegliere quali accettare.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <Button onClick={handleAcceptAll} variant="default">
                  Accetta tutti
                </Button>
                <Button onClick={handleRejectAll} variant="outline">
                  Solo necessari
                </Button>
                <Button onClick={() => setShowSettings(true)} variant="outline">
                  Personalizza
                </Button>
              </div>

              <div className="mt-4 text-center">
                <Link
                  href="/cookie-policy"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Leggi la Cookie Policy completa
                </Link>
              </div>
            </div>
          ) : (
            // Vista impostazioni dettagliate
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  Preferenze Cookie
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 p-2"
                    aria-label="Minimizza banner"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                    aria-label="Chiudi impostazioni"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {/* Cookie necessari */}
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⚙️</span>
                      <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Cookie Tecnici Necessari
                      </h4>
                    </div>
                    <span className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded-full">
                      Sempre attivi
                    </span>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Questi cookie sono essenziali per il funzionamento del sito web e non possono
                    essere disabilitati. Includono cookie di sessione, autenticazione e sicurezza.
                  </p>
                </div>

                {/* Cookie analitici */}
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📊</span>
                      <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Cookie Analitici
                      </h4>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) =>
                          setPreferences({ ...preferences, analytics: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-neutral-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Ci aiutano a capire come i visitatori interagiscono con il sito raccogliendo e
                    analizzando informazioni in forma anonima (es. Google Analytics).
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Salva preferenze
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-6 py-3 border-2 border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 text-neutral-900 dark:text-neutral-100 font-semibold rounded-lg transition-all duration-200"
                >
                  Annulla
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
