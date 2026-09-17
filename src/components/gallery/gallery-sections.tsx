import { GalleryGrid } from '@/components/gallery/gallery-grid'
import { MasonryGallery } from '@/components/gallery/masonry-gallery'
import { PhotoCarousel } from '@/components/gallery/photo-carousel'
import type { GallerySection, PhotoDoc } from '@/sanity/lib/types'

type GallerySectionsProps = {
  sections?: GallerySection[] | null
  /** Used when a section is set to pull "every photo in this country". */
  fallbackPhotos: PhotoDoc[]
}

function resolvePhotos(section: GallerySection, fallbackPhotos: PhotoDoc[]): PhotoDoc[] {
  const pool =
    section.source === 'manual' ? (section.photos ?? []).filter(Boolean) : fallbackPhotos
  return section.limit && section.limit > 0 ? pool.slice(0, section.limit) : pool
}

export function GallerySections({ sections, fallbackPhotos }: GallerySectionsProps) {
  if (!sections?.length) return null

  return (
    <>
      {sections.map((section) => {
        const photos = resolvePhotos(section, fallbackPhotos)
        if (photos.length === 0) return null

        const heading = (
          <>
            {section.title ? (
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl">{section.title}</h2>
            ) : null}
            {section.intro ? (
              <p className="mt-3 max-w-xl text-pretty text-[0.95rem]/relaxed text-ink/70">
                {section.intro}
              </p>
            ) : null}
          </>
        )

        const isFullBleed =
          section._type === 'galleryCarousel' && section.variant === 'fullBleed'

        return (
          <section key={section._key} className="py-12 sm:py-16">
            {section.title || section.intro ? (
              <div className="shell mb-8 sm:mb-10">{heading}</div>
            ) : null}

            <div className={isFullBleed ? undefined : 'shell'}>
              {section._type === 'galleryGrid' ? (
                <GalleryGrid
                  photos={photos}
                  columns={section.columns ?? 3}
                  aspect={section.aspect ?? 'landscape'}
                  gap={section.gap ?? 'normal'}
                  showCaptions={section.showCaptions ?? false}
                />
              ) : null}

              {section._type === 'galleryMasonry' ? (
                <MasonryGallery
                  photos={photos}
                  columns={section.columns ?? 3}
                  showCaptions={section.showCaptions ?? false}
                />
              ) : null}

              {section._type === 'galleryCarousel' ? (
                <PhotoCarousel
                  photos={photos}
                  variant={section.variant ?? 'peek'}
                  aspect={section.aspect ?? 'landscape'}
                  autoplay={section.autoplay ?? false}
                  autoplayDelay={section.autoplayDelay ?? 5}
                  showArrows={section.showArrows ?? true}
                  showDots={section.showDots ?? true}
                  showCaptions={section.showCaptions ?? false}
                  bleed={isFullBleed}
                />
              ) : null}
            </div>
          </section>
        )
      })}
    </>
  )
}
