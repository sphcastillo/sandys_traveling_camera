'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { SanityImage } from '@/components/media/sanity-image'
import { ArrowRightIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'
import type { HeroValue } from '@/sanity/lib/types'

const SLIDE_DURATION = 7000

export function Hero({ hero }: { hero: HeroValue }) {
  const slides = (hero.slides ?? []).filter((slide) => slide?.asset)
  const isVideo = hero.mediaType === 'video' && Boolean(hero.videoUrl)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (isVideo || slides.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = window.setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      SLIDE_DURATION,
    )
    return () => window.clearInterval(id)
  }, [isVideo, slides.length])

  return (
    <section className="relative isolate flex min-h-[92svh] flex-col justify-end overflow-hidden bg-galaxy">
      <div className="absolute inset-0 -z-10">
        {isVideo ? (
          <>
            {/* The poster carries small screens and slow connections; the clip
                is only worth its bytes on a large viewport. */}
            <div className="absolute inset-0 md:hidden">
              <SanityImage
                value={hero.poster}
                fill
                sizes="100vw"
                priority
                imageClassName="object-cover"
              />
            </div>
            <video
              className="absolute inset-0 hidden size-full object-cover md:block"
              src={hero.videoUrl ?? undefined}
              poster={hero.poster?.asset?.url ?? undefined}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </>
        ) : (
          slides.map((slide, slideIndex) => (
            <div
              key={slide.asset?._id ?? slideIndex}
              aria-hidden={slideIndex !== index}
              className={cn(
                'absolute inset-0 transition-opacity duration-[2000ms] ease-[var(--ease-soft)]',
                slideIndex === index ? 'opacity-100' : 'opacity-0',
              )}
            >
              <SanityImage
                value={slide}
                fill
                sizes="100vw"
                quality={85}
                priority={slideIndex === 0}
                imageClassName={cn(
                  'object-cover',
                  slideIndex === index && 'slow-zoom',
                )}
              />
            </div>
          ))
        )}

        <div className="absolute inset-0 bg-linear-to-t from-galaxy via-galaxy/35 to-galaxy/45" />
      </div>

      <div className="shell pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div className="max-w-3xl fade-in-up">
          {hero.eyebrow ? (
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.32em] text-venus">
              {hero.eyebrow}
            </p>
          ) : null}

          <h1 className="mt-6 text-balance font-display text-5xl leading-[0.98] text-milkyway sm:text-6xl lg:text-7xl">
            {hero.headline}
          </h1>

          {hero.subhead ? (
            <p className="mt-6 max-w-xl text-pretty text-base/relaxed text-sky sm:text-lg/relaxed">
              {hero.subhead}
            </p>
          ) : null}

          {hero.quote?.text ? (
            <figure className="mt-10 border-l border-venus/40 pl-5">
              <blockquote className="font-display text-xl italic text-milkyway sm:text-2xl">
                &ldquo;{hero.quote.text}&rdquo;
              </blockquote>
              {hero.quote.attribution ? (
                <figcaption className="mt-2 text-[0.65rem] uppercase tracking-[0.24em] text-venus">
                  {hero.quote.attribution}
                </figcaption>
              ) : null}
            </figure>
          ) : null}

          <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
            {hero.primaryCta?.label && hero.primaryCta.href ? (
              <Link
                href={hero.primaryCta.href}
                className="group inline-flex items-center gap-3 rounded-full bg-milkyway px-7 py-4 text-xs font-medium uppercase tracking-[0.18em] text-galaxy transition-colors hover:bg-sky"
              >
                {hero.primaryCta.label}
                <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            ) : null}
            {hero.secondaryCta?.label && hero.secondaryCta.href ? (
              <Link
                href={hero.secondaryCta.href}
                className="inline-flex items-center gap-3 rounded-full border border-milkyway/40 px-7 py-4 text-xs font-medium uppercase tracking-[0.18em] text-milkyway transition-colors hover:bg-milkyway/10"
              >
                {hero.secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </div>

        {!isVideo && slides.length > 1 ? (
          <div className="mt-12 flex items-center gap-2">
            {slides.map((slide, slideIndex) => (
              <button
                key={`dot-${slide.asset?._id ?? slideIndex}`}
                type="button"
                onClick={() => setIndex(slideIndex)}
                aria-label={`Show hero image ${slideIndex + 1}`}
                aria-current={slideIndex === index}
                className={cn(
                  'h-px transition-all duration-500',
                  slideIndex === index ? 'w-16 bg-milkyway' : 'w-8 bg-milkyway/40 hover:bg-milkyway/70',
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
