import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const display = Cormorant_Garamond({
  subsets:  ['latin'],
  weight:   ['400', '500', '600', '700'],
  variable: '--font-display',
})

const body = DM_Sans({
  subsets:  ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title:       'AsoEbi Operations',
  description: 'Wedding groomsmen operations dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body bg-navy-50 min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
