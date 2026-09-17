import { Cormorant_Garamond, Jost } from 'next/font/google'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'

import './globals.css'

import { SanityLive } from '@/sanity/lib/live'

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const sans = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const isDraft = (await draftMode()).isEnabled

  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-dvh antialiased">
        {children}
        <SanityLive />
        {isDraft ? <VisualEditing /> : null}
      </body>
    </html>
  )
}
