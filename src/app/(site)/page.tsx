import Link from 'next/link'

import { CountryCarousel } from '@/components/gallery/country-carousel'
import { SanityImage } from '@/components/media/sanity-image'
import { ContinentGrid } from '@/components/site/continent-grid'
import { CountryGrid } from '@/components/site/country-grid'
import { Hero } from '@/components/site/hero'
import { NoteCards } from '@/components/site/note-cards'
import { QuoteBand } from '@/components/site/quote-band'
import { RecentTrip } from '@/components/site/recent-trip'
import { Section, SectionHeader } from '@/components/site/section'
import { WhereToNext } from '@/components/site/where-to-next'
import { ArrowRightIcon } from '@/components/ui/icons'
import { sanityFetch } from '@/sanity/lib/live'
import { HOME_QUERY } from '@/sanity/lib/queries'
import type { HomeQueryResult } from '@/sanity/lib/types'

export default async function HomePage() {
  const { data } = await sanityFetch({ query: HOME_QUERY })
  const { home, continents, featuredCountries, notes, latestTrip } = data as HomeQueryResult

  if (!home) {
    return <EmptyState />
  }

  const favourites = (home.favorites?.countries ?? []).filter(Boolean)
  const trip = home.recentTrip?.trip ?? latestTrip
  const destinations = (home.whereToNext?.destinations ?? []).filter(Boolean)
  const [firstQuote, secondQuote] = home.quoteBands ?? []

  return (
    <>
      <Hero hero={home.hero} />

      {home.intro ? (
        <Section className="py-20 sm:py-28">
          <div className="shell">
            <p className="mx-auto max-w-3xl text-balance text-center font-display text-2xl leading-[1.35] text-galaxy sm:text-3xl lg:text-[2.1rem]">
              {home.intro}
            </p>
          </div>
        </Section>
      ) : null}

      {favourites.length > 0 ? (
        <Section tone="meteor">
          <div className="shell">
            <SectionHeader
              eyebrow="Hand-picked"
              title={home.favorites?.title ?? 'My Favorites'}
              intro={home.favorites?.intro}
              href="/countries"
              linkLabel="All countries"
            />
            <CountryCarousel
              countries={favourites}
              variant={home.favorites?.variant ?? 'peek'}
              autoplay={home.favorites?.autoplay ?? false}
              className="mt-12"
            />
          </div>
        </Section>
      ) : null}

      {continents.length > 0 ? (
        <Section>
          <div className="shell">
            <SectionHeader
              eyebrow="Six continents"
              title={home.continents?.title ?? 'Explore by Continent'}
              intro={home.continents?.intro}
              href="/gallery"
              linkLabel="Full gallery"
            />
            <ContinentGrid continents={continents} className="mt-12" />
          </div>
        </Section>
      ) : null}

      <QuoteBand quote={firstQuote} tone="dark" />

      {trip ? (
        <Section>
          <div className="shell">
            <SectionHeader
              eyebrow="Just back"
              title={home.recentTrip?.title ?? 'Most Recent Trip'}
              intro={home.recentTrip?.intro}
            />
            <div className="mt-12">
              <RecentTrip trip={trip} />
            </div>
          </div>
        </Section>
      ) : null}

      {featuredCountries.length > 0 ? (
        <Section tone="sky">
          <div className="shell">
            <SectionHeader
              eyebrow="Start here"
              title={home.featuredDestinations?.title ?? 'Featured Destinations'}
              intro={home.featuredDestinations?.intro}
              href="/countries"
              linkLabel="See the map"
            />
            <CountryGrid countries={featuredCountries.slice(0, 8)} columns={4} className="mt-12" />
          </div>
        </Section>
      ) : null}

      {destinations.length > 0 ? (
        <Section>
          <div className="shell">
            <SectionHeader
              eyebrow="The shortlist"
              title={home.whereToNext?.title ?? 'Where to Next'}
              intro={home.whereToNext?.intro}
            />
            <div className="mt-12">
              <WhereToNext destinations={destinations} />
            </div>
          </div>
        </Section>
      ) : null}

      <QuoteBand quote={secondQuote} tone="sky" />

      {notes.length > 0 ? (
        <Section>
          <div className="shell">
            <SectionHeader
              eyebrow="Words, occasionally"
              title={home.latestNotes?.title ?? 'Latest Travel Notes'}
              intro={home.latestNotes?.intro}
              href="/notes"
              linkLabel="All notes"
            />
            <NoteCards notes={notes} className="mt-12" />
          </div>
        </Section>
      ) : null}

      {home.aboutTeaser?.text ? (
        <Section tone="meteor">
          <div className="shell grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-center lg:gap-16">
            {home.aboutTeaser.image ? (
              <SanityImage
                value={home.aboutTeaser.image}
                aspect="tall"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            ) : null}
            <div>
              <p className="eyebrow">Behind the camera</p>
              <h2 className="mt-3 text-balance font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
                {home.aboutTeaser.title ?? 'About the Photographer'}
              </h2>
              <p className="mt-6 max-w-xl text-pretty text-[1.02rem]/[1.85] text-ink/75">
                {home.aboutTeaser.text}
              </p>
              <Link
                href="/about"
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-galaxy px-7 py-4 text-xs font-medium uppercase tracking-[0.18em] text-milkyway transition-colors hover:bg-planetary"
              >
                {home.aboutTeaser.ctaLabel ?? 'Meet Sandy'}
                <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Section>
      ) : null}
    </>
  )
}

function EmptyState() {
  return (
    <Section className="pt-40">
      <div className="shell max-w-2xl">
        <p className="eyebrow">Nothing here yet</p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl">The dataset is empty</h1>
        <p className="mt-6 text-[1.02rem]/[1.85] text-ink/75">
          Run <code className="rounded bg-meteor px-2 py-1 text-sm">pnpm seed</code> to fill the
          project with Sandy&rsquo;s countries, trips and photographs, or open{' '}
          <Link href="/studio" className="underline decoration-universe underline-offset-4">
            the Studio
          </Link>{' '}
          and start adding them by hand.
        </p>
      </div>
    </Section>
  )
}
