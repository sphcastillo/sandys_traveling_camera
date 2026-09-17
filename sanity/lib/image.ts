import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

import { dataset, projectId } from '../env'

const builder = createImageUrlBuilder({ projectId, dataset })

/**
 * One high-quality source file lives in Sanity; every size, crop and format the
 * site needs is derived on the fly by the asset pipeline. `auto('format')` lets
 * the CDN pick AVIF or WebP based on the requesting browser.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format')
}

/**
 * Query param carrying the crop ratio from `buildImageSrc` to the loader.
 * The loader consumes and removes it, so the Sanity CDN never sees it.
 */
export const RATIO_PARAM = 'x-crop-ratio'

/**
 * Builds the URL that `next/image` hands to the loader.
 *
 * `width()` + `height()` + `fit('crop')` is what makes the URL builder compute a
 * hotspot-aware `rect`, but the concrete `w`/`h` are then stripped: leaving them
 * in would make the loader a no-op whenever Next happened to request that exact
 * size, and the crop ratio travels in `RATIO_PARAM` instead.
 */
export function buildImageSrc(
  source: SanityImageSource,
  { ratio, quality, referenceWidth }: { ratio?: number; quality: number; referenceWidth: number },
) {
  if (ratio === undefined) {
    const url = new URL(urlFor(source).fit('max').quality(quality).url())
    url.searchParams.delete('w')
    url.searchParams.delete('h')
    return url.toString()
  }

  const url = new URL(
    urlFor(source)
      .width(referenceWidth)
      .height(Math.round(referenceWidth / ratio))
      .fit('crop')
      .quality(quality)
      .url(),
  )

  url.searchParams.delete('w')
  url.searchParams.delete('h')
  url.searchParams.set(RATIO_PARAM, String(ratio))

  return url.toString()
}

export const ASPECT_RATIOS = {
  square: 1,
  landscape: 3 / 2,
  portrait: 2 / 3,
  tall: 4 / 5,
  cinematic: 21 / 9,
  wide: 16 / 9,
} as const

export type AspectName = keyof typeof ASPECT_RATIOS
