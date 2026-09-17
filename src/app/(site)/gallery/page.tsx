import type { Metadata } from 'next'
import Link from 'next/link'

import { MasonryGallery } from '@/components/gallery/masonry-gallery'
import { ContinentGrid } from '@/components/site/continent-grid'
import { Section, SectionHeader } from '@/components/site/section'
import { ArrowRightIcon } from '@/components/ui/icons'
import { sanityFetch } from '@/sanity/lib/live'
import { GALLERY_QUERY } from '@/sanity/lib/queries'
import type { ContinentGallery } from '@/sanity/lib/types'

export const metadata: Metadata = {
  title: 'Gallery',
  description: "Sandy's photographs, gathered continent by continent.",
}

export default async function GalleryPage() {
  const { data } = await sanityFetch({ query: GALLERY_QUERY })
  const continents = (data as ContinentGallery[]).filter((continent) => continent.photoCount > 0)

  const totalPhotos = continents.reduce((sum, continent) => sum + continent.photoCount, 0)

  return (
    <>
      <Section className="pt-32 pb-8 sm:pt-40">
        <div className="shell">
          <SectionHeader
            eyebrow={`${totalPhotos} photographs`}
            title="The gallery"
            intro="Separated by continent, then by country. Pick a continent to go deeper, or simply scroll and let the photographs do the talking."
            align="center"
          />
        </div>
      </Section>

      <Section className="pt-4">
        <div className="shell">
          <SectionHeader eyebrow="Large and clickable" title="Explore by Continent" />
          <ContinentGrid continents={continents} className="mt-10" />
        </div>
      </Section>

      {continents.map((continent, index) => (
        <Section key={continent._id} tone={index % 2 === 0 ? 'meteor' : 'default'}>
          <div className="shell">
            <SectionHeader
              eyebrow={`${continent.countryCount} countries · ${continent.photoCount} photographs`}
              title={continent.name}
              intro={continent.blurb}
              href={`/gallery/${continent.slug}`}
              linkLabel={`All of ${continent.name}`}
            />
            <MasonryGallery photos={continent.photos} columns={4} className="mt-10" />
            <Link
              href={`/gallery/${continent.slug}`}
              className="group mt-8 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-planetary transition-colors hover:text-galaxy"
            >
              Every country in {continent.name}
              <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Section>
      ))}
    </>
  )
}
