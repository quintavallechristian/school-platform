import type { Metadata } from 'next'
import './styles.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import { MyAurora } from '@/components/Aurora/MyAurora'
import 'leaflet/dist/leaflet.css'

export const metadata: Metadata = {
  title: 'Scuole infanzia',
  description: 'Descrizione di scuole infanzia',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="it" suppressHydrationWarning>
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
        </ThemeProvider>
      </body>
    </html>
  )
}
