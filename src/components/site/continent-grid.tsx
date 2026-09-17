import Link from 'next/link'

import { SanityImage } from '@/components/media/sanity-image'
import { ArrowRightIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'
import type { ContinentSummary } from '@/sanity/lib/types'

type ContinentGridProps = {
  continents: ContinentSummary[]
  className?: string
}

/** Large, clickable, and deliberately generous — the photographs are the menu. */
export function ContinentGrid({ continents, className }: ContinentGridProps) {
  if (continents.length === 0) return null

  return (
    <div className={cn('grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3', className)}>
      {continents.map((continent, index) => (
        <Link
          key={continent._id}
          href={`/gallery/${continent.slug}`}
          className="group relative block overflow-hidden"
        >
          <SanityImage
            value={continent.coverImage}
            aspect={index % 5 === 0 ? 'landscape' : 'tall'}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            imageClassName="transition-transform duration-[1200ms] ease-[var(--ease-soft)] group-hover:scale-[1.06]"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-galaxy/85 via-galaxy/20 to-transparent transition-colors duration-500 group-hover:from-galaxy/90" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <h3 className="font-display text-3xl text-milkyway sm:text-4xl">{continent.name}</h3>
            {continent.blurb ? (
              <p className="mt-2 max-w-xs text-pretty text-sm/relaxed text-sky">
                {continent.blurb}
              </p>
            ) : null}
            <p className="mt-4 flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.24em] text-venus">
              {continent.countryCount} countries &middot; {continent.photoCount} photographs
              <ArrowRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
