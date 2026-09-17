import type { SchemaTypeDefinition } from 'sanity'

import { continent } from './documents/continent'
import { country } from './documents/country'
import { photo } from './documents/photo'
import { travelNote } from './documents/travelNote'
import { trip } from './documents/trip'
import { blockContent } from './objects/blockContent'
import { galleryCarousel, galleryGrid, galleryMasonry } from './objects/gallerySections'
import { heroMedia } from './objects/heroMedia'
import { quote } from './objects/quote'
import { aboutPage } from './singletons/aboutPage'
import { homePage } from './singletons/homePage'
import { siteSettings } from './singletons/siteSettings'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  continent,
  country,
  photo,
  trip,
  travelNote,
  // Singletons
  homePage,
  aboutPage,
  siteSettings,
  // Objects
  heroMedia,
  galleryGrid,
  galleryMasonry,
  galleryCarousel,
  blockContent,
  quote,
]

export const singletonTypes = new Set(['homePage', 'aboutPage', 'siteSettings'])
