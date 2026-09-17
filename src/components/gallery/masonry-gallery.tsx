'use client'

import { useState } from 'react'

import { Lightbox } from '@/components/media/lightbox'
import { SanityImage } from '@/components/media/sanity-image'
import { ExpandIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'
import type { PhotoDoc } from '@/sanity/lib/types'

type MasonryGalleryProps = {
  photos: PhotoDoc[]
  columns?: number
  showCaptions?: boolean
  className?: string
}

const COLUMNS: Record<number, string> = {
  2: 'columns-1 sm:columns-2',
  3: 'columns-2 lg:columns-3',
  4: 'columns-2 md:columns-3 xl:columns-4',
}

const SIZES: Record<number, string> = {
  2: '(max-width: 640px) 100vw, 50vw',
  3: '(max-width: 1024px) 50vw, 33vw',
  4: '(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw',
}

/**
 * Photos keep their own proportions here — the aspect ratio comes from Sanity's
 * asset metadata, so each tile reserves the right height before the image
 * loads and the column heights never jump.
 */
export function MasonryGallery({
  photos,
  columns = 3,
  showCaptions = false,
  className,
}: MasonryGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const cols = COLUMNS[columns] ? columns : 3

  if (photos.length === 0) return null

  return (
    <>
      <div className={cn(COLUMNS[cols], 'gap-3 sm:gap-5', className)}>
        {photos.map((photo, index) => (
          <figure key={photo._id} className="mb-3 break-inside-avoid sm:mb-5">
            <button
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="group relative block w-full cursor-zoom-in overflow-hidden"
            >
              <SanityImage
                value={photo.image}
                sizes={SIZES[cols]}
                imageClassName="transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.05]"
              />
              <span className="pointer-events-none absolute inset-0 bg-galaxy/0 transition-colors duration-500 group-hover:bg-galaxy/15" />
              <span className="pointer-events-none absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-galaxy/55 text-milkyway opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                <ExpandIcon className="size-3.5" />
              </span>
            </button>
            {showCaptions && photo.caption ? (
              <figcaption className="mt-2.5 font-display text-base italic text-galaxy sm:text-lg">
                {photo.caption}
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
