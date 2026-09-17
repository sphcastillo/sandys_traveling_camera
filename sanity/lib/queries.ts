import { defineQuery } from 'next-sanity'

/**
 * LQIP and dimensions are not returned automatically — every image projection
 * asks for them so blur placeholders work and layouts can reserve space before
 * the photo arrives.
 */
const IMAGE = /* groq */ `{
  alt,
  hotspot,
  crop,
  asset->{
    _id,
    url,
    metadata { lqip, dimensions { width, height, aspectRatio } }
  }
}`

const PHOTO = /* groq */ `{
  _id,
  caption,
  location,
  capturedAt,
  featured,
  "country": country->{ name, "slug": slug.current },
  image ${IMAGE}
}`

const COUNTRY_CARD = /* groq */ `{
  _id,
  name,
  "slug": slug.current,
  isoNumeric,
  isoAlpha2,
  shortIntro,
  coverImage ${IMAGE},
  "continent": continent->{ name, "slug": slug.current },
  "photoCount": count(*[_type == "photo" && references(^._id)])
}`

const CONTINENT_SUMMARY = /* groq */ `{
  _id,
  name,
  "slug": slug.current,
  order,
  blurb,
  coverImage ${IMAGE},
  "countryCount": count(*[_type == "country" && references(^._id)]),
  "photoCount": count(*[_type == "photo" && country->continent._ref == ^._id])
}`

const TRIP = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  startDate,
  endDate,
  summary,
  coverImage ${IMAGE},
  "countries": countries[]->{ name, "slug": slug.current },
  "photos": photos[]-> ${PHOTO}
}`

const NOTE_CARD = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  date,
  excerpt,
  coverImage ${IMAGE},
  "country": country->{ name, "slug": slug.current }
}`

const GALLERY_SECTIONS = /* groq */ `sections[]{
  _key,
  _type,
  title,
  intro,
  source,
  limit,
  showCaptions,
  columns,
  aspect,
  gap,
  variant,
  autoplay,
  autoplayDelay,
  showArrows,
  showDots,
  "photos": photos[]-> ${PHOTO}
}`

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0]{
    title,
    tagline,
    description,
    email,
    instagramUrl,
    footerNote,
    quotes[]{ _key, text, attribution, image ${IMAGE} },
    ogImage ${IMAGE}
  }
`)

export const HOME_QUERY = defineQuery(`{
  "home": *[_id == "homePage"][0]{
    hero{
      mediaType,
      slides[] ${IMAGE},
      videoUrl,
      poster ${IMAGE},
      eyebrow,
      headline,
      subhead,
      quote{ text, attribution, image ${IMAGE} },
      primaryCta{ label, href },
      secondaryCta{ label, href }
    },
    intro,
    favorites{
      title,
      intro,
      variant,
      autoplay,
      "countries": countries[]-> ${COUNTRY_CARD}
    },
    continents{ title, intro },
    recentTrip{
      title,
      intro,
      "trip": trip-> ${TRIP}
    },
    whereToNext{
      title,
      intro,
      destinations[]{ _key, name, note, when, image ${IMAGE} }
    },
    featuredDestinations{ title, intro },
    latestNotes{ title, intro },
    aboutTeaser{ title, text, ctaLabel, image ${IMAGE} },
    quoteBands[]{ _key, text, attribution, image ${IMAGE} }
  },
  "continents": *[_type == "continent"] | order(order asc) ${CONTINENT_SUMMARY},
  "featuredCountries": *[_type == "country" && featured == true]
    | order(coalesce(orderRank, 999) asc, name asc) ${COUNTRY_CARD},
  "notes": *[_type == "travelNote" && defined(slug.current)] | order(date desc)[0...3] ${NOTE_CARD},
  "latestTrip": *[_type == "trip"] | order(startDate desc)[0] ${TRIP}
}`)

export const MAP_COUNTRIES_QUERY = defineQuery(`
  *[_type == "country" && defined(slug.current)] | order(name asc){
    name,
    "slug": slug.current,
    isoNumeric,
    "continent": continent->name,
    "photoCount": count(*[_type == "photo" && references(^._id)])
  }
`)

export const FEATURED_COUNTRIES_QUERY = defineQuery(`
  *[_type == "country" && featured == true]
    | order(coalesce(orderRank, 999) asc, name asc) ${COUNTRY_CARD}
`)

export const ALL_COUNTRIES_QUERY = defineQuery(`
  *[_type == "country" && defined(slug.current)]
    | order(coalesce(orderRank, 999) asc, name asc) ${COUNTRY_CARD}
`)

export const COUNTRY_SLUGS_QUERY = defineQuery(`
  *[_type == "country" && defined(slug.current)]{ "slug": slug.current }
`)

export const COUNTRY_QUERY = defineQuery(`
  *[_type == "country" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    isoNumeric,
    isoAlpha2,
    shortIntro,
    coverImage ${IMAGE},
    "continent": continent->{ name, "slug": slug.current },
    "photoCount": count(*[_type == "photo" && references(^._id)]),
    story,
    ${GALLERY_SECTIONS},
    "allPhotos": *[_type == "photo" && country._ref == ^._id] | order(_createdAt asc) ${PHOTO}
  }
`)

export const GALLERY_QUERY = defineQuery(`
  *[_type == "continent"] | order(order asc){
    _id,
    name,
    "slug": slug.current,
    order,
    blurb,
    coverImage ${IMAGE},
    "countryCount": count(*[_type == "country" && references(^._id)]),
    "photoCount": count(*[_type == "photo" && country->continent._ref == ^._id]),
    "photos": *[_type == "photo" && country->continent._ref == ^._id] | order(_createdAt asc)[0...14] ${PHOTO}
  }
`)

export const CONTINENT_SLUGS_QUERY = defineQuery(`
  *[_type == "continent" && defined(slug.current)]{ "slug": slug.current }
`)

export const CONTINENT_QUERY = defineQuery(`
  *[_type == "continent" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    blurb,
    coverImage ${IMAGE},
    "countries": *[_type == "country" && continent._ref == ^._id]
      | order(coalesce(orderRank, 999) asc, name asc){
        _id,
        name,
        "slug": slug.current,
        isoNumeric,
        isoAlpha2,
        shortIntro,
        coverImage ${IMAGE},
        "continent": continent->{ name, "slug": slug.current },
        "photoCount": count(*[_type == "photo" && references(^._id)]),
        "previewPhotos": *[_type == "photo" && country._ref == ^._id] | order(_createdAt asc)[0...9] ${PHOTO}
      }
  }
`)

export const NOTES_QUERY = defineQuery(`
  *[_type == "travelNote" && defined(slug.current)] | order(date desc) ${NOTE_CARD}
`)

export const NOTE_SLUGS_QUERY = defineQuery(`
  *[_type == "travelNote" && defined(slug.current)]{ "slug": slug.current }
`)

export const NOTE_QUERY = defineQuery(`
  *[_type == "travelNote" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    date,
    excerpt,
    coverImage ${IMAGE},
    "country": country->{ name, "slug": slug.current },
    body
  }
`)

export const ABOUT_QUERY = defineQuery(`
  *[_id == "aboutPage"][0]{
    title,
    tagline,
    portrait ${IMAGE},
    bio,
    behindTheCamera{
      title,
      intro,
      body,
      "photos": photos[]-> ${PHOTO}
    },
    equipment{
      title,
      intro,
      items[]{ _key, name, category, note }
    },
    inspiration{
      title,
      body,
      quote{ text, attribution, image ${IMAGE} }
    }
  }
`)

export const LATEST_TRIP_QUERY = defineQuery(`
  *[_type == "trip"] | order(startDate desc)[0] ${TRIP}
`)
