'use client'

import Link from 'next/link'

import { CarouselArrows, CarouselDots } from '@/components/gallery/carousel-controls'
import { useCarousel } from '@/components/gallery/use-carousel'
import { SanityImage } from '@/components/media/sanity-image'
import { ArrowRightIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'
import type { CarouselVariant, CountryCard } from '@/sanity/lib/types'

type CountryCarouselProps = {
  countries: CountryCard[]
  variant?: CarouselVariant
  autoplay?: boolean
  className?: string
}

const SLIDE_WIDTH: Record<CarouselVariant, string> = {
  fullBleed: 'w-full',
  filmstrip: 'w-full',
  peek: 'w-[80%] sm:w-[52%] lg:w-[38%]',
  cards: 'w-[78%] sm:w-[45%] lg:w-[30%]',
}

const SIZES: Record<CarouselVariant, string> = {
  fullBleed: '100vw',
  filmstrip: '100vw',
  peek: '(max-width: 640px) 80vw, (max-width: 1024px) 52vw, 38vw',
  cards: '(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 30vw',
}

export function CountryCarousel({
  countries,
  variant = 'peek',
  autoplay = false,
  className,
}: CountryCarouselProps) {
  const { trackRef, active, step, scrollToIndex, setActive, pauseHandlers } = useCarousel({
    count: countries.length,
    autoplay,
    delay: 6,
  })

  if (countries.length === 0) return null

  const jumpTo = (index: number) => {
    setActive(index)
    scrollToIndex(index)
  }

  return (
    <div className={cn('relative', className)} {...pauseHandlers}>
      <div
        ref={trackRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Favourite countries"
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth sm:gap-5"
      >
        {countries.map((country, index) => (
          <article
            key={country._id}
            aria-roledescription="slide"
            className={cn('shrink-0 snap-start', SLIDE_WIDTH[variant])}
          >
            <Link href={`/countries/${country.slug}`} className="group block">
              <div className="relative overflow-hidden">
                <SanityImage
                  value={country.coverImage}
                  aspect={variant === 'cards' ? 'tall' : 'landscape'}
                  sizes={SIZES[variant]}
                  priority={index === 0}
                  imageClassName="transition-transform duration-[900ms] ease-[var(--ease-soft)] group-hover:scale-[1.05]"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-galaxy/80 via-galaxy/10 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.24em] text-venus">
                    {country.continent?.name}
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-milkyway sm:text-3xl">
                    {country.name}
                  </h3>
                  <p className="mt-1 flex items-center gap-2 text-xs text-sky">
                    {country.photoCount} photographs
                    <ArrowRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </p>
                </div>
              </div>
            </Link>
            {country.shortIntro ? (
              <p className="mt-4 line-clamp-2 text-sm/relaxed text-ink/65">{country.shortIntro}</p>
            ) : null}
          </article>
        ))}
      </div>

      {countries.length > 1 ? (
        <div className="mt-8 flex items-center justify-between gap-6">
          <CarouselDots count={countries.length} active={active} onSelect={jumpTo} />
          <CarouselArrows onPrev={() => step(-1)} onNext={() => step(1)} />
        </div>
      ) : null}
    </div>
  )
}
