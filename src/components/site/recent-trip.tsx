import Link from 'next/link'

import { PhotoCarousel } from '@/components/gallery/photo-carousel'
import { SanityImage } from '@/components/media/sanity-image'
import { PinIcon } from '@/components/ui/icons'
import { formatDateRange } from '@/lib/format'
import type { TripDoc } from '@/sanity/lib/types'

export function RecentTrip({ trip }: { trip: TripDoc }) {
  const photos = (trip.photos ?? []).filter(Boolean)

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14">
      <SanityImage
        value={trip.coverImage}
        aspect="landscape"
        sizes="(max-width: 1024px) 100vw, 52vw"
        quality={85}
      />

      <div>
        <p className="eyebrow">{formatDateRange(trip.startDate, trip.endDate)}</p>
        <h3 className="mt-3 text-balance font-display text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">
          {trip.title}
        </h3>

        {trip.countries?.length ? (
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/60">
            <PinIcon className="size-4 text-planetary" />
            {trip.countries.map((country, index) => (
              <span key={country.slug}>
                <Link
                  href={`/countries/${country.slug}`}
                  className="underline decoration-universe underline-offset-4 hover:text-planetary"
                >
                  {country.name}
                </Link>
                {index < trip.countries!.length - 1 ? <span className="ml-3">&middot;</span> : null}
              </span>
            ))}
          </p>
        ) : null}

        {trip.summary ? (
          <p className="mt-6 max-w-xl text-pretty text-[0.98rem]/relaxed text-ink/70">
            {trip.summary}
          </p>
        ) : null}

        {photos.length > 0 ? (
          <PhotoCarousel
            photos={photos.slice(0, 10)}
            variant="cards"
            aspect="square"
            showDots={false}
            showArrows
            className="mt-10"
          />
        ) : null}
      </div>
    </div>
  )
}
