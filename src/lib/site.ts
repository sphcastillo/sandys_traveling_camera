import type { SiteSettings } from '@/sanity/lib/types'

/**
 * Keeps the chrome rendering sensibly before the dataset has been seeded.
 */
export const FALLBACK_SETTINGS = {
  title: "Sandy's Traveling Camera",
  tagline: 'Life is either a daring adventure or nothing at all.',
  description:
    'Travel photography from around the world, organised by country and gathered by continent.',
  email: 'hello@sandystravelingcamera.com',
  instagramUrl: 'https://instagram.com',
  footerNote: 'YOLO — you only live once.',
  quotes: null,
  ogImage: null,
} satisfies NonNullable<SiteSettings>

export function withSettings(settings: SiteSettings) {
  return {
    ...FALLBACK_SETTINGS,
    ...(settings ?? {}),
  }
}
