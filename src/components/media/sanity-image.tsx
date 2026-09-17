import Image from 'next/image'

import { cn } from '@/lib/cn'
import { ASPECT_RATIOS, type AspectName, buildImageSrc } from '@/sanity/lib/image'
import type { SanityImageValue } from '@/sanity/lib/types'

/**
 * Only used to give the URL builder a large enough box to compute the crop
 * `rect` from, and as the intrinsic size Next uses for its aspect ratio. The
 * loader in sanity/lib/image-loader.ts sets the real width per srcset entry.
 */
const REFERENCE_WIDTH = 1800

type SanityImageProps = {
  value?: SanityImageValue | null
  /** Overrides the alt text stored on the asset. Pass "" for decorative images. */
  alt?: string
  /** Fixed crop. Omit to keep the photo's own proportions. */
  aspect?: AspectName | number
  /** Render as an absolutely positioned fill; the parent must be positioned. */
  fill?: boolean
  sizes: string
  quality?: 70 | 75 | 80 | 85 | 88
  priority?: boolean
  className?: string
  imageClassName?: string
}

/**
 * Every visible pixel comes from the Sanity asset pipeline: one high-quality
 * source per photograph, resized and cropped on the fly. `fit('crop')` honours
 * the hotspot the editor set in the Studio, and the LQIP from asset metadata
 * gives a blurred placeholder while the real file is on its way.
 */
export function SanityImage({
  value,
  alt,
  aspect,
  fill = false,
  sizes,
  quality = 80,
  priority = false,
  className,
  imageClassName,
}: SanityImageProps) {
  if (!value?.asset) return null

  const metadata = value.asset.metadata
  const naturalRatio = metadata?.dimensions?.aspectRatio ?? 3 / 2
  const requestedRatio =
    typeof aspect === 'number' ? aspect : aspect ? ASPECT_RATIOS[aspect] : undefined
  const ratio = requestedRatio ?? naturalRatio
  const cropped = requestedRatio !== undefined

  const referenceHeight = Math.round(REFERENCE_WIDTH / ratio)

  const src = buildImageSrc(value, {
    ratio: cropped ? ratio : undefined,
    quality,
    referenceWidth: REFERENCE_WIDTH,
  })

  const lqip = metadata?.lqip ?? undefined

  const image = (
    <Image
      src={src}
      alt={alt ?? value.alt ?? ''}
      sizes={sizes}
      quality={quality}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip}
      className={cn('h-full w-full object-cover', imageClassName)}
      {...(fill ? { fill: true } : { width: REFERENCE_WIDTH, height: referenceHeight })}
    />
  )

  if (fill) return image

  return (
    <div
      className={cn('relative overflow-hidden bg-venus/30', className)}
      style={{ aspectRatio: String(ratio) }}
    >
      {image}
    </div>
  )
}
