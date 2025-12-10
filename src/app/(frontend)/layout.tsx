import type { Metadata } from 'next'
import './styles.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import CookieBanner from '@/components/CookieBanner/CookieBanner'
import 'leaflet/dist/leaflet.css'

import config from '@payload-config'
import { cookies, headers } from 'next/headers'
import { scuoleFont } from '@/styles/fonts'
import { ConditionalGenericNavbar } from '@/components/Navbar/ConditionalGenericNavbar'
import { getPayload } from 'payload'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.scuoleinfanzia.eu'),
  title: {
    template: '%s | Scuole Infanzia',
    default: 'Scuole Infanzia | Il portale delle scuole materne',
  },
  description:
    "Benvenuto su Scuole Infanzia, la piattaforma dedicata alla gestione e comunicazione delle scuole dell'infanzia in Italia.",
  keywords: [
    'scuola infanzia',
    'asilo nido',
    'scuola materna',
    'gestione scuola',
    'comunicazioni scuola famiglia',
  ],
  authors: [{ name: 'Scuole Infanzia Team' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Scuole Infanzia | Il portale delle scuole materne',
    description:
      "Benvenuto su Scuole Infanzia, la piattaforma dedicata alla gestione e comunicazione delle scuole dell'infanzia in Italia.",
    url: 'https://www.scuoleinfanzia.eu',
    siteName: 'Scuole Infanzia',
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scuole Infanzia',
    description:
      "Benvenuto su Scuole Infanzia, la piattaforma dedicata alla gestione e comunicazione delle scuole dell'infanzia in Italia.",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const payload = await getPayload({ config })
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
      <head>
        {/* Variabili CSS di default per Aurora e altri componenti */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            :root {
              --color-background-primary: #ffffff;
              --color-background-secondary: #f3f4f6;
              --color-primary: #ea580c;
              --color-secondary: #f59e0b;
            }
            .dark {
              --color-background-primary: #1f2937;
              --color-background-secondary: #111827;
              --color-primary: #fb923c;
              --color-secondary: #fbbf24;
            }
          `,
          }}
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
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
