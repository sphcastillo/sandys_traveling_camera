'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type UseCarouselOptions = {
  count: number
  autoplay?: boolean
  delay?: number
}

/**
 * Native scroll-snap does the moving; this hook only observes which slide is in
 * view and offers programmatic jumps. That keeps momentum, rubber-banding and
 * trackpad gestures exactly as the platform intends, with no drag emulation.
 */
export function useCarousel({ count, autoplay = false, delay = 5 }: UseCarouselOptions) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return
    const slide = track.children[index] as HTMLElement | undefined
    if (!slide) return
    track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' })
  }, [])

  const step = useCallback(
    (delta: number) => {
      if (count === 0) return
      setActive((current) => {
        const next = (current + delta + count) % count
        scrollToIndex(next)
        return next
      })
    },
    [count, scrollToIndex],
  )

  // Track the slide closest to the start edge of the viewport.
  useEffect(() => {
    const track = trackRef.current
    if (!track || count === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const index = Array.prototype.indexOf.call(track.children, visible.target)
        if (index >= 0) setActive(index)
      },
      { root: track, threshold: [0.25, 0.5, 0.75, 1] },
    )

    for (const child of Array.from(track.children)) observer.observe(child)
    return () => observer.disconnect()
  }, [count])

  useEffect(() => {
    if (!autoplay || count < 2 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = window.setInterval(() => step(1), Math.max(2, delay) * 1000)
    return () => window.clearInterval(id)
  }, [autoplay, count, delay, paused, step])

  const pauseHandlers = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocusCapture: () => setPaused(true),
    onBlurCapture: () => setPaused(false),
  }

  return { trackRef, active, step, scrollToIndex, setActive, pauseHandlers }
}
