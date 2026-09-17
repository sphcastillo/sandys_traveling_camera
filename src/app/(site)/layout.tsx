import type { Metadata } from 'next'

import { Footer } from '@/components/site/footer'
import { Header } from '@/components/site/header'
import { withSettings } from '@/lib/site'
import { sanityFetch } from '@/sanity/lib/live'
import { SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'
import type { SiteSettings } from '@/sanity/lib/types'

export async function generateMetadata(): Promise<Metadata> {
  // Stega characters must never reach <head>, so metadata fetches disable it.
  const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY, stega: false })
  const settings = withSettings(data as SiteSettings)

  return {
    title: {
      default: settings.title,
      template: `%s — ${settings.title}`,
    },
    description: settings.description ?? undefined,
    openGraph: {
      title: settings.title,
      description: settings.description ?? undefined,
      type: 'website',
    },
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY })
  const settings = withSettings(data as SiteSettings)

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-galaxy focus:px-5 focus:py-3 focus:text-sm focus:text-milkyway"
      >
        Skip to content
      </a>
      <Header
        siteTitle={settings.title}
        email={settings.email}
        instagramUrl={settings.instagramUrl}
      />
      <main id="main">{children}</main>
      <Footer
        siteTitle={settings.title}
        tagline={settings.tagline}
        email={settings.email}
        instagramUrl={settings.instagramUrl}
        footerNote={settings.footerNote}
      />
    </>
  )
}
