import type { Metadata } from 'next'
import './styles.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import { MyAurora } from '@/components/Aurora/MyAurora'
import CookieBanner from '@/components/CookieBanner/CookieBanner'
import 'leaflet/dist/leaflet.css'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import { cookies, headers } from 'next/headers'
import { scuoleFont } from '@/styles/fonts'
import { ConditionalGenericNavbar } from '@/components/Navbar/ConditionalGenericNavbar'

export const metadata: Metadata = {
  title: 'Scuole infanzia',
  description: 'Descrizione di scuole infanzia',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const payload = await getPayloadHMR({ config })
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value
  let user = null

  if (token) {
    try {
      const result = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) })
      user = result.user
    } catch (_error) {
      // User is not logged in or token is invalid
    }
  }

  // Ottieni l'URL corrente per verificare se siamo in una route di scuola
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''

  return (
    <html lang="it" suppressHydrationWarning className={`${scuoleFont.variable}`}>
      <head></head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="h-full w-full fixed top-0 left-0 z-20 opacity-20 pointer-events-none">
            <MyAurora />
          </div>
          {/* Mostra GenericNavbar solo per route generiche (non scuole) */}
          <ConditionalGenericNavbar user={user} pathname={pathname} />
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              // Accessibilità WCAG 2.1 AA
              unstyled: false,
              classNames: {
                toast: 'group toast',
                title: 'toast-title',
                description: 'toast-description',
                actionButton: 'toast-action',
                cancelButton: 'toast-cancel',
              },
            }}
            // Configurazione ARIA per screen reader
            richColors
            closeButton
          />
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  )
}
