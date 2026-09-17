'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
} from 'react'

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

/** Below this, the map is a pannable viewport rather than a fitted illustration. */
const PAN_MEDIA = '(max-width: 1023px)'
const DRAG_THRESHOLD_PX = 10
/** Wide enough that small countries stay tappable, large enough to pan around the globe. */
const MOBILE_MAP_WIDTH = 1120
const MOBILE_MAP_HEIGHT = Math.round(
  MOBILE_MAP_WIDTH * (WORLD_VIEWBOX.height / WORLD_VIEWBOX.width),
)

function subscribePanMedia(onStoreChange: () => void) {
  const media = window.matchMedia(PAN_MEDIA)
  media.addEventListener('change', onStoreChange)
  return () => media.removeEventListener('change', onStoreChange)
}

function usePannableMap() {
  return useSyncExternalStore(
    subscribePanMedia,
    () => window.matchMedia(PAN_MEDIA).matches,
    () => true,
  )
}

function clampPan(x: number, y: number, viewportW: number, viewportH: number) {
  const minX = Math.min(0, viewportW - MOBILE_MAP_WIDTH)
  const maxX = Math.max(0, viewportW - MOBILE_MAP_WIDTH)
  const minY = Math.min(0, viewportH - MOBILE_MAP_HEIGHT)
  const maxY = Math.max(0, viewportH - MOBILE_MAP_HEIGHT)

  return {
    x: Math.min(maxX, Math.max(minX, x)),
    y: Math.min(maxY, Math.max(minY, y)),
  }
}

function centeredPan(viewportW: number, viewportH: number) {
  return clampPan(
    (viewportW - MOBILE_MAP_WIDTH) / 2,
    (viewportH - MOBILE_MAP_HEIGHT) / 2,
    viewportW,
    viewportH,
  )
}

/** Countries with more photographs sit deeper in the palette. */
function shadeFor(photoCount: number) {
  if (photoCount >= 12) return 'fill-galaxy'
  if (photoCount >= 6) return 'fill-planetary'
  return 'fill-universe'
}

export function WorldMap({ countries }: WorldMapProps) {
  const router = useRouter()
  const pannable = usePannableMap()
  const viewportRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<Tooltip | null>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const gesture = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
  })

  const visited = useMemo(() => {
    const byCode = new Map<string, MapCountry>()
    for (const country of countries) {
      if (!country.isoNumeric) continue
      byCode.set(country.isoNumeric.padStart(3, '0'), country)
    }
    return byCode
  }, [countries])

  const recaptureCenter = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    setPan(centeredPan(viewport.clientWidth, viewport.clientHeight))
  }, [])

  useLayoutEffect(() => {
    if (!pannable) return
    recaptureCenter()
  }, [pannable, recaptureCenter])

  useEffect(() => {
    if (!pannable) return
    const viewport = viewportRef.current
    if (!viewport) return

    const observer = new ResizeObserver(() => {
      setPan((current) =>
        clampPan(current.x, current.y, viewport.clientWidth, viewport.clientHeight),
      )
    })
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [pannable])

  const onViewportPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pannable || event.button !== 0) return
    // Capture only after the pointer actually moves, so a tap still lands on the country.
    gesture.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y,
      moved: false,
    }
  }

  const onViewportPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pannable || gesture.current.pointerId !== event.pointerId) return
    const dx = event.clientX - gesture.current.startX
    const dy = event.clientY - gesture.current.startY
    if (Math.hypot(dx, dy) <= DRAG_THRESHOLD_PX) return

    if (!gesture.current.moved) {
      gesture.current.moved = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }

    setPan(
      clampPan(
        gesture.current.originX + dx,
        gesture.current.originY + dy,
        event.currentTarget.clientWidth,
        event.currentTarget.clientHeight,
      ),
    )
  }

  const endGesture = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (gesture.current.pointerId !== event.pointerId) return

    const didPan = gesture.current.moved
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    gesture.current.pointerId = -1

    if (didPan) return

    const slug = (event.target as Element | null)
      ?.closest?.('[data-country-slug]')
      ?.getAttribute('data-country-slug')
    if (slug) router.push(`/countries/${slug}`)
  }

  const map = (
    <svg
      viewBox={`0 0 ${WORLD_VIEWBOX.width} ${WORLD_VIEWBOX.height}`}
      role="group"
      aria-label="Interactive world map. Countries Sandy has photographed are highlighted and link to their gallery."
      className={cn(
        'block touch-none',
        pannable ? 'h-full w-full' : 'h-auto w-full',
      )}
      style={
        pannable
          ? { width: MOBILE_MAP_WIDTH, height: MOBILE_MAP_HEIGHT }
          : undefined
      }
      onMouseLeave={() => setTooltip(null)}
    >
      <path d={WORLD_SPHERE_PATH} className="fill-sky/40" />

      <g>
        {WORLD_COUNTRY_PATHS.map((shape, index) => {
          const country = visited.get(shape.id)
          const key = shape.id && shape.id !== 'undefined' ? shape.id : `${shape.name}-${index}`

          if (!country) {
            return (
              <path
                key={key}
                d={shape.d}
                className="fill-venus/55 stroke-milkyway/70"
                strokeWidth={0.4}
              />
            )
          }

          const label = `${country.name} — ${country.photoCount} photographs`
          const pathClass = cn(
            shadeFor(country.photoCount),
            'cursor-pointer stroke-milkyway/80 transition-[fill,stroke-width] duration-300',
            'hover:fill-galaxy focus-visible:fill-galaxy',
          )

          if (pannable) {
            return (
              <g key={key} data-country-slug={country.slug}>
                {/* Invisible stroke widens the tap target on small islands and states. */}
                <path
                  d={shape.d}
                  className="fill-transparent stroke-transparent"
                  strokeWidth={12}
                  pointerEvents="stroke"
                />
                <path
                  d={shape.d}
                  className={pathClass}
                  strokeWidth={0.5}
                  tabIndex={0}
                  role="link"
                  aria-label={label}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      router.push(`/countries/${country.slug}`)
                    }
                  }}
                >
                  <title>{label}</title>
                </path>
              </g>
            )
          }

          return (
            <Link
              key={key}
              href={`/countries/${country.slug}`}
              aria-label={label}
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
              <title>{label}</title>
              <path d={shape.d} className={pathClass} strokeWidth={0.5} />
            </Link>
          )
        })}
      </g>
    </svg>
  )

  return (
    <div>
      <div
        ref={viewportRef}
        className={cn(
          'relative bg-sky/25',
          pannable
            ? 'h-[min(62svh,26rem)] cursor-grab overflow-hidden touch-none overscroll-none active:cursor-grabbing'
            : 'overflow-visible',
        )}
        onPointerDown={onViewportPointerDown}
        onPointerMove={onViewportPointerMove}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
      >
        {pannable ? (
          <div
            className="origin-top-left will-change-transform"
            style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0)` }}
          >
            {map}
          </div>
        ) : (
          map
        )}

        {!pannable && tooltip ? (
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

      {pannable ? (
        <p className="mt-4 text-center text-xs text-ink/50">
          Drag the map to see the whole world, then tap a highlighted country.
        </p>
      ) : null}

      <ul className="mt-6 flex flex-wrap justify-center gap-2">
        {countries.map((country, index) => (
          <li key={country.slug || `${country.name}-${index}`}>
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
