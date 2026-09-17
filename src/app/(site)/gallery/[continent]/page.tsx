import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { GalleryGrid } from '@/components/gallery/gallery-grid'
import { PhotoCarousel } from '@/components/gallery/photo-carousel'
import { SanityImage } from '@/components/media/sanity-image'
import { Section } from '@/components/site/section'
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/ui/icons'
import { client } from '@/sanity/lib/client'
import { sanityFetch } from '@/sanity/lib/live'
import { CONTINENT_QUERY, CONTINENT_SLUGS_QUERY } from '@/sanity/lib/queries'
import type { ContinentPageData } from '@/sanity/lib/types'

type Props = { params: Promise<{ continent: string }> }

export async function generateStaticParams() {
  const slugs = await client
    .withConfig({ useCdn: false, stega: false })
    .fetch<{ slug: string }[]>(CONTINENT_SLUGS_QUERY)

  return slugs.map(({ slug }) => ({ continent: slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { continent: slug } = await params
  const { data } = await sanityFetch({ query: CONTINENT_QUERY, params: { slug }, stega: false })
  const continent = data as ContinentPageData
  if (!continent) return {}

  return {
    title: continent.name,
    description: continent.blurb ?? undefined,
  }
}

export default async function ContinentPage({ params }: Props) {
  const { continent: slug } = await params
  const { data } = await sanityFetch({ query: CONTINENT_QUERY, params: { slug } })
  const continent = data as ContinentPageData

  if (!continent) notFound()

  const countries = continent.countries ?? []

  return (
    <article>
      <header className="relative isolate flex min-h-[58svh] flex-col justify-end overflow-hidden bg-galaxy">
        <div className="absolute inset-0 -z-10">
          <SanityImage
            value={continent.coverImage}
            fill
            sizes="100vw"
            priority
            quality={85}
            imageClassName="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-galaxy via-galaxy/40 to-galaxy/30" />
        </div>

        <div className="shell pb-14 pt-32 sm:pb-20 sm:pt-40">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.28em] text-venus transition-colors hover:text-milkyway"
          >
            <ArrowLeftIcon className="size-3.5" />
            The gallery
          </Link>
          <h1 className="mt-6 font-display text-5xl leading-none text-milkyway sm:text-6xl lg:text-7xl">
            {continent.name}
          </h1>
          {continent.blurb ? (
            <p className="mt-6 max-w-xl text-pretty text-base/relaxed text-sky sm:text-lg/relaxed">
              {continent.blurb}
            </p>
          ) : null}
        </div>
      </header>

      {countries.map((country, index) => (
        <Section key={country._id} tone={index % 2 === 0 ? 'default' : 'meteor'}>
          <div className="shell">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="eyebrow">{country.photoCount} photographs</p>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-[2.75rem]">
                  {country.name}
                </h2>
                {country.shortIntro ? (
                  <p className="mt-3 text-pretty text-[0.95rem]/relaxed text-ink/70">
                    {country.shortIntro}
                  </p>
                ) : null}
              </div>
              <Link
                href={`/countries/${country.slug}`}
                className="group flex shrink-0 items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-planetary transition-colors hover:text-galaxy"
              >
                Open {country.name}
                <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Alternating treatments so a long continent page keeps moving. */}
            {index % 2 === 0 ? (
              <GalleryGrid
                photos={country.previewPhotos}
                columns={3}
                aspect="landscape"
                gap="tight"
                className="mt-10"
              />
            ) : (
              <PhotoCarousel
                photos={country.previewPhotos}
                variant="peek"
                aspect="landscape"
                showCaptions
                className="mt-10"
              />
            )}
          </div>
        </Section>
      ))}
    </article>
  )
}
