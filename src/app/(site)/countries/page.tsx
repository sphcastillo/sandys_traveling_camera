import type { Metadata } from 'next'

import { WorldMap } from '@/components/map/world-map'
import { CountryGrid } from '@/components/site/country-grid'
import { Section, SectionHeader } from '@/components/site/section'
import { sanityFetch } from '@/sanity/lib/live'
import { ALL_COUNTRIES_QUERY, FEATURED_COUNTRIES_QUERY, MAP_COUNTRIES_QUERY } from '@/sanity/lib/queries'
import type { CountryCard, MapCountry } from '@/sanity/lib/types'

export const metadata: Metadata = {
  title: 'Countries',
  description:
    'Every country Sandy has photographed, on an interactive world map. Pick one to see the gallery.',
}

export default async function CountriesPage() {
  const [mapResult, featuredResult, allResult] = await Promise.all([
    sanityFetch({ query: MAP_COUNTRIES_QUERY }),
    sanityFetch({ query: FEATURED_COUNTRIES_QUERY }),
    sanityFetch({ query: ALL_COUNTRIES_QUERY }),
  ])

  const mapCountries = mapResult.data as MapCountry[]
  const featured = featuredResult.data as CountryCard[]
  const all = allResult.data as CountryCard[]

  return (
    <>
      <Section className="pt-32 pb-12 sm:pt-40">
        <div className="shell">
          <SectionHeader
            eyebrow={`${all.length} countries`}
            title="Pick a country"
            intro="Everywhere the camera has been, arranged by place rather than by year. Tap a highlighted country to open its gallery — the deeper the blue, the more photographs are waiting."
            align="center"
          />
        </div>

        <div className="shell mt-12">
          <WorldMap countries={mapCountries} />
        </div>
      </Section>

      {featured.length > 0 ? (
        <Section tone="meteor">
          <div className="shell">
            <SectionHeader
              eyebrow="Worth starting with"
              title="Featured Countries"
              intro="The ones Sandy talks about most."
            />
            <CountryGrid countries={featured} columns={4} className="mt-12" />
          </div>
        </Section>
      ) : null}

      {all.length > 0 ? (
        <Section>
          <div className="shell">
            <SectionHeader eyebrow="Everywhere else" title="All countries" />
            <CountryGrid countries={all} columns={4} className="mt-12" />
          </div>
        </Section>
      ) : null}
    </>
  )
}
