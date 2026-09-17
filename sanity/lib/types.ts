import type { PortableTextBlock } from '@portabletext/types'

import type { AspectName } from './image'

export type PortableText = PortableTextBlock[]

export type SanityImageAsset = {
  _id: string
  url: string
  metadata: {
    lqip: string | null
    dimensions: { width: number; height: number; aspectRatio: number } | null
  } | null
}

export type SanityImageValue = {
  alt?: string | null
  hotspot?: { x: number; y: number; width: number; height: number } | null
  crop?: { top: number; bottom: number; left: number; right: number } | null
  asset: SanityImageAsset | null
}

export type QuoteValue = {
  text: string
  attribution?: string | null
}

export type CountryStub = {
  name: string
  slug: string
}

export type PhotoDoc = {
  _id: string
  caption: string | null
  location: string | null
  capturedAt: string | null
  featured: boolean | null
  country: CountryStub | null
  image: SanityImageValue
}

export type CarouselVariant = 'fullBleed' | 'peek' | 'filmstrip' | 'cards'

type GallerySectionBase = {
  _key: string
  title: string | null
  intro: string | null
  source: 'countryAll' | 'manual' | null
  limit: number | null
  showCaptions: boolean | null
  photos: PhotoDoc[] | null
}

export type GalleryGridSection = GallerySectionBase & {
  _type: 'galleryGrid'
  columns: number | null
  aspect: AspectName | null
  gap: 'tight' | 'normal' | 'roomy' | null
}

export type GalleryMasonrySection = GallerySectionBase & {
  _type: 'galleryMasonry'
  columns: number | null
}

export type GalleryCarouselSection = GallerySectionBase & {
  _type: 'galleryCarousel'
  variant: CarouselVariant | null
  aspect: AspectName | null
  autoplay: boolean | null
  autoplayDelay: number | null
  showArrows: boolean | null
  showDots: boolean | null
}

export type GallerySection = GalleryGridSection | GalleryMasonrySection | GalleryCarouselSection

export type ContinentSummary = {
  _id: string
  name: string
  slug: string
  order: number
  blurb: string | null
  coverImage: SanityImageValue
  countryCount: number
  photoCount: number
}

export type ContinentGallery = ContinentSummary & {
  photos: PhotoDoc[]
}

export type CountryCard = {
  _id: string
  name: string
  slug: string
  isoNumeric: string | null
  isoAlpha2: string | null
  shortIntro: string | null
  coverImage: SanityImageValue
  continent: { name: string; slug: string } | null
  photoCount: number
}

export type CountryDoc = CountryCard & {
  story: PortableText | null
  sections: GallerySection[] | null
  allPhotos: PhotoDoc[]
}

export type TripDoc = {
  _id: string
  title: string
  slug: string
  startDate: string
  endDate: string | null
  summary: string | null
  coverImage: SanityImageValue
  countries: CountryStub[] | null
  photos: PhotoDoc[] | null
}

export type TravelNoteCard = {
  _id: string
  title: string
  slug: string
  date: string
  excerpt: string | null
  coverImage: SanityImageValue
  country: CountryStub | null
}

export type TravelNoteDoc = TravelNoteCard & {
  body: PortableText | null
}

export type HeroValue = {
  mediaType: 'image' | 'video'
  slides: SanityImageValue[] | null
  videoUrl: string | null
  poster: SanityImageValue | null
  eyebrow: string | null
  headline: string
  subhead: string | null
  quote: QuoteValue | null
  primaryCta: { label: string | null; href: string | null } | null
  secondaryCta: { label: string | null; href: string | null } | null
}

export type SectionHeading = {
  title: string | null
  intro: string | null
} | null

export type HomePageData = {
  hero: HeroValue
  intro: string | null
  favorites: {
    title: string | null
    intro: string | null
    variant: CarouselVariant | null
    autoplay: boolean | null
    countries: CountryCard[] | null
  } | null
  continents: SectionHeading
  recentTrip: {
    title: string | null
    intro: string | null
    trip: TripDoc | null
  } | null
  whereToNext: {
    title: string | null
    intro: string | null
    destinations:
      | {
          _key: string
          name: string
          note: string | null
          when: string | null
          image: SanityImageValue | null
        }[]
      | null
  } | null
  featuredDestinations: SectionHeading
  latestNotes: SectionHeading
  aboutTeaser: {
    title: string | null
    text: string | null
    ctaLabel: string | null
    image: SanityImageValue | null
  } | null
  quoteBands: (QuoteValue & { _key: string })[] | null
} | null

export type HomeQueryResult = {
  home: HomePageData
  continents: ContinentSummary[]
  featuredCountries: CountryCard[]
  notes: TravelNoteCard[]
  latestTrip: TripDoc | null
}

export type AboutPageData = {
  title: string
  tagline: string | null
  portrait: SanityImageValue | null
  bio: PortableText | null
  behindTheCamera: {
    title: string | null
    intro: string | null
    body: PortableText | null
    photos: PhotoDoc[] | null
  } | null
  equipment: {
    title: string | null
    intro: string | null
    items:
      | {
          _key: string
          name: string
          category: string | null
          note: string | null
        }[]
      | null
  } | null
  inspiration: {
    title: string | null
    body: PortableText | null
    quote: QuoteValue | null
  } | null
} | null

export type SiteSettings = {
  title: string
  tagline: string | null
  description: string | null
  email: string
  instagramUrl: string
  footerNote: string | null
  quotes: (QuoteValue & { _key: string })[] | null
  ogImage: SanityImageValue | null
} | null

export type MapCountry = {
  name: string
  slug: string
  isoNumeric: string | null
  continent: string | null
  photoCount: number
}

export type ContinentPageData = {
  _id: string
  name: string
  slug: string
  blurb: string | null
  coverImage: SanityImageValue
  countries: (CountryCard & { previewPhotos: PhotoDoc[] })[]
} | null
