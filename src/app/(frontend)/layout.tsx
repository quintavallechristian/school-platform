import type { Metadata } from 'next'
import './styles.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import { MyAurora } from '@/components/Aurora/MyAurora'
import { CommunicationsPopup } from '@/components/CommunicationsPopup/CommunicationsPopup'
import { getPayload } from 'payload'
import config from '@/payload.config'
import 'leaflet/dist/leaflet.css'

export const metadata: Metadata = {
  title: 'BrunoPizzolato',
  description: 'Descrizione di BrunoPizzolato',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Carica le comunicazioni attive
  const payload = await getPayload({ config })
  const now = new Date()

  const { docs: communications } = await payload.find({
    collection: 'communications',
    where: {
      and: [
        {
          isActive: {
            equals: true,
          },
        },
        {
          or: [
            {
              expiresAt: {
                exists: false,
              },
            },
            {
              expiresAt: {
                greater_than: now.toISOString(),
              },
            },
          ],
        },
      ],
    },
    sort: '-priority,-publishedAt',
    limit: 50,
  })

  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="h-full w-full fixed top-0 left-0 -z-10 opacity-20">
            <MyAurora />
          </div>
          {children}
          <Toaster />
          <CommunicationsPopup communications={communications} />
          <footer className="py-8 text-center mt-16">
            <div className="max-w-7xl mx-auto px-8">
              <p className="m-0">
                &copy; {new Date().getFullYear()} Blog Scuola. Tutti i diritti riservati.
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
