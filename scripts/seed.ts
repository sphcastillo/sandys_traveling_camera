/**
 * Seeds the dataset with Sandy's dummy content and ~290 uploaded photographs.
 *
 *   pnpm seed          # create anything missing, leave existing docs alone
 *   pnpm seed:reset    # delete everything this script created, then reseed
 *
 * Runs through `sanity exec --with-user-token`, so it borrows the credentials
 * from `sanity login` — there is no API token to create or store.
 *
 * Photographs come from picsum.photos using a deterministic seed per photo, so
 * re-running produces byte-identical images. Each one is uploaded as a real
 * Sanity asset, which is what makes hotspots, LQIP and CDN transforms work.
 */
import { getCliClient } from 'sanity/cli'

import {
  CAPTION_TEMPLATES,
  CONTINENTS,
  COUNTRIES,
  EQUIPMENT,
  NOTES,
  SITE_QUOTES,
  TAG_POOL,
  TRIPS,
  WHERE_TO_NEXT,
  type SeedCountry,
} from './seed-data'

const client = getCliClient({ apiVersion: '2026-02-01' })

const PHOTOS_PER_COUNTRY = 12
const UPLOAD_CONCURRENCY = 6
const RESET = process.argv.includes('--reset')

/** Landscape, portrait and square in rotation so masonry walls look alive. */
const SHAPES = [
  { width: 2400, height: 1600 },
  { width: 1600, height: 2400 },
  { width: 2000, height: 2000 },
  { width: 2400, height: 1350 },
] as const

type NewDoc = Record<string, unknown> & { _type: string }
type IdentifiedDoc = NewDoc & { _id: string }

// ---------------------------------------------------------------- helpers

function key(prefix: string, index: number) {
  return `${prefix}${index}`
}

function blocks(paragraphs: string[]) {
  return paragraphs.map((text, index) => ({
    _type: 'block',
    _key: key('b', index),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key('s', index), text, marks: [] }],
  }))
}

function imageField(assetId: string, alt: string) {
  return {
    _type: 'image',
    alt,
    asset: { _type: 'reference', _ref: assetId },
  }
}

function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length)
  let cursor = 0

  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++
      results[index] = await worker(items[index], index)
    }
  })

  await Promise.all(runners)
  return results
}

// ---------------------------------------------------------------- photos

type PhotoPlan = {
  seedKey: string
  country: SeedCountry
  index: number
  place: string
  caption: string
  capturedAt: string
  tags: string[]
  url: string
  filename: string
}

function planPhotos(country: SeedCountry): PhotoPlan[] {
  return Array.from({ length: PHOTOS_PER_COUNTRY }, (_, index) => {
    const place = country.places[index % country.places.length]
    const shape = SHAPES[index % SHAPES.length]

    return {
      seedKey: `photo:${country.slug}-${index + 1}`,
      country,
      index,
      place,
      caption: CAPTION_TEMPLATES[index % CAPTION_TEMPLATES.length](place),
      capturedAt: addDays(country.visited, index),
      tags: [TAG_POOL[index % TAG_POOL.length], TAG_POOL[(index + 4) % TAG_POOL.length]],
      url: `https://picsum.photos/seed/${country.slug}-${index + 1}/${shape.width}/${shape.height}`,
      filename: `${country.slug}-${index + 1}.jpg`,
    }
  })
}

async function uploadPhoto(plan: PhotoPlan) {
  const response = await fetch(plan.url, { redirect: 'follow' })
  if (!response.ok) {
    throw new Error(`Could not download ${plan.url} (${response.status})`)
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  const asset = await client.assets.upload('image', buffer, {
    filename: plan.filename,
    contentType: 'image/jpeg',
  })

  return asset._id
}

// ---------------------------------------------------------------- sections

/**
 * Rotates through grid, masonry and all four carousel styles so every country
 * page shows a different combination.
 */
function sectionsFor(index: number) {
  const variants = [
    [
      {
        _type: 'galleryCarousel',
        _key: 'sec1',
        title: 'The wide view',
        source: 'countryAll',
        limit: 6,
        variant: 'fullBleed',
        aspect: 'cinematic',
        autoplay: true,
        autoplayDelay: 6,
        showArrows: true,
        showDots: true,
        showCaptions: false,
      },
      {
        _type: 'galleryGrid',
        _key: 'sec2',
        title: 'Everything else',
        source: 'countryAll',
        columns: 3,
        aspect: 'landscape',
        gap: 'normal',
        showCaptions: true,
      },
    ],
    [
      {
        _type: 'galleryMasonry',
        _key: 'sec1',
        title: 'As they came',
        intro: 'Every frame at its own proportions.',
        source: 'countryAll',
        columns: 3,
        showCaptions: false,
      },
      {
        _type: 'galleryCarousel',
        _key: 'sec2',
        title: 'A closer look',
        source: 'countryAll',
        limit: 8,
        variant: 'filmstrip',
        aspect: 'landscape',
        autoplay: false,
        showArrows: true,
        showDots: false,
        showCaptions: true,
      },
    ],
    [
      {
        _type: 'galleryGrid',
        _key: 'sec1',
        title: 'Details',
        source: 'countryAll',
        limit: 8,
        columns: 4,
        aspect: 'square',
        gap: 'tight',
        showCaptions: false,
      },
      {
        _type: 'galleryCarousel',
        _key: 'sec2',
        title: 'Favourites from this one',
        source: 'countryAll',
        variant: 'peek',
        aspect: 'portrait',
        autoplay: false,
        showArrows: true,
        showDots: true,
        showCaptions: true,
      },
    ],
    [
      {
        _type: 'galleryCarousel',
        _key: 'sec1',
        title: 'Postcards',
        source: 'countryAll',
        limit: 9,
        variant: 'cards',
        aspect: 'tall',
        autoplay: false,
        showArrows: true,
        showDots: true,
        showCaptions: false,
      },
      {
        _type: 'galleryMasonry',
        _key: 'sec2',
        title: 'The rest of the roll',
        source: 'countryAll',
        columns: 2,
        showCaptions: true,
      },
    ],
  ]

  return variants[index % variants.length]
}

// ---------------------------------------------------------------- reset

async function reset() {
  const ids: string[] = await client.fetch(
    `*[defined(seedKey) || _id in ["homePage", "aboutPage", "siteSettings"]]._id`,
  )

  if (ids.length === 0) {
    console.log('Nothing to reset.')
    return
  }

  console.log(`Deleting ${ids.length} seeded documents…`)
  for (let i = 0; i < ids.length; i += 100) {
    let tx = client.transaction()
    for (const id of ids.slice(i, i + 100)) tx = tx.delete(id)
    await tx.commit({ visibility: 'async' })
  }

  // Only assets this script uploaded, matched by their exact filenames, so a
  // reset can never take out something Sandy added herself.
  const seedFilenames = COUNTRIES.flatMap((country) =>
    planPhotos(country).map((plan) => plan.filename),
  )

  const assetIds: string[] = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename in $names]._id`,
    { names: seedFilenames },
  )

  console.log(`Deleting ${assetIds.length} seeded image assets…`)
  for (const id of assetIds) {
    try {
      await client.delete(id)
    } catch {
      // An asset still referenced somewhere will refuse to go; harmless here.
    }
  }
}

// ---------------------------------------------------------------- main

async function main() {
  console.log(`Seeding project ${client.config().projectId}/${client.config().dataset}`)

  if (RESET) await reset()

  const existing: { _id: string; _type: string; seedKey: string }[] = await client.fetch(
    `*[defined(seedKey)]{ _id, _type, seedKey }`,
  )
  const idBySeedKey = new Map(existing.map((doc) => [doc.seedKey, doc._id]))
  console.log(`${idBySeedKey.size} seeded documents already exist.`)

  // 1. Continents -----------------------------------------------------------
  const continentIds = new Map<string, string>()

  for (const continent of CONTINENTS) {
    const seedKey = `continent:${continent.slug}`
    const existingId = idBySeedKey.get(seedKey)
    if (existingId) {
      continentIds.set(continent.slug, existingId)
      continue
    }

    const created = await client.create({
      _type: 'continent',
      name: continent.name,
      slug: { _type: 'slug', current: continent.slug },
      order: continent.order,
      blurb: continent.blurb,
      seedKey,
      // Filled in once its countries have photographs to borrow a cover from.
    } as NewDoc)

    continentIds.set(continent.slug, created._id)
    console.log(`  + continent ${continent.name}`)
  }

  // 2. Countries ------------------------------------------------------------
  const countryIds = new Map<string, string>()

  for (const [index, country] of COUNTRIES.entries()) {
    const seedKey = `country:${country.slug}`
    const existingId = idBySeedKey.get(seedKey)
    if (existingId) {
      countryIds.set(country.slug, existingId)
      continue
    }

    const created = await client.create({
      _type: 'country',
      name: country.name,
      slug: { _type: 'slug', current: country.slug },
      continent: { _type: 'reference', _ref: continentIds.get(country.continent)! },
      isoNumeric: country.isoNumeric,
      isoAlpha2: country.isoAlpha2,
      shortIntro: country.shortIntro,
      story: blocks(country.story),
      sections: sectionsFor(index),
      featured: Boolean(country.featured),
      orderRank: country.orderRank,
      seedKey,
    } as NewDoc)

    countryIds.set(country.slug, created._id)
    console.log(`  + country ${country.name}`)
  }

  // 3. Photographs ----------------------------------------------------------
  const plans = COUNTRIES.flatMap(planPhotos).filter((plan) => !idBySeedKey.get(plan.seedKey))
  const photoIdsByCountry = new Map<string, string[]>()

  if (plans.length > 0) {
    console.log(`Uploading ${plans.length} photographs (${UPLOAD_CONCURRENCY} at a time)…`)
    let done = 0

    await mapWithConcurrency(plans, UPLOAD_CONCURRENCY, async (plan) => {
      const assetId = await uploadPhoto(plan)

      const created = await client.create({
        _type: 'photo',
        image: imageField(assetId, `${plan.caption} ${plan.country.name}.`),
        caption: plan.caption,
        country: { _type: 'reference', _ref: countryIds.get(plan.country.slug)! },
        location: plan.place,
        capturedAt: plan.capturedAt,
        featured: plan.index < 3,
        tags: plan.tags,
        seedKey: plan.seedKey,
      } as NewDoc)

      done += 1
      if (done % 20 === 0 || done === plans.length) {
        console.log(`  ${done}/${plans.length} photographs`)
      }

      return created._id
    })
  } else {
    console.log('All photographs already uploaded.')
  }

  // Collect every photo per country, seeded now or previously.
  const allPhotos: { _id: string; seedKey: string; assetId: string; countrySlug: string }[] =
    await client.fetch(
      `*[_type == "photo" && defined(seedKey)]{
        _id,
        seedKey,
        "assetId": image.asset._ref,
        "countrySlug": country->slug.current
      }`,
    )

  for (const photo of allPhotos) {
    const list = photoIdsByCountry.get(photo.countrySlug) ?? []
    list.push(photo._id)
    photoIdsByCountry.set(photo.countrySlug, list)
  }

  const assetByCountry = new Map<string, string[]>()
  for (const photo of allPhotos) {
    const list = assetByCountry.get(photo.countrySlug) ?? []
    if (photo.assetId) list.push(photo.assetId)
    assetByCountry.set(photo.countrySlug, list)
  }

  // 4. Cover images ---------------------------------------------------------
  let coverTx = client.transaction()
  let coverCount = 0

  for (const country of COUNTRIES) {
    const assets = assetByCountry.get(country.slug)
    const id = countryIds.get(country.slug)
    if (!assets?.length || !id) continue

    coverTx = coverTx.patch(id, (patch) =>
      patch.setIfMissing({
        coverImage: imageField(assets[0], `${country.name} — ${country.places[0]}.`),
      }),
    )
    coverCount += 1
  }

  for (const continent of CONTINENTS) {
    const id = continentIds.get(continent.slug)
    const firstCountry = COUNTRIES.find((c) => c.continent === continent.slug)
    const assets = firstCountry ? assetByCountry.get(firstCountry.slug) : undefined
    if (!id || !assets?.length) continue

    coverTx = coverTx.patch(id, (patch) =>
      patch.setIfMissing({
        coverImage: imageField(assets[1] ?? assets[0], `${continent.name}.`),
      }),
    )
    coverCount += 1
  }

  if (coverCount > 0) {
    await coverTx.commit()
    console.log(`Set cover images on ${coverCount} documents.`)
  }

  // 5. Trips ----------------------------------------------------------------
  for (const trip of TRIPS) {
    const seedKey = `trip:${trip.slug}`
    if (idBySeedKey.get(seedKey)) continue

    const photoIds = trip.countries.flatMap((slug) =>
      (photoIdsByCountry.get(slug) ?? []).slice(0, 8),
    )
    const firstAsset = assetByCountry.get(trip.countries[0])?.[2]
    if (!firstAsset) continue

    await client.create({
      _type: 'trip',
      title: trip.title,
      slug: { _type: 'slug', current: trip.slug },
      countries: trip.countries.map((slug, i) => ({
        _type: 'reference',
        _key: key('c', i),
        _ref: countryIds.get(slug)!,
      })),
      startDate: trip.startDate,
      endDate: trip.endDate,
      summary: trip.summary,
      coverImage: imageField(firstAsset, `${trip.title}.`),
      photos: photoIds.map((id, i) => ({ _type: 'reference', _key: key('p', i), _ref: id })),
      seedKey,
    } as NewDoc)

    console.log(`  + trip ${trip.title}`)
  }

  // 6. Travel notes ---------------------------------------------------------
  for (const note of NOTES) {
    const seedKey = `note:${note.slug}`
    if (idBySeedKey.get(seedKey)) continue

    const asset = assetByCountry.get(note.country)?.[3]
    if (!asset) continue

    await client.create({
      _type: 'travelNote',
      title: note.title,
      slug: { _type: 'slug', current: note.slug },
      date: note.date,
      country: { _type: 'reference', _ref: countryIds.get(note.country)! },
      excerpt: note.excerpt,
      coverImage: imageField(asset, `${note.title}.`),
      body: blocks(note.body),
      seedKey,
    } as NewDoc)

    console.log(`  + note ${note.title}`)
  }

  // 7. Singletons -----------------------------------------------------------
  const heroAssets = [
    assetByCountry.get('iceland')?.[0],
    assetByCountry.get('japan')?.[4],
    assetByCountry.get('namibia')?.[1],
  ].filter(Boolean) as string[]

  const favourites = COUNTRIES.filter((c) => c.featured).map((c) => c.slug)

  await client.createOrReplace({
    _id: 'homePage',
    _type: 'homePage',
    hero: {
      _type: 'heroMedia',
      mediaType: 'image',
      slides: heroAssets.map((assetId, i) => ({
        ...imageField(assetId, 'A wide landscape from one of Sandy’s trips.'),
        _key: key('slide', i),
      })),
      // To use video instead, switch mediaType to "video", drop an MP4 at
      // public/video/hero.mp4 and set videoUrl to "/video/hero.mp4".
      videoUrl: '',
      eyebrow: "Sandy's Traveling Camera",
      headline: 'Photographs from the long way round',
      subhead:
        'Hundreds of frames from dozens of countries, gathered by the place they were taken rather than the year.',
      quote: {
        _type: 'quote',
        text: 'Life is either a daring adventure or nothing at all.',
        attribution: 'Helen Keller',
      },
      primaryCta: { label: 'Explore the map', href: '/countries' },
      secondaryCta: { label: 'Browse the gallery', href: '/gallery' },
    },
    intro:
      'I have been photographing my way around the world for the better part of a decade — deserts before sunrise, cities in the rain, mountains that only show themselves for twenty minutes a day. This is all of it, arranged by country.',
    favorites: {
      title: 'My Favorites',
      intro: 'The countries I would go back to tomorrow, camera already packed.',
      variant: 'peek',
      autoplay: false,
      countries: favourites.map((slug, i) => ({
        _type: 'reference',
        _key: key('fav', i),
        _ref: countryIds.get(slug)!,
      })),
    },
    continents: {
      title: 'Explore by Continent',
      intro: 'Six continents, one roll of film at a time.',
    },
    recentTrip: {
      title: 'Most Recent Trip',
      intro: 'Where the camera has just been.',
    },
    whereToNext: {
      title: 'Where to Next',
      intro: 'The shortlist, in no particular order and subject to weather.',
      destinations: WHERE_TO_NEXT.map((destination, i) => {
        const borrowedFrom = ['norway', 'peru', 'iceland'][i] ?? 'iceland'
        const asset = assetByCountry.get(borrowedFrom)?.[5]

        return {
          _type: 'destination',
          _key: key('next', i),
          name: destination.name,
          when: destination.when,
          note: destination.note,
          image: asset ? imageField(asset, `${destination.name}.`) : undefined,
        }
      }),
    },
    featuredDestinations: {
      title: 'Featured Destinations',
      intro: 'A handful of places worth starting with.',
    },
    latestNotes: {
      title: 'Latest Travel Notes',
      intro: 'Short pieces about getting there, waiting around and occasionally getting lucky.',
    },
    aboutTeaser: {
      title: 'About the Photographer',
      text: 'I travel light, get up early and let the photographs do the talking. Everything here was taken on trips I saved up for, one country at a time.',
      ctaLabel: 'Meet Sandy',
      image: assetByCountry.get('peru')?.[6]
        ? imageField(assetByCountry.get('peru')![6], 'Sandy on the road.')
        : undefined,
    },
    quoteBands: [
      { _type: 'quote', _key: 'q1', text: 'Adventure is out there.', attribution: null },
      { _type: 'quote', _key: 'q2', text: 'YOLO — you only live once.', attribution: null },
    ],
  } as IdentifiedDoc)
  console.log('  + home page')

  await client.createOrReplace({
    _id: 'aboutPage',
    _type: 'aboutPage',
    title: 'Meet Sandy',
    tagline: 'Traveling photographer. Early riser. Chronic over-packer, in recovery.',
    portrait: assetByCountry.get('japan')?.[7]
      ? imageField(assetByCountry.get('japan')![7], 'Sandy, somewhere in Kyoto.')
      : undefined,
    bio: blocks([
      'I am Sandy, and I have spent the last nine years arranging my life around light. Whatever else a trip is for, I am there to be standing in the right place when the sun does something worth photographing.',
      'It started with one borrowed camera and a fortnight in Portugal, and it has since turned into dozens of countries, a great many pre-dawn alarms and a hard drive I am afraid to look at. I photograph places the way I experience them: quietly, on foot, and usually before breakfast.',
      'I do not write long captions. The pictures were the point.',
    ]),
    behindTheCamera: {
      title: 'Behind the Camera',
      intro:
        'What actually happens between arriving somewhere and coming home with something worth printing.',
      body: blocks([
        'Most of my work happens in the two hours either side of dawn and dusk. The middle of the day is for driving, eating, asking directions and sleeping — not for photographs.',
        'I shoot almost everything handheld and I carry as little as I can get away with. A lighter bag means I walk further, and walking further is where the frames are.',
        'The rest of it is patience. I have waited nine mornings for one clear sky and counted it as a fair trade.',
      ]),
    },
    equipment: {
      title: 'My Equipment',
      intro: 'Nothing exotic. It has all been rained on.',
      items: EQUIPMENT.map((item, i) => ({
        _type: 'equipmentItem',
        _key: key('kit', i),
        ...item,
      })),
    },
    inspiration: {
      title: 'My Inspiration',
      body: blocks([
        'I am drawn to places where the weather is part of the subject — coastlines, high passes, deserts at either end of the day. Landscapes that refuse to sit still.',
        'And to the small human things inside those landscapes: a boat, a doorway, a person walking home. Scale only means something when there is somebody in the frame.',
      ]),
      quote: {
        _type: 'quote',
        text: 'Life is either a daring adventure or nothing at all.',
        attribution: 'Helen Keller',
      },
    },
  } as IdentifiedDoc)
  console.log('  + about page')

  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    title: "Sandy's Traveling Camera",
    tagline: 'Travel photography from the long way round.',
    description:
      'Travel photography by Sandy — hundreds of photographs from around the world, gathered by country and continent.',
    email: 'hello@sandystravelingcamera.com',
    instagramUrl: 'https://www.instagram.com/',
    footerNote: 'YOLO — you only live once.',
    quotes: SITE_QUOTES.map((quote, i) => ({ _type: 'quote', _key: key('sq', i), ...quote })),
    ogImage: heroAssets[0]
      ? imageField(heroAssets[0], "Sandy's Traveling Camera")
      : undefined,
  } as IdentifiedDoc)
  console.log('  + site settings')

  console.log('\nDone. Open /studio to edit, or the homepage to look at it.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
