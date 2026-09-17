'use client'

import { useState } from 'react'

import { CarouselArrows, CarouselDots } from '@/components/gallery/carousel-controls'
import { useCarousel } from '@/components/gallery/use-carousel'
import { Lightbox } from '@/components/media/lightbox'
import { SanityImage } from '@/components/media/sanity-image'
import { ExpandIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'
import type { AspectName } from '@/sanity/lib/image'
import type { CarouselVariant, PhotoDoc } from '@/sanity/lib/types'

type PhotoCarouselProps = {
  photos: PhotoDoc[]
  variant?: CarouselVariant
  aspect?: AspectName
  autoplay?: boolean
  autoplayDelay?: number
  showArrows?: boolean
  showDots?: boolean
  showCaptions?: boolean
  bleed?: boolean
  className?: string
}

/** Slide width per variant — the only thing that really separates them. */
const SLIDE_WIDTH: Record<CarouselVariant, string> = {
  fullBleed: 'w-full',
  filmstrip: 'w-full',
  peek: 'w-[86%] sm:w-[64%] lg:w-[48%]',
  cards: 'w-[80%] sm:w-[47%] lg:w-[31.5%]',
}

const SIZES: Record<CarouselVariant, string> = {
  fullBleed: '100vw',
  filmstrip: '(max-width: 1024px) 100vw, 75vw',
  peek: '(max-width: 640px) 86vw, (max-width: 1024px) 64vw, 48vw',
  cards: '(max-width: 640px) 80vw, (max-width: 1024px) 47vw, 32vw',
}

export function PhotoCarousel({
  photos,
  variant = 'peek',
  aspect = 'landscape',
  autoplay = false,
  autoplayDelay = 5,
  showArrows = true,
  showDots = true,
  showCaptions = false,
  bleed = false,
  className,
}: PhotoCarouselProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const { trackRef, active, step, scrollToIndex, setActive, pauseHandlers } = useCarousel({
    count: photos.length,
    autoplay,
    delay: autoplayDelay,
  })

  if (photos.length === 0) return null

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
        aria-label="Photographs"
        className={cn(
          'no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth',
          variant === 'fullBleed' || variant === 'filmstrip' ? 'gap-0' : 'gap-3 sm:gap-5',
        )}
      >
        {photos.map((photo, index) => (
          <figure
            key={photo._id}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${photos.length}`}
            className={cn('shrink-0 snap-start', SLIDE_WIDTH[variant])}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="group relative block w-full cursor-zoom-in overflow-hidden"
            >
              <SanityImage
                value={photo.image}
                aspect={aspect}
                sizes={SIZES[variant]}
                priority={index === 0}
                imageClassName="transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.04]"
              />
              <span className="pointer-events-none absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-galaxy/55 text-milkyway opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                <ExpandIcon className="size-4" />
              </span>
            </button>
            {showCaptions && (photo.caption || photo.location) ? (
              <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 px-1">
                {photo.caption ? (
                  <span className="font-display text-lg italic text-galaxy">{photo.caption}</span>
                ) : null}
                {photo.location ? (
                  <span className="text-[0.7rem] uppercase tracking-[0.2em] text-ink/50">
                    {photo.location}
                  </span>
                ) : null}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      {variant === 'filmstrip' ? (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, index) => (
            <button
              key={`thumb-${photo._id}`}
              type="button"
              onClick={() => jumpTo(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-current={index === active}
              className={cn(
                'relative w-20 shrink-0 overflow-hidden transition-all duration-300 sm:w-24',
                index === active ? 'opacity-100 ring-2 ring-planetary' : 'opacity-55 hover:opacity-90',
              )}
            >
              <SanityImage value={photo.image} aspect="landscape" sizes="96px" alt="" />
            </button>
          ))}
        </div>
      ) : null}

      {photos.length > 1 ? (
        <div
          className={cn(
            'mt-6 flex items-center gap-6',
            showDots ? 'justify-between' : 'justify-end',
            // Full-bleed tracks ignore the page gutter, so the controls add it back.
            bleed && 'px-5 sm:px-8 lg:px-14',
          )}
        >
          {showDots ? (
            <CarouselDots
              count={photos.length}
              active={active}
              onSelect={jumpTo}
              className="flex-1 justify-start"
            />
          ) : null}
          {showArrows ? <CarouselArrows onPrev={() => step(-1)} onNext={() => step(1)} /> : null}
        </div>
      ) : null}

      <Lightbox
        photos={photos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </div>
  )
}
