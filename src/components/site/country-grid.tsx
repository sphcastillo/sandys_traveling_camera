import Link from 'next/link'

import { SanityImage } from '@/components/media/sanity-image'
import { cn } from '@/lib/cn'
import type { CountryCard } from '@/sanity/lib/types'

type CountryGridProps = {
  countries: CountryCard[]
  columns?: 2 | 3 | 4
  className?: string
}

const COLUMNS = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
} as const

const SIZES = {
  2: '(max-width: 640px) 100vw, 50vw',
  3: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  4: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
} as const

export function CountryGrid({ countries, columns = 3, className }: CountryGridProps) {
  if (countries.length === 0) return null

  return (
    <div className={cn('grid gap-3 sm:gap-5', COLUMNS[columns], className)}>
      {countries.map((country) => (
        <Link
          key={country._id}
          href={`/countries/${country.slug}`}
          className="group relative block overflow-hidden"
        >
          <SanityImage
            value={country.coverImage}
            aspect="tall"
            sizes={SIZES[columns]}
            imageClassName="transition-transform duration-[1100ms] ease-[var(--ease-soft)] group-hover:scale-[1.06]"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-galaxy/85 via-galaxy/15 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <p className="text-[0.6rem] uppercase tracking-[0.24em] text-venus">
              {country.continent?.name}
            </p>
            <h3 className="mt-1.5 font-display text-2xl text-milkyway sm:text-3xl">
              {country.name}
            </h3>
            <p className="mt-1 text-xs text-sky">{country.photoCount} photographs</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
