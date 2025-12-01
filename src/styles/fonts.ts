import localFont from 'next/font/local'

export const scuoleFont = localFont({
  src: [
    {
      path: '../../public/fonts/nickainley.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-scuole',
  display: 'swap',
})

export const metadata = {
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
}
