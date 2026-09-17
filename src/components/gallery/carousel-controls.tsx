'use client'

import { ArrowLeftIcon, ArrowRightIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'

type ArrowsProps = {
  onPrev: () => void
  onNext: () => void
  invert?: boolean
  className?: string
}

export function CarouselArrows({ onPrev, onNext, invert = false, className }: ArrowsProps) {
  const base =
    'grid size-11 place-items-center rounded-full border transition-colors disabled:opacity-30'
  const tone = invert
    ? 'border-milkyway/30 text-milkyway hover:bg-milkyway/10'
    : 'border-galaxy/20 text-galaxy hover:bg-galaxy/5'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button type="button" onClick={onPrev} className={cn(base, tone)}>
        <span className="sr-only">Previous</span>
        <ArrowLeftIcon className="size-5" />
      </button>
      <button type="button" onClick={onNext} className={cn(base, tone)}>
        <span className="sr-only">Next</span>
        <ArrowRightIcon className="size-5" />
      </button>
    </div>
  )
}

type DotsProps = {
  count: number
  active: number
  onSelect: (index: number) => void
  invert?: boolean
  className?: string
}

export function CarouselDots({ count, active, onSelect, invert = false, className }: DotsProps) {
  if (count < 2) return null

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === active}
          className={cn(
            'h-1.5 rounded-full transition-all duration-300',
            index === active ? 'w-7' : 'w-1.5',
            invert
              ? index === active
                ? 'bg-milkyway'
                : 'bg-milkyway/40 hover:bg-milkyway/70'
              : index === active
                ? 'bg-galaxy'
                : 'bg-galaxy/25 hover:bg-galaxy/50',
          )}
        />
      ))}
    </div>
  )
}
