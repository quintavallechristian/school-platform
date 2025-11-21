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
  
  // Gestione hostname per proxy (ngrok) e porte
  let hostHeader = request.headers.get('x-forwarded-host') || request.headers.get('host') || ''
  
  // Se ci sono più host (es. proxy chain), prendi il primo
  if (hostHeader.includes(',')) {
    hostHeader = hostHeader.split(',')[0].trim()
  }
  
  const hostname = hostHeader.split(':')[0].toLowerCase()
  console.log('Middleware processing:', { hostname, pathname })

  // Ignora richieste all'admin panel, API e assets
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/media')
  ) {
    return NextResponse.next()
  }

  // Ignora file statici (hanno estensione nel path)
  const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(pathname)
  if (hasFileExtension) {
    return NextResponse.next()
  }

  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1')
  const isVercel = hostname.includes('vercel.app')

  // Per Vercel, gestisci il routing basato sul primo segmento del dominio
  if (isVercel) {
    const parts = hostname.split('.')
    const firstPart = parts[0]

    // Se il primo segmento non è il nome del progetto principale, consideralo come slug scuola
    // Esempio: bruno-pizzolato.school-platform-iota.vercel.app
    if (firstPart && firstPart !== 'school-platform-iota' && !firstPart.includes('vercel')) {
      // Se siamo già in un path della scuola, non fare il rewrite
      if (!pathname.startsWith(`/${firstPart}`)) {
        const url = request.nextUrl.clone()
        url.pathname = `/${firstPart}${pathname}`

        return NextResponse.rewrite(url)
      }
    }
  }

  // Per domini custom (non localhost, non Vercel)
  if (!isLocalhost && !isVercel) {
    const parts = hostname.split('.')
    // Se abbiamo almeno 3 parti (sottodominio.dominio.tld)
    if (parts.length >= 3) {
      const subdomain = parts[0]

      // Ignora www e altri sottodomini di sistema
      if (subdomain === 'www' || subdomain === 'admin') {
        return NextResponse.next()
      }

      // Rewrite alla rotta della scuola
      const url = request.nextUrl.clone()
      url.pathname = `/${subdomain}${pathname}`

      return NextResponse.rewrite(url)
    }
  }

  // Path-based routing (es. school-platform.vercel.app/bruno-pizzolato)
  return NextResponse.next()
}


export const config = {
  matcher: ['/((?!_next|api|admin|media|favicon.ico).*)'],
}











