import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware per gestire il routing multi-tenant
 *
 * Supporta due modalità:
 * 1. Sottodominio: scuola.dominio.it → /scuola
 * 2. Path-based: dominio.it/scuola (già gestito da Next.js)
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // Ignora richieste all'admin panel, API e assets
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/media') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Gestione sottodomini (solo in produzione o con domini configurati)
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1')
  const isVercel = hostname.includes('vercel.app')

  if (!isLocalhost && !isVercel) {
    // Estrai sottodominio
    const parts = hostname.split('.')

    // Se abbiamo almeno 3 parti (sottodominio.dominio.tld)
    if (parts.length >= 3) {
      const subdomain = parts[0]

      // Ignora www e altri sottodomini di sistema
      if (subdomain === 'www' || subdomain === 'admin') {
        return NextResponse.next()
      }

      // Rewrite alla rotta della scuola
      // Esempio: scuola-roma.miodominio.it/blog → /scuola-roma/blog
      const url = request.nextUrl.clone()
      url.pathname = `/${subdomain}${pathname}`

      console.log(`[Middleware] Rewrite: ${hostname}${pathname} → ${url.pathname}`)

      return NextResponse.rewrite(url)
    }
  }

  // Per Vercel, gestisci il routing basato sul primo segmento del dominio
  if (isVercel) {
    const parts = hostname.split('.')
    const firstPart = parts[0]

    // Se il primo segmento non è il nome del progetto principale, consideralo come slug scuola
    // Esempio: bruno-pizzolato.school-platform-iota.vercel.app
    // firstPart = "bruno-pizzolato"
    if (firstPart && firstPart !== 'school-platform-iota' && !firstPart.includes('vercel')) {
      // Se siamo già in un path della scuola, non fare il rewrite
      if (!pathname.startsWith(`/${firstPart}`)) {
        const url = request.nextUrl.clone()
        url.pathname = `/${firstPart}${pathname}`

        console.log(`[Middleware] Vercel Rewrite: ${hostname}${pathname} → ${url.pathname}`)

        return NextResponse.rewrite(url)
      }
    }
  }

  // In localhost o path-based routing, Next.js gestisce automaticamente /[school]
  return NextResponse.next()
}

// Configura il matcher per applicare il middleware
export const config = {
  matcher: [
    /*
     * Match tutti i path eccetto:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt, sitemap.xml
     * - admin (Payload admin)
     * - media (uploads)
     * - file con estensione (es. .jpg, .png, .css, .js)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|admin|media|.*\\..*).*)',
  ],
}
