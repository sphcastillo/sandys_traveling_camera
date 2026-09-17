import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { GallerySections } from '@/components/gallery/gallery-sections'
import { MasonryGallery } from '@/components/gallery/masonry-gallery'
import { SanityImage } from '@/components/media/sanity-image'
import { RichText } from '@/components/site/rich-text'
import { ArrowLeftIcon } from '@/components/ui/icons'
import { client } from '@/sanity/lib/client'
import { sanityFetch } from '@/sanity/lib/live'
import { COUNTRY_QUERY, COUNTRY_SLUGS_QUERY } from '@/sanity/lib/queries'
import type { CountryDoc } from '@/sanity/lib/types'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await client
    .withConfig({ useCdn: false, stega: false })
    .fetch<{ slug: string }[]>(COUNTRY_SLUGS_QUERY)

  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await sanityFetch({
    query: COUNTRY_QUERY,
    params: await params,
    stega: false,
  })
  const country = data as CountryDoc | null
  if (!country) return {}

  return {
    title: country.name,
    description: country.shortIntro ?? undefined,
  }
}

export default async function CountryPage({ params }: Props) {
  const { data } = await sanityFetch({ query: COUNTRY_QUERY, params: await params })
  const country = data as CountryDoc | null

  if (!country) notFound()

  const photos = country.allPhotos ?? []
  const hasSections = Boolean(country.sections?.length)

  return (
    <article>
      {/* Cover ------------------------------------------------------------ */}
      <header className="relative isolate flex min-h-[70svh] flex-col justify-end overflow-hidden bg-galaxy">
        <div className="absolute inset-0 -z-10">
          <SanityImage
            value={country.coverImage}
            fill
            sizes="100vw"
            priority
            quality={85}
            imageClassName="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-galaxy via-galaxy/35 to-galaxy/30" />
        </div>

        <div className="shell pb-14 pt-32 sm:pb-20 sm:pt-40">
          {country.continent ? (
            <Link
              href={`/gallery/${country.continent.slug}`}
              className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.28em] text-venus transition-colors hover:text-milkyway"
            >
              <ArrowLeftIcon className="size-3.5" />
              {country.continent.name}
            </Link>
          ) : null}

          <h1 className="mt-6 font-display text-5xl leading-none text-milkyway sm:text-6xl lg:text-7xl">
            {country.name}
          </h1>

          {country.shortIntro ? (
            <p className="mt-6 max-w-xl text-pretty text-base/relaxed text-sky sm:text-lg/relaxed">
              {country.shortIntro}
            </p>
          ) : null}

          <p className="mt-8 text-[0.7rem] uppercase tracking-[0.24em] text-venus">
            {country.photoCount} photographs
          </p>
        </div>
      </header>

      {/* Photographs ------------------------------------------------------ */}
      {hasSections ? (
        <GallerySections sections={country.sections} fallbackPhotos={photos} />
      ) : (
        <section className="py-14 sm:py-20">
          <div className="shell">
            <MasonryGallery photos={photos} columns={3} />
          </div>
        </section>
      )}

      {/* The writing always comes last, beneath every photograph. -------- */}
      {country.story?.length ? (
        <section className="bg-meteor py-16 sm:py-24">
          <div className="shell">
            <div className="mx-auto max-w-2xl">
              <p className="eyebrow">Travel story</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl">{country.name}, in words</h2>
              <RichText value={country.story} className="mt-8" />
            </div>
          </div>
        </section>
      ) : null}

      <div className="shell py-14">
        <Link
          href="/countries"
          className="group inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-planetary transition-colors hover:text-galaxy"
        >
          <ArrowLeftIcon className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to the map
        </Link>
      </div>
    </article>
  )
}
