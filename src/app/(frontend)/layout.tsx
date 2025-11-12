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
          <div className="h-full w-full fixed top-0 left-0 z-20 opacity-20 pointer-events-none">
            <MyAurora />
          </div>
          {children}
          <Toaster />
          <CommunicationsPopup communications={communications} />
        </ThemeProvider>
      </body>
    </html>
  )
}
