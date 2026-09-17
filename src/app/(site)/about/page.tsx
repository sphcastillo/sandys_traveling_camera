import type { Metadata } from 'next'

import { MasonryGallery } from '@/components/gallery/masonry-gallery'
import { SanityImage } from '@/components/media/sanity-image'
import { QuoteBand } from '@/components/site/quote-band'
import { RichText } from '@/components/site/rich-text'
import { Section, SectionHeader } from '@/components/site/section'
import { CameraIcon } from '@/components/ui/icons'
import { sanityFetch } from '@/sanity/lib/live'
import { ABOUT_QUERY } from '@/sanity/lib/queries'
import type { AboutPageData } from '@/sanity/lib/types'

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: ABOUT_QUERY, stega: false })
  const about = data as AboutPageData

  return {
    title: about?.title ?? 'Meet Sandy',
    description: about?.tagline ?? undefined,
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  body: 'Camera body',
  lens: 'Lens',
  bag: 'Bag',
  accessory: 'Accessory',
}

export default async function AboutPage() {
  const { data } = await sanityFetch({ query: ABOUT_QUERY })
  const about = data as AboutPageData

  if (!about) {
    return (
      <Section className="pt-40">
        <div className="shell max-w-2xl">
          <h1 className="font-display text-4xl sm:text-5xl">Meet Sandy</h1>
          <p className="mt-6 text-[1.02rem]/[1.85] text-ink/75">
            This page is waiting for content. Run <code>pnpm seed</code> or fill it in from the
            Studio.
          </p>
        </div>
      </Section>
    )
  }

  const behindPhotos = (about.behindTheCamera?.photos ?? []).filter(Boolean)
  const equipmentItems = about.equipment?.items ?? []

  return (
    <>
      <Section className="pt-32 sm:pt-40">
        <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1fr] lg:items-start lg:gap-20">
          {about.portrait ? (
            <SanityImage
              value={about.portrait}
              aspect="tall"
              sizes="(max-width: 1024px) 100vw, 38vw"
              priority
              quality={85}
            />
          ) : null}

          <div>
            <p className="eyebrow">The photographer</p>
            <h1 className="mt-4 text-balance font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              {about.title}
            </h1>
            {about.tagline ? (
              <p className="mt-5 max-w-xl text-pretty font-display text-xl italic text-planetary sm:text-2xl">
                {about.tagline}
              </p>
            ) : null}
            <RichText value={about.bio} className="mt-8 max-w-xl" />
          </div>
        </div>
      </Section>

      {about.behindTheCamera ? (
        <Section tone="meteor">
          <div className="shell">
            <SectionHeader
              eyebrow="How the work happens"
              title={about.behindTheCamera.title ?? 'Behind the Camera'}
              intro={about.behindTheCamera.intro}
            />
            <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
              <RichText value={about.behindTheCamera.body} className="max-w-xl" />
              {behindPhotos.length > 0 ? (
                <MasonryGallery photos={behindPhotos.slice(0, 6)} columns={2} />
              ) : null}
            </div>
          </div>
        </Section>
      ) : null}

      {equipmentItems.length > 0 ? (
        <Section>
          <div className="shell">
            <SectionHeader
              eyebrow="In the bag"
              title={about.equipment?.title ?? 'My Equipment'}
              intro={about.equipment?.intro}
            />
            <ul className="mt-12 grid gap-px overflow-hidden border border-galaxy/10 bg-galaxy/10 sm:grid-cols-2 lg:grid-cols-3">
              {equipmentItems.map((item) => (
                <li key={item._key} className="bg-milkyway p-7">
                  <span className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.22em] text-planetary">
                    <CameraIcon className="size-4" />
                    {CATEGORY_LABELS[item.category ?? ''] ?? 'Kit'}
                  </span>
                  <p className="mt-4 font-display text-2xl">{item.name}</p>
                  {item.note ? (
                    <p className="mt-2 text-sm/relaxed text-ink/65">{item.note}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      {about.inspiration ? (
        <Section tone="sky">
          <div className="shell">
            <div className="mx-auto max-w-2xl">
              <p className="eyebrow">What keeps her going</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl">
                {about.inspiration.title ?? 'My Inspiration'}
              </h2>
              <RichText value={about.inspiration.body} className="mt-8" />
            </div>
          </div>
        </Section>
      ) : null}

      <QuoteBand quote={about.inspiration?.quote} tone="dark" />
    </>
  )
}
