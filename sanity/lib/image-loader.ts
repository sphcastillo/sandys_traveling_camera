import type { ImageLoaderProps } from 'next/image'

import { RATIO_PARAM } from './image'

/**
 * Global `next/image` loader, wired up in next.config.ts.
 *
 * Every URL reaching this point was built by `buildImageSrc`, so it already
 * carries the hotspot-aware `rect` and, for cropped images, the crop ratio. All
 * the loader does is fill in the width Next asked for and derive the matching
 * height, which keeps the crop identical across every candidate in the srcset.
 * Nothing is re-encoded by Next — the Sanity CDN resizes and picks AVIF or WebP.
 */
export default function sanityImageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!src.startsWith('https://cdn.sanity.io/')) return src

  const url = new URL(src)
  const ratio = Number(url.searchParams.get(RATIO_PARAM))
  url.searchParams.delete(RATIO_PARAM)

  url.searchParams.set('w', String(width))
  if (ratio > 0) url.searchParams.set('h', String(Math.round(width / ratio)))
  if (quality) url.searchParams.set('q', String(quality))

  return url.toString()
}
