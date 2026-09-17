'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import {
  WORLD_COUNTRY_PATHS,
  WORLD_SPHERE_PATH,
  WORLD_VIEWBOX,
} from '@/components/map/world-paths.generated'
import { cn } from '@/lib/cn'
import type { MapCountry } from '@/sanity/lib/types'

type WorldMapProps = {
  countries: MapCountry[]
}

type Tooltip = {
  name: string
  photoCount: number
  x: number
  y: number
}

/** Countries with more photographs sit deeper in the palette. */
function shadeFor(photoCount: number) {
  if (photoCount >= 12) return 'fill-galaxy'
  if (photoCount >= 6) return 'fill-planetary'
  return 'fill-universe'
}

export function WorldMap({ countries }: WorldMapProps) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null)

  const visited = useMemo(() => {
    const byCode = new Map<string, MapCountry>()
    for (const country of countries) {
      if (!country.isoNumeric) continue
      // Sanity stores "392"; the atlas uses zero-padded ids like "004".
      byCode.set(country.isoNumeric.padStart(3, '0'), country)
    }
    return byCode
  }, [countries])

  return (
    <div>
      <div className="relative overflow-x-auto overscroll-x-contain bg-sky/25 no-scrollbar">
        <svg
          viewBox={`0 0 ${WORLD_VIEWBOX.width} ${WORLD_VIEWBOX.height}`}
          role="group"
          aria-label="Interactive world map. Countries Sandy has photographed are highlighted and link to their gallery."
          className="block h-auto w-full min-w-[46rem] sm:min-w-0"
          onMouseLeave={() => setTooltip(null)}
        >
          <path d={WORLD_SPHERE_PATH} className="fill-sky/40" />

          <g>
            {WORLD_COUNTRY_PATHS.map((shape) => {
              const country = visited.get(shape.id)

              if (!country) {
                return (
                  <path
                    key={shape.id}
                    d={shape.d}
                    className="fill-venus/55 stroke-milkyway/70"
                    strokeWidth={0.4}
                  />
                )
              }

              return (
                <Link
                  key={shape.id}
                  href={`/countries/${country.slug}`}
                  aria-label={`${country.name} — ${country.photoCount} photographs`}
                  onMouseMove={(event) => {
                    const svg = (event.currentTarget as unknown as SVGElement).ownerSVGElement
                    const rect = svg?.getBoundingClientRect()
                    if (!rect) return
                    setTooltip({
                      name: country.name,
                      photoCount: country.photoCount,
                      x: event.clientX - rect.left,
                      y: event.clientY - rect.top,
                    })
                  }}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <title>{`${country.name} — ${country.photoCount} photographs`}</title>
                  <path
                    d={shape.d}
                    className={cn(
                      shadeFor(country.photoCount),
                      'cursor-pointer stroke-milkyway/80 transition-[fill,stroke-width] duration-300',
                      'hover:fill-galaxy focus-visible:fill-galaxy',
                    )}
                    strokeWidth={0.5}
                  />
                </Link>
              )
            })}
          </g>
        </svg>

        {tooltip ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+0.75rem)] whitespace-nowrap rounded-full bg-galaxy px-4 py-2 text-xs text-milkyway shadow-lg"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <span className="font-medium">{tooltip.name}</span>
            <span className="ml-2 text-venus">{tooltip.photoCount} photos</span>
          </div>
        ) : null}
      </div>

      <p className="mt-4 text-center text-xs text-ink/50 sm:hidden">
        Drag the map sideways to explore, or tap a country below.
      </p>

      {/* A tappable index, so the smallest screens never depend on hitting a
          two-millimetre island. */}
      <ul className="mt-6 flex flex-wrap justify-center gap-2">
        {countries.map((country) => (
          <li key={country.slug}>
            <Link
              href={`/countries/${country.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-galaxy/15 px-4 py-2 text-xs text-galaxy transition-colors hover:border-galaxy/40 hover:bg-galaxy hover:text-milkyway"
            >
              {country.name}
              <span className="text-[0.65rem] opacity-60">{country.photoCount}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
