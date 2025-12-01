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

  // Se siamo sul dominio custom della scuola
  if (school.domain && hostname === school.domain.toLowerCase()) {
    return ''
  }

  // Se siamo su un sottodominio (es. slug.dominio.tld)
  // Assumiamo che se l'host inizia con lo slug, siamo in modalità sottodominio
  // Questo copre sia slug.scuoleinfanzia.eu che slug.vercel.app
  if (hostname.startsWith(`${school.slug}.`)) {
    return ''
  }

  // Altrimenti siamo in modalità path-based (es. scuoleinfanzia.eu/slug)
  return `/${school.slug}`
}
