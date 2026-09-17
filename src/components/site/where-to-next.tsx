import { SanityImage } from '@/components/media/sanity-image'
import type { SanityImageValue } from '@/sanity/lib/types'

type Destination = {
  _key: string
  name: string
  note: string | null
  when: string | null
  image: SanityImageValue | null
}

export function WhereToNext({ destinations }: { destinations: Destination[] }) {
  if (destinations.length === 0) return null

  return (
    <ol className="grid gap-8 sm:grid-cols-3 sm:gap-6">
      {destinations.map((destination, index) => (
        <li key={destination._key} className="group">
          <div className="relative overflow-hidden">
            <SanityImage
              value={destination.image}
              aspect="square"
              sizes="(max-width: 640px) 100vw, 33vw"
              imageClassName="scale-105 opacity-75 blur-[2px] transition-all duration-[1200ms] ease-[var(--ease-soft)] group-hover:opacity-90 group-hover:blur-0"
            />
            <span className="pointer-events-none absolute inset-0 grid place-items-center">
              <span className="font-display text-6xl text-milkyway/80 sm:text-7xl">
                {String(index + 1).padStart(2, '0')}
              </span>
            </span>
          </div>
          <p className="mt-5 flex items-baseline justify-between gap-3">
            <span className="font-display text-2xl">{destination.name}</span>
            {destination.when ? (
              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-planetary">
                {destination.when}
              </span>
            ) : null}
          </p>
          {destination.note ? (
            <p className="mt-2 text-pretty text-sm/relaxed text-ink/65">{destination.note}</p>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
