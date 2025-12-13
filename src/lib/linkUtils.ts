import type { School } from '@/payload-types'

/**
 * Determina la base href per i link della scuola in base all'hostname corrente.
 *
 * @param school - L'oggetto School corrente
 * @param host - L'hostname corrente (es. 'demo.scuoleinfanzia.eu' o 'scuoleinfanzia.eu')
 * @returns La base href da prependere ai link (es. '' per sottodomini, '/slug' per path-based)
 */
export function getSchoolBaseHref(school: School, host: string): string {
  if (!school) return ''

  // Rimuovi eventuale porta dall'host
  const hostname = host.split(':')[0].toLowerCase()

  // Se siamo su un sottodominio (es. slug.dominio.tld)
  // Assumiamo che se l'host inizia con lo slug, siamo in modalità sottodominio
  // Questo copre sia slug.scuoleinfanzia.eu che slug.vercel.app
  if (hostname.startsWith(`${school.slug}.`)) {
    return ''
  }

  // Altrimenti siamo in modalità path-based (es. scuoleinfanzia.eu/slug)
  return `/${school.slug}`
}

/**
 * Determina l'URL completo per la scuola in base all'ambiente.
 *
 * @param school - L'oggetto School corrente
 * @param host - L'hostname corrente (es. 'localhost:3000', 'demo.scuoleinfanzia.eu')
 * @returns L'URL completo (es. 'https://slug.scuoleinfanzia.eu' o 'http://localhost:3000/slug')
 */
export function getSchoolFullUrl(school: School, host: string): string {
  if (!school) return ''

  // Rimuovi eventuale porta dall'host
  const hostname = host.split(':')[0].toLowerCase()
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
  const protocol = isLocalhost ? 'http' : 'https'

  // Se siamo su localhost, usa path-based routing
  if (isLocalhost) {
    return `${protocol}://${host}/${school.slug}`
  }

  // In produzione, usa sempre sottodominio
  // Estrai il dominio principale (es. scuoleinfanzia.eu da demo.scuoleinfanzia.eu)
  const parts = hostname.split('.')
  const mainDomain = parts.length >= 2 ? parts.slice(-2).join('.') : hostname

  return `${protocol}://${school.slug}.${mainDomain}`
}
