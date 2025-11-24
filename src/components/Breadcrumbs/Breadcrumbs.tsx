'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

// Mappa dei segmenti URL a etichette leggibili
const labelMap: Record<string, string> = {
  'chi-siamo': 'Chi Siamo',
  'blog': 'Blog',
  'eventi': 'Eventi',
  'progetti': 'Progetti',
  'insegnanti': 'Insegnanti',
  'contatti': 'Contatti',
  'documenti': 'Documenti',
  'mensa': 'Mensa',
  'calendario': 'Calendario',
  'piano-offerta-formativa': 'POF',
  'comunicazioni': 'Comunicazioni',
  'parents': 'Area Genitori',
  'dashboard': 'Dashboard',
  'login': 'Accedi',
  'privacy-policy': 'Privacy Policy',
  'cookie-policy': 'Cookie Policy',
  'testimonianze': 'Testimonianze',
}

export function Breadcrumbs() {
  const pathname = usePathname()
  
  // Non mostrare sulla home page o se non c'è pathname
  if (!pathname) return null
  
  const segments = pathname.split('/').filter(Boolean)
  
  // Se siamo sulla home della scuola (es. /nome-scuola), non mostrare breadcrumbs
  if (segments.length <= 1) return null

  const schoolSlug = segments[0]
  
  // Rimuovi lo slug della scuola dai segmenti da visualizzare
  const displaySegments = segments.slice(1)

  return (
    <nav aria-label="Breadcrumb" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <ol className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground">
        <li>
          <Link 
            href={`/${schoolSlug}`}
            className="flex items-center hover:text-primary transition-colors"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        
        {displaySegments.map((segment, index) => {
          // Costruisci il path accumulando i segmenti precedenti
          const href = `/${schoolSlug}/${displaySegments.slice(0, index + 1).join('/')}`
          const isLast = index === displaySegments.length - 1
          
          // Formatta l'etichetta: usa la mappa o capitalizza
          let label = labelMap[segment]
          if (!label) {
            // Se è un ID (spesso lungo e alfanumerico), prova a renderlo più leggibile o accorcialo
            if (segment.length > 20 && /\d/.test(segment)) {
              label = 'Dettaglio'
            } else {
              label = segment.replace(/-/g, ' ')
              label = label.charAt(0).toUpperCase() + label.slice(1)
            }
          }

          return (
            <li key={href} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" aria-hidden="true" />
              {isLast ? (
                <span className="font-medium text-foreground truncate max-w-[200px]" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link 
                  href={href}
                  className="hover:text-primary transition-colors capitalize"
                >
                  {label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
