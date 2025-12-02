/**
 * Utility per Google Analytics Event Tracking
 */

// Estende il tipo Window per includere gtag
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js',
      targetId: string,
      config?: Record<string, any>,
    ) => void
    dataLayer?: any[]
  }
}

/**
 * Verifica se Google Analytics è stato caricato
 */
export const isGALoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

/**
 * Traccia un download di file
 * @param fileName - Nome del file scaricato
 * @param fileUrl - URL del file
 * @param fileType - Tipo/estensione del file (es: 'pdf', 'docx')
 * @param category - Categoria opzionale (es: 'Documenti', 'Modulistica')
 */
export const trackFileDownload = (
  fileName: string,
  fileUrl: string,
  fileType?: string,
  category?: string,
) => {
  if (!isGALoaded()) {
    console.log('GA not loaded, skipping tracking')
    return
  }

  window.gtag?.('event', 'file_download', {
    file_name: fileName,
    file_url: fileUrl,
    file_extension: fileType || getFileExtension(fileUrl),
    file_category: category || 'General',
    event_category: 'engagement',
    event_label: fileName,
  })

  console.log('📊 Tracked download:', fileName)
}

/**
 * Traccia un evento personalizzato generico
 * @param eventName - Nome dell'evento
 * @param eventParams - Parametri dell'evento
 */
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (!isGALoaded()) {
    console.log('GA not loaded, skipping tracking')
    return
  }

  window.gtag?.('event', eventName, {
    event_category: 'engagement',
    ...eventParams,
  })

  console.log('📊 Tracked event:', eventName, eventParams)
}

/**
 * Traccia la visualizzazione di una pagina specifica
 * @param pagePath - Path della pagina
 * @param pageTitle - Titolo della pagina
 */
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (!isGALoaded()) {
    console.log('GA not loaded, skipping tracking')
    return
  }

  window.gtag?.('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  })

  console.log('📊 Tracked page view:', pagePath)
}

/**
 * Traccia l'apertura di un link esterno
 * @param url - URL del link esterno
 * @param linkText - Testo del link (opzionale)
 */
export const trackOutboundLink = (url: string, linkText?: string) => {
  if (!isGALoaded()) {
    console.log('GA not loaded, skipping tracking')
    return
  }

  window.gtag?.('event', 'click', {
    event_category: 'outbound',
    event_label: linkText || url,
    transport_type: 'beacon',
    link_url: url,
  })

  console.log('📊 Tracked outbound link:', url)
}

/**
 * Traccia una prenotazione di evento
 * @param eventName - Nome dell'evento prenotato
 * @param eventDate - Data dell'evento
 */
export const trackEventBooking = (eventName: string, eventDate?: string) => {
  if (!isGALoaded()) {
    console.log('GA not loaded, skipping tracking')
    return
  }

  window.gtag?.('event', 'event_booking', {
    event_category: 'engagement',
    event_label: eventName,
    event_date: eventDate,
  })

  console.log('📊 Tracked event booking:', eventName)
}

/**
 * Traccia l'invio di un form
 * @param formName - Nome del form
 * @param formType - Tipo di form (es: 'contact', 'registration', 'booking')
 */
export const trackFormSubmit = (formName: string, formType?: string) => {
  if (!isGALoaded()) {
    console.log('GA not loaded, skipping tracking')
    return
  }

  window.gtag?.('event', 'form_submit', {
    event_category: 'engagement',
    form_name: formName,
    form_type: formType || 'general',
  })

  console.log('📊 Tracked form submit:', formName)
}

// Utility interne

/**
 * Estrae l'estensione del file dall'URL
 */
function getFileExtension(url: string): string {
  const parts = url.split('.')
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'unknown'
}
