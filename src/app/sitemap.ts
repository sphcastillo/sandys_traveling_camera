import type { MetadataRoute } from 'next'

import { client } from '@/sanity/lib/client'
import {
  CONTINENT_SLUGS_QUERY,
  COUNTRY_SLUGS_QUERY,
  NOTE_SLUGS_QUERY,
} from '@/sanity/lib/queries'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const published = client.withConfig({ useCdn: false, stega: false })

  const [countries, continents, notes] = await Promise.all([
    published.fetch<{ slug: string }[]>(COUNTRY_SLUGS_QUERY),
    published.fetch<{ slug: string }[]>(CONTINENT_SLUGS_QUERY),
    published.fetch<{ slug: string }[]>(NOTE_SLUGS_QUERY),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1 },
    { url: `${BASE_URL}/countries`, priority: 0.9 },
    { url: `${BASE_URL}/gallery`, priority: 0.9 },
    { url: `${BASE_URL}/about`, priority: 0.7 },
    { url: `${BASE_URL}/notes`, priority: 0.6 },
  ]

  return [
    ...staticRoutes,
    ...countries.map(({ slug }) => ({ url: `${BASE_URL}/countries/${slug}`, priority: 0.8 })),
    ...continents.map(({ slug }) => ({ url: `${BASE_URL}/gallery/${slug}`, priority: 0.7 })),
    ...notes.map(({ slug }) => ({ url: `${BASE_URL}/notes/${slug}`, priority: 0.5 })),
  ]
}
