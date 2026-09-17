'use client'

import { useCallback, useEffect, useRef } from 'react'

import { SanityImage } from '@/components/media/sanity-image'
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, PinIcon } from '@/components/ui/icons'
import type { PhotoDoc } from '@/sanity/lib/types'

type LightboxProps = {
  photos: PhotoDoc[]
  index: number | null
  onClose: () => void
  onIndexChange: (index: number) => void
}

export function Lightbox({ photos, index, onClose, onIndexChange }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const touchStartX = useRef<number | null>(null)
  const open = index !== null && index >= 0 && index < photos.length

  const step = useCallback(
    (delta: number) => {
      if (index === null || photos.length === 0) return
      onIndexChange((index + delta + photos.length) % photos.length)
    },
    [index, onIndexChange, photos.length],
  )

  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }

    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, open, step])

  if (!open || index === null) return null

  const photo = photos[index]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption || photo.location || 'Photograph'}
      className="fixed inset-0 z-100 flex flex-col bg-galaxy/97 backdrop-blur-sm"
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null
      }}
      onTouchEnd={(event) => {
        const start = touchStartX.current
        const end = event.changedTouches[0]?.clientX
        touchStartX.current = null
        if (start === null || end === undefined) return
        const delta = end - start
        if (Math.abs(delta) > 50) step(delta < 0 ? 1 : -1)
      }}
    >
      <div className="flex items-center justify-between px-4 py-4 text-milkyway sm:px-8">
        <p className="text-xs uppercase tracking-[0.22em] text-venus">
          {index + 1} / {photos.length}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="grid size-11 place-items-center rounded-full border border-milkyway/25 transition-colors hover:bg-milkyway/10"
        >
          <span className="sr-only">Close</span>
          <CloseIcon className="size-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
        <button
          type="button"
          onClick={() => step(-1)}
          className="absolute left-2 z-10 grid size-11 place-items-center rounded-full border border-milkyway/25 text-milkyway transition-colors hover:bg-milkyway/10 sm:left-4"
        >
          <span className="sr-only">Previous photo</span>
          <ArrowLeftIcon className="size-5" />
        </button>

        <div className="relative h-full w-full">
          <SanityImage
            key={photo._id}
            value={photo.image}
            fill
            sizes="(max-width: 640px) 100vw, 90vw"
            quality={88}
            priority
            imageClassName="object-contain"
          />
        </div>

        <button
          type="button"
          onClick={() => step(1)}
          className="absolute right-2 z-10 grid size-11 place-items-center rounded-full border border-milkyway/25 text-milkyway transition-colors hover:bg-milkyway/10 sm:right-4"
        >
          <span className="sr-only">Next photo</span>
          <ArrowRightIcon className="size-5" />
        </button>
      </div>

      <div className="px-6 py-6 text-center sm:py-8">
        {photo.caption ? (
          <p className="mx-auto max-w-2xl text-balance font-display text-xl italic text-milkyway sm:text-2xl">
            {photo.caption}
          </p>
        ) : null}
        {photo.location || photo.country?.name ? (
          <p className="mt-3 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.22em] text-venus">
            <PinIcon className="size-4" />
            {[photo.location, photo.country?.name].filter(Boolean).join(', ')}
          </p>
        ) : null}
      </div>
    </div>
  )
}
