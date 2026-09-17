'use client'

import { useState } from 'react'

import { Lightbox } from '@/components/media/lightbox'
import { SanityImage } from '@/components/media/sanity-image'
import { ExpandIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'
import type { AspectName } from '@/sanity/lib/image'
import type { PhotoDoc } from '@/sanity/lib/types'

type GalleryGridProps = {
  photos: PhotoDoc[]
  columns?: number
  aspect?: AspectName
  gap?: 'tight' | 'normal' | 'roomy'
  showCaptions?: boolean
  className?: string
}

const COLUMNS: Record<number, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
}

const GAPS = {
  tight: 'gap-1.5 sm:gap-2',
  normal: 'gap-3 sm:gap-5',
  roomy: 'gap-6 sm:gap-10',
} as const

const SIZES: Record<number, string> = {
  2: '(max-width: 640px) 100vw, 50vw',
  3: '(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw',
  4: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
}

export function GalleryGrid({
  photos,
  columns = 3,
  aspect = 'landscape',
  gap = 'normal',
  showCaptions = false,
  className,
}: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const cols = COLUMNS[columns] ? columns : 3

  if (photos.length === 0) return null

  return (
    <>
      <div className={cn('grid', COLUMNS[cols], GAPS[gap], className)}>
        {photos.map((photo, index) => (
          <figure key={photo._id}>
            <button
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="group relative block w-full cursor-zoom-in overflow-hidden"
            >
              <SanityImage
                value={photo.image}
                aspect={aspect}
                sizes={SIZES[cols]}
                imageClassName="transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.05]"
              />
              <span className="pointer-events-none absolute inset-0 bg-galaxy/0 transition-colors duration-500 group-hover:bg-galaxy/15" />
              <span className="pointer-events-none absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-galaxy/55 text-milkyway opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                <ExpandIcon className="size-3.5" />
              </span>
            </button>
            {showCaptions && (photo.caption || photo.location) ? (
              <figcaption className="mt-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                {photo.caption ? (
                  <span className="font-display text-base italic text-galaxy sm:text-lg">
                    {photo.caption}
                  </span>
                ) : null}
                {photo.location ? (
                  <span className="text-[0.65rem] uppercase tracking-[0.2em] text-ink/50">
                    {photo.location}
                  </span>
                ) : null}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      <Lightbox
        photos={photos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </>
  )
}
